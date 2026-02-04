# Open Questions and Unclear Aspects

## Architecture Questions

### 1. Multi-Site Structure
- Why are there multiple duplicate directories (`/a/`, `/beta/`, `/beta23/`, `/readathon2023/`)?
- Which is the actual production code path?
- Are these different years/versions or test environments?
- Why maintain separate copies instead of version control branches?

### 2. Database Design Decisions
- Why no foreign key constraints in the database?
- Why store student passwords in plain text?
- Why use MD5 hashing (deprecated) for other passwords?
- Why duplicate admin table instead of using users table with admin role?

### 3. Session Storage
- What determines session timeout?
- Why use file-based sessions in `/tmp/`?
- Are there cleanup processes for old sessions?
- How are concurrent sessions handled?

## Business Logic Questions

### 1. Date Management
- How is `BrookeDev/startenddate.php` updated each year?
- What triggers the transition between read-a-thon cycles?
- How are historical events archived?
- Can multiple read-a-thons run concurrently?

### 2. Student Sponsor IDs
- What generates the `stSponsorId` values?
- Why not use database auto-increment?
- How is uniqueness guaranteed?
- What's the format/pattern for these IDs?

### 3. Pledge Calculations
- How are partial payments handled?
- What happens if reading minutes are adjusted after payment?
- Can sponsors modify pledges after creation?
- How are refunds processed?

### 4. Privacy Settings
- What exactly does the `privacy` field control?
- Who can see "private" students?
- How does this affect reporting and leaderboards?
- Is there COPPA compliance consideration?

## Payment Questions

### 1. Square Integration
- Why store amounts in both dollars (decimal) and cents (integer)?
- How are Square webhooks handled (if at all)?
- What happens if payment succeeds but database update fails?
- How are duplicate payments prevented?

### 2. Payment Timing
- What determines the `$lastLog_date` cutoff?
- Can sponsors pay before the read-a-thon ends?
- How long do sponsors have to pay after the event?
- Are there late payment penalties?

### 3. Financial Reconciliation
- How are cash/check payments recorded?
- How are payment disputes handled?
- What's the process for payment corrections?
- Where are tax receipts generated?

## User Management Questions

### 1. Account Lifecycle
- How are inactive accounts handled?
- Can accounts be deleted/deactivated?
- What happens to student data when they graduate?
- How are duplicate registrations prevented?

### 2. Authentication
- Why different password storage methods for different user types?
- What's the password recovery process for students?
- Can users have multiple roles?
- How are admin accounts created?

### 3. Teacher Management
- What distinguishes homeroom teachers?
- Can teachers see students from other classes?
- How are substitute teachers handled?
- What happens when teachers change grades?

## Data Integrity Questions

### 1. Orphaned Records
- What happens to pledges if a student is deleted?
- How are payments handled if pledges are deleted?
- What prevents orphaned reading logs?
- Is there a data cleanup process?

### 2. Duplicate Prevention
- How are duplicate reading entries prevented?
- Can the same book be logged multiple times?
- What prevents duplicate pledges from same sponsor?
- How are concurrent submissions handled?

### 3. Data Validation
- What validates reading minute entries?
- Are there maximum limits for daily reading?
- How is date validation handled for reading logs?
- What prevents future-dated entries?

## Technical Debt Questions

### 1. Code Duplication
- Why so many similar landing pages?
- Why duplicate configuration files?
- Why multiple payment close files?
- Could these be consolidated?

### 2. Security Concerns
- Why no CSRF protection?
- Why no SQL injection prevention in some queries?
- Why expose internal IDs in URLs?
- Why no rate limiting?

### 3. Error Handling
- How are PHP errors logged?
- Where do error_log files go?
- Is there monitoring/alerting?
- How are users notified of errors?

## Feature Questions

### 1. Pajama Jamboree
- How does SproutVideo integration work?
- Where are videos stored?
- How are videos moderated?
- What are the video requirements?

### 2. Email System
- How are email bounces handled?
- Is there unsubscribe functionality?
- How are email templates managed?
- What triggers automatic emails?

### 3. Reporting
- Why use stored procedures instead of application logic?
- How are CSV exports generated?
- Can reports be scheduled?
- Are there report caching mechanisms?

## Deployment Questions

### 1. Environment Management
- How is configuration managed across environments?
- Where are production credentials stored?
- How are deployments performed?
- Is there a staging environment?

### 2. Backup and Recovery
- How are database backups handled?
- What's the disaster recovery plan?
- How is uploaded content backed up?
- Are there point-in-time recovery capabilities?

### 3. Performance
- How many concurrent users can the system handle?
- Are there performance bottlenecks?
- Is there caching implemented?
- How are large CSV exports handled?

## Compliance Questions

### 1. Data Privacy
- How is COPPA compliance ensured?
- What's the data retention policy?
- How are data deletion requests handled?
- Is there a privacy policy implementation?

### 2. Financial Compliance
- How are financial records retained?
- Is there audit trail functionality?
- How are tax documents generated?
- What about PCI compliance beyond Square?

### 3. Accessibility
- Is the system WCAG compliant?
- How are users with disabilities accommodated?
- Is there alternative text for images?
- Are there keyboard navigation options?

## Missing Documentation

### 1. System Documentation
- No API documentation found
- No deployment guide located
- Missing database migration scripts
- No testing documentation

### 2. User Documentation
- Where are user guides?
- How are teachers trained?
- What support resources exist?
- Where are FAQs maintained?

### 3. Business Rules
- Reading minute limits?
- Pledge amount restrictions?
- Grade progression rules?
- Event scheduling constraints?

## Unclear File Purposes

### 1. Temporary/Test Files
- `landingP-tmp.php`, `landingP-test.php` - Active or deprecated?
- `loginTest.php` - Production or development?
- `error_log` files - Should these be in repository?
- `.DS_Store` files - Should be gitignored?

### 2. Utility Files
- `phpfunctionList.php` - What functions and why separate?
- `useful-functions.php` - Why in admin only?
- `call_procedure.php` - What procedures and when used?
- `copyStudentfunc.php` - What's the use case?

### 3. Alternative Versions
- Multiple payment-close files - Which is current?
- Various landing page versions - Why maintain all?
- Different email function files - Which is primary?