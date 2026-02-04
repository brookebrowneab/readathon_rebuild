# Architecture Proposal

**Source Documents**: 01_scope.md, 02_user_roles.md, 03_user_flows.md, 07_payments_square.md

## Architectural Style

**Modular Monolith** - A single Laravel application with clear module boundaries, deployed as one unit to SiteGround.

### Rationale
- Simplified deployment on shared hosting (SiteGround)
- Single database connection pool
- Easier session management
- Lower operational complexity
- Natural fit for Laravel's structure

## Key Modules/Boundaries

### 1. Identity Module
- **Purpose**: Authentication, authorization, session management
- **Components**: 
  - Laravel Sanctum for session auth
  - Custom policies for parent-child relationships
  - Password reset flows
- **Boundaries**: No direct DB access from other modules to users table

### 2. Event Management Module  
- **Purpose**: Read-a-thon event lifecycle
- **Components**:
  - Event creation and configuration
  - Date range management
  - School/class organization
- **Boundaries**: Publishes events for enrollment changes

### 3. Enrollment Module
- **Purpose**: Family and student participation
- **Components**:
  - Household enrollment
  - Child profile management (parent-managed)
  - Teacher assignments
  - Privacy settings
- **Boundaries**: Validates against Event Module rules

### 4. Reading Activity Module
- **Purpose**: Track reading progress
- **Components**:
  - Reading log entries
  - Book tracking
  - Progress calculations
  - Leaderboards (respecting privacy)
- **Boundaries**: Read-only access to enrollment data

### 5. Pledge Module
- **Purpose**: Sponsor commitments
- **Components**:
  - Pledge creation (one-time, per-minute)
  - Pledge tracking
  - Amount calculations
- **Boundaries**: Triggers payment requests when ready

### 6. Payment Module
- **Purpose**: Square integration and reconciliation
- **Components**:
  - Payment initiation
  - Square API client
  - Webhook handler
  - Receipt management
- **Boundaries**: Isolated Square SDK, async webhook processing

### 7. Communication Module
- **Purpose**: Email notifications
- **Components**:
  - Transactional emails (Laravel Mail)
  - Bulk notifications
  - Unsubscribe management
- **Boundaries**: Queue-based sending

### 8. Compliance Module
- **Purpose**: GDPR/COPPA adherence
- **Components**:
  - Consent management
  - Data export
  - Data deletion
  - Audit logging
- **Boundaries**: Cross-cutting concern with hooks in all modules

### 9. Reporting Module
- **Purpose**: Analytics and exports
- **Components**:
  - School/class/grade statistics
  - Financial reports
  - CSV exports
- **Boundaries**: Read-only replicated views

## Data Flow Overview

### Request Lifecycle
1. **HTTP Request** → Laravel Router
2. **Middleware Stack**:
   - Session authentication (Sanctum)
   - CSRF protection
   - Rate limiting
   - Consent verification (for child data)
3. **Controller** → validates input
4. **Service Layer** → business logic
5. **Repository/Model** → database operations
6. **Inertia Response** → Vue 3 component with props
7. **Vue Rendering** → client-side interactivity

### Authentication Flow
1. Parent registers/logs in → session created
2. Session contains: user_id, role, active_event_id
3. Child profiles accessed via parent session
4. No direct child authentication
5. Sponsors authenticate as special parent accounts

### Payment Flow
1. **Initiation**: Parent/Sponsor → Payment Module
2. **Tokenization**: Square Web SDK → creates nonce
3. **Processing**: Payment Module → Square API
4. **Webhook**: Square → webhook endpoint
5. **Reconciliation**: Webhook handler → updates pledges
6. **Notification**: Email sent with receipt

### Webhook Handling
1. **Receipt**: POST to /webhooks/square
2. **Verification**: HMAC signature validation
3. **Queue**: Job dispatched to process
4. **Processing**: Idempotent state updates
5. **Logging**: Audit trail created

## Hosting/Operations (SiteGround + MySQL)

### SiteGround Constraints
- **PHP Version**: 8.2+ (matches SiteGround offerings)
- **Memory Limit**: 256MB typical
- **Execution Time**: 30-60 seconds max
- **Storage**: Local filesystem for uploads
- **Cron Jobs**: Laravel scheduler via cPanel

### Database Strategy
- **Connection**: Single MySQL 8.0 connection
- **Migrations**: Laravel migrations with rollback support
- **Indexes**: Optimized for read-heavy operations
- **Backup**: Daily via SiteGround + Laravel backup package
- **Connection Pooling**: Managed by SiteGround

### Performance Optimizations
1. **Caching**:
   - Laravel cache (file/database driver)
   - View caching
   - Route caching
   - Config caching

2. **Queue Processing**:
   - Database queue driver (compatible with shared hosting)
   - Cron-triggered processing every minute
   - Priority queues for payments

3. **Asset Management**:
   - Vite for bundling
   - CDN for static assets (optional)
   - Image optimization on upload

### Security Layers
1. **Application**:
   - HTTPS enforced
   - CSRF tokens
   - XSS protection via Vue
   - SQL injection prevention (Eloquent)

2. **Infrastructure**:
   - SiteGround firewall
   - DDoS protection
   - SSL certificate
   - Regular security updates

### Monitoring
- Laravel Telescope (development)
- Error tracking via Laravel's built-in logging
- Custom health checks at /health
- Payment reconciliation alerts

### Deployment Strategy
1. **Version Control**: Git repository
2. **Deployment Method**: 
   - Git pull on server
   - Or deployment via SiteGround's staging
3. **Migration Process**:
   - Maintenance mode
   - Database backup
   - Run migrations
   - Clear caches
   - Restart queue workers

### Backup and Recovery
- **Database**: Daily automated backups (30-day retention)
- **Files**: Weekly full backup
- **Code**: Git repository
- **Recovery Time Objective**: 4 hours
- **Recovery Point Objective**: 24 hours

## Module Communication

### Synchronous
- Direct service calls within same request
- Database transactions for consistency
- Shared repositories for read operations

### Asynchronous  
- Laravel jobs for email sending
- Webhook processing via queues
- Bulk operations (exports, reports)
- Scheduled tasks (retention, cleanup)

## Scalability Considerations

### Vertical Scaling (SiteGround)
- Upgrade hosting plan as needed
- Increase PHP memory/execution limits
- Database optimization via indexes

### Horizontal Scaling (Future)
- Database read replicas
- Queue workers on separate instance
- CDN for assets
- Caching layer (Redis/Memcached)