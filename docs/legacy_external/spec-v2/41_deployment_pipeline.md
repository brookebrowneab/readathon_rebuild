# Deployment Pipeline & CI/CD Strategy

**Target Environment**: SiteGround Shared Hosting  
**Technology Stack**: Laravel 10 + Inertia.js + Vue 3

## Overview

Continuous Integration and Deployment pipeline designed for SiteGround hosting constraints while maintaining modern DevOps practices for code quality, testing, and automated deployment.

## CI/CD Architecture

### Pipeline Environments
1. **Development** (Local): Developer machines and Docker environments
2. **Staging** (SiteGround Subdomain): Pre-production testing environment  
3. **Production** (SiteGround Main Domain): Live read-a-thon platform

### Version Control Strategy
- **Git Flow**: Feature branches → Development → Staging → Production
- **Branch Protection**: Required reviews, status checks, deployment restrictions
- **Semantic Versioning**: Major.Minor.Patch for release tracking

## GitHub Actions Workflow

### Repository Structure
```
.github/
├── workflows/
│   ├── ci.yml                 # Continuous Integration
│   ├── deploy-staging.yml     # Staging Deployment  
│   ├── deploy-production.yml  # Production Deployment
│   └── security-scan.yml      # Security & Dependency Scanning
├── ISSUE_TEMPLATE/
└── PULL_REQUEST_TEMPLATE.md
```

### Continuous Integration Pipeline

**File**: `.github/workflows/ci.yml`

```yaml
name: Continuous Integration

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root_password
          MYSQL_DATABASE: readathon_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.1
          extensions: dom, curl, libxml, mbstring, zip, pcntl, pdo, sqlite, pdo_sqlite, bcmath, soap, intl, gd, exif, iconv
          coverage: xdebug

      - name: Cache Composer packages
        uses: actions/cache@v3
        with:
          path: vendor
          key: composer-${{ hashFiles('**/composer.lock') }}

      - name: Install Composer dependencies
        run: composer install --no-progress --prefer-dist --optimize-autoloader

      - name: Copy environment file
        run: cp .env.ci .env

      - name: Generate application key
        run: php artisan key:generate

      - name: Clear config cache
        run: php artisan config:clear

      - name: Run database migrations
        run: php artisan migrate --force

      - name: Run PHPUnit tests
        run: php artisan test --coverage --min=80

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install NPM dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript type checking
        run: npm run type-check

      - name: Run Vitest unit tests
        run: npm run test:unit

      - name: Run Vitest integration tests  
        run: npm run test:integration

      - name: Build for production
        run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Composer security audit
        run: composer audit

      - name: Run NPM security audit
        run: npm audit --audit-level=high

      - name: Run PHPStan static analysis
        run: vendor/bin/phpstan analyse

      - name: Run Laravel Pint code style check
        run: vendor/bin/pint --test
```

### Staging Deployment Pipeline

**File**: `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          composer install --no-dev --optimize-autoloader
          npm ci

      - name: Build assets
        run: npm run build

      - name: Create deployment package
        run: |
          mkdir deployment-package
          rsync -av --exclude-from='.deployignore' . deployment-package/
          cd deployment-package && zip -r ../readathon-staging.zip .

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            # Backup current version
            cp -r ~/public_html/staging ~/backups/staging-$(date +%Y%m%d_%H%M%S)
            
            # Clear staging directory
            rm -rf ~/public_html/staging/*
            
            # Extract new deployment
            cd ~/public_html/staging
            unzip -o ~/readathon-staging.zip
            
            # Set permissions
            chmod -R 755 storage bootstrap/cache
            
            # Run Laravel commands
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            
            # Clear caches
            php artisan cache:clear
            php artisan queue:restart

      - name: Upload deployment package
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          source: "readathon-staging.zip"
          target: "~/"

      - name: Run staging smoke tests
        run: |
          sleep 30  # Allow application to start
          curl -f https://staging.readathon.janneyschool.org/health || exit 1

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: "Staging deployment completed: https://staging.readathon.janneyschool.org"
```

### Production Deployment Pipeline

**File**: `.github/workflows/deploy-production.yml`

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true

jobs:
  pre-deployment-checks:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run full test suite
        run: |
          composer install
          npm ci
          php artisan test
          npm run test

      - name: Security scan
        run: |
          composer audit
          npm audit --audit-level=high

      - name: Performance check
        run: npm run build:analyze

  deploy:
    runs-on: ubuntu-latest
    needs: pre-deployment-checks
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          composer install --no-dev --optimize-autoloader
          npm ci

      - name: Build production assets
        run: npm run build

      - name: Create deployment package
        run: |
          mkdir deployment-package
          rsync -av --exclude-from='.deployignore' . deployment-package/
          cd deployment-package && tar -czf ../readathon-production.tar.gz .

      - name: Deploy with blue-green strategy
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            # Blue-green deployment strategy
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_DIR="~/backups/production-$TIMESTAMP"
            
            # Create backup
            mkdir -p $BACKUP_DIR
            cp -r ~/public_html/* $BACKUP_DIR/
            
            # Deploy to temporary directory
            mkdir -p ~/deploy_temp
            cd ~/deploy_temp
            tar -xzf ~/readathon-production.tar.gz
            
            # Database backup
            mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/database.sql
            
            # Maintenance mode
            cd ~/public_html && php artisan down --render="errors::503" --secret="${{ secrets.MAINTENANCE_SECRET }}"
            
            # Atomic deployment
            rsync -av ~/deploy_temp/ ~/public_html/
            
            # Run migrations and optimizations
            cd ~/public_html
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            php artisan queue:restart
            
            # Exit maintenance mode
            php artisan up
            
            # Cleanup
            rm -rf ~/deploy_temp

      - name: Upload deployment package
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          source: "readathon-production.tar.gz"
          target: "~/"

      - name: Run production health checks
        run: |
          sleep 60  # Allow application to fully start
          
          # Test core functionality
          curl -f https://readathon.janneyschool.org/health || exit 1
          curl -f https://readathon.janneyschool.org/api/health || exit 1
          
          # Test key user flows
          curl -f https://readathon.janneyschool.org/login || exit 1
          curl -f https://readathon.janneyschool.org/register || exit 1

      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Notify stakeholders
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: "🚀 Production deployment completed: https://readathon.janneyschool.org"
```

## SiteGround-Specific Deployment Considerations

### File Structure Adaptation
```
# SiteGround file structure
~/
├── public_html/           # Web root
│   ├── .htaccess
│   ├── index.php
│   └── assets/           # Built frontend assets
├── app/                  # Laravel application (outside web root)
├── vendor/              # Composer dependencies
├── storage/             # Laravel storage (writable)
├── bootstrap/cache/     # Laravel bootstrap cache (writable)
└── .env                 # Environment configuration
```

### Deployment Script Adaptations
**File**: `scripts/siteground-deploy.sh`

```bash
#!/bin/bash

# SiteGround deployment script
set -e

DEPLOY_DIR="public_html"
APP_DIR="laravel-app"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo "Starting SiteGround deployment..."

# Create backup
mkdir -p $BACKUP_DIR
cp -r $DEPLOY_DIR $BACKUP_DIR/
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/database.sql

# Update application files (outside web root)
rsync -av --exclude='public/' --exclude='.git/' . $APP_DIR/

# Update public files
rsync -av public/ $DEPLOY_DIR/

# Update symbolic links for SiteGround
cd $DEPLOY_DIR
ln -sf ../$APP_DIR/storage/app/public storage
ln -sf ../$APP_DIR/.env .env

# Set permissions for SiteGround
find $APP_DIR/storage -type f -exec chmod 644 {} \;
find $APP_DIR/storage -type d -exec chmod 755 {} \;
find $APP_DIR/bootstrap/cache -type f -exec chmod 644 {} \;
find $APP_DIR/bootstrap/cache -type d -exec chmod 755 {} \;

# Run Laravel commands
cd $APP_DIR
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Deployment completed successfully!"
```

### Environment Configuration
**File**: `.env.production`

```env
APP_NAME="Read-a-thon Platform"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://readathon.janneyschool.org

# SiteGround Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=janneyel_readathon
DB_USERNAME=janneyel_app
DB_PASSWORD=secure_generated_password

# File-based caching for shared hosting
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database

# Mail configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.siteground.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls

# Asset configuration for SiteGround
ASSET_URL=https://readathon.janneyschool.org
MIX_ASSET_URL=https://readathon.janneyschool.org

# Optimization settings
OPTIMIZE_AUTOLOADER=true
ROUTE_CACHE=true
CONFIG_CACHE=true
VIEW_CACHE=true
```

## Build and Asset Management

### Frontend Build Process
**File**: `vite.config.js` (Production)

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    build: {
        outDir: 'public/build',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', '@inertiajs/vue3'],
                    ui: ['@headlessui/vue', '@heroicons/vue'],
                    utils: ['axios', 'lodash-es']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },
    define: {
        __VUE_PROD_DEVTOOLS__: false
    }
});
```

### Asset Optimization
```json
// package.json build scripts
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "build:production": "vite build --mode production",
    "build:siteground": "vite build && npm run copy-assets"
  }
}
```

### Deployment Exclusion Rules
**File**: `.deployignore`

```
.git/
.github/
node_modules/
tests/
storage/app/
storage/framework/cache/
storage/framework/sessions/
storage/framework/testing/
storage/framework/views/
storage/logs/
.env.example
.env.testing
.gitignore
.gitattributes
docker-compose.yml
Dockerfile
*.md
phpunit.xml
webpack.mix.js
package-lock.json
```

## Database Migration Strategy

### Production Migration Process
```bash
#!/bin/bash
# Production database migration script

# Backup before migration
php artisan backup:run --only-db

# Run migrations with rollback capability  
php artisan migrate:status
php artisan migrate --force

# Verify migration success
php artisan migrate:status

# Update application caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Migration Safety Checks
```php
// Migration safety wrapper
class SafeMigration extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('existing_table')) {
            throw new Exception('Required table does not exist');
        }
        
        DB::transaction(function () {
            // Migration logic here
        });
    }
    
    public function down()
    {
        DB::transaction(function () {
            // Rollback logic here
        });
    }
}
```

## Monitoring and Health Checks

### Application Health Endpoints
**File**: `routes/web.php`

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => config('app.version'),
        'environment' => config('app.env')
    ]);
});

Route::get('/api/health', function () {
    $checks = [
        'database' => DB::connection()->getPdo() ? 'ok' : 'error',
        'cache' => Cache::store()->getStore()->getPrefix() ? 'ok' : 'error',
        'storage' => Storage::disk('local')->exists('') ? 'ok' : 'error'
    ];
    
    return response()->json([
        'status' => in_array('error', $checks) ? 'error' : 'ok',
        'checks' => $checks,
        'timestamp' => now()->toISOString()
    ]);
});
```

### Deployment Verification Script
```bash
#!/bin/bash
# Post-deployment verification

echo "Running deployment verification..."

# Check application is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://readathon.janneyschool.org/health)
if [ $HTTP_CODE -ne 200 ]; then
    echo "❌ Health check failed: HTTP $HTTP_CODE"
    exit 1
fi

# Check database connectivity
if ! curl -s https://readathon.janneyschool.org/api/health | jq -e '.checks.database == "ok"'; then
    echo "❌ Database check failed"
    exit 1
fi

# Check key user flows
if ! curl -sf https://readathon.janneyschool.org/login > /dev/null; then
    echo "❌ Login page check failed"
    exit 1
fi

echo "✅ All deployment verification checks passed"
```

## Rollback Procedures

### Automated Rollback Script
```bash
#!/bin/bash
# Rollback deployment script

BACKUP_DIR="$1"  # Backup directory to restore from

if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: $0 <backup_directory>"
    exit 1
fi

echo "Starting rollback to $BACKUP_DIR..."

# Enter maintenance mode
php artisan down --render="errors::503"

# Restore application files
rsync -av $BACKUP_DIR/public_html/ public_html/
rsync -av $BACKUP_DIR/laravel-app/ laravel-app/

# Restore database
mysql -u$DB_USER -p$DB_PASS $DB_NAME < $BACKUP_DIR/database.sql

# Clear caches
cd laravel-app
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Exit maintenance mode
php artisan up

echo "Rollback completed successfully!"
```

### Emergency Rollback Procedure
1. **Immediate**: Switch DNS to backup server if available
2. **Quick**: Restore from latest backup using rollback script
3. **Communication**: Notify stakeholders of issue and timeline
4. **Investigation**: Identify root cause while backup system runs
5. **Resolution**: Fix issue and redeploy when ready

## Security Considerations

### Secrets Management
```yaml
# GitHub Secrets Configuration
STAGING_HOST: staging.readathon.janneyschool.org
STAGING_USERNAME: deployment_user
STAGING_SSH_KEY: |
  -----BEGIN OPENSSH PRIVATE KEY-----
  <encrypted_private_key>
  -----END OPENSSH PRIVATE KEY-----

PRODUCTION_HOST: readathon.janneyschool.org
PRODUCTION_USERNAME: prod_deploy_user
PRODUCTION_SSH_KEY: <production_ssh_key>

DB_PASSWORD: <production_database_password>
SQUARE_ACCESS_TOKEN: <production_square_token>
```

### Deployment Security Checklist
- [ ] SSH keys rotated regularly (quarterly)
- [ ] Database credentials unique per environment
- [ ] SSL certificates valid and auto-renewing
- [ ] File permissions properly restricted
- [ ] Environment variables never logged
- [ ] Backup encryption enabled
- [ ] Access logs monitored

## Performance Optimization

### Production Optimizations
```php
// Bootstrap/app.php optimizations
$app->useStoragePath(env('APP_STORAGE_PATH', base_path('storage')));

// Enable OPcache for production
if (extension_loaded('opcache')) {
    opcache_compile_file(base_path('vendor/autoload.php'));
}
```

### Asset Optimization Pipeline
1. **JavaScript**: Minification, tree-shaking, code splitting
2. **CSS**: Minification, purging unused styles
3. **Images**: Compression, WebP conversion where supported
4. **Caching**: Long-term caching headers for static assets
5. **CDN**: Asset delivery via CDN when available

This comprehensive deployment pipeline ensures reliable, secure, and efficient deployment of the read-a-thon platform to SiteGround hosting while maintaining modern DevOps practices.