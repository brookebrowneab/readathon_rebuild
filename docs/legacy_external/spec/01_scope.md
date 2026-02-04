# System Scope and Boundaries

## System Name
Janney School Read-a-thon Management System

## Primary Purpose
A web-based platform for managing school read-a-thon fundraising events, including student reading tracking, sponsor pledge management, and payment processing.

## Core Functionality

### 1. User Management
- Multi-role authentication system (parents, students, teachers, sponsors, administrators)
- Family-based account structure where parents manage multiple students
- Password reset capability with token-based email verification
- Session-based authentication using PHP sessions

### 2. Reading Activity Tracking
- Student reading log entries (minutes per day)
- Book tracking (title and author)
- Manual and automated entry methods
- Configurable read-a-thon date ranges (controlled via `BrookeDev/startenddate.php`)

### 3. Pledge Management
- Two pledge types: one-time donations and per-minute pledges
- Sponsor-to-student pledge relationships
- Pledge tracking with unique sponsor IDs
- Support for multiple pledges per sponsor

### 4. Payment Processing
- Square API integration for payment collection
- Customer management and card tokenization
- Order creation with line items for each pledge
- Receipt generation and email distribution
- Payment status tracking and reconciliation

### 5. Reporting and Analytics
- School-wide reading statistics
- Class and grade-level leaderboards
- Top readers by grade
- Financial reporting (pledges vs payments)
- CSV data export functionality

### 6. Communication
- Automated email reminders for unpaid pledges
- PHPMailer integration for transactional emails
- Email tracking to prevent duplicate reminders
- Sponsor notification system

## System Boundaries

### In Scope
- Web-based access via browser
- MySQL database for persistent storage
- Square payment gateway integration
- Email-based communication
- CSV data exports
- Teacher administrative functions
- Privacy controls for student information

### Out of Scope
- Mobile native applications
- Real-time notifications (uses email only)
- Direct bank transfers or cash payment tracking
- Student-to-student interactions
- Social media integration
- Automated reading verification
- Multi-school support (single school only)

## Technical Boundaries

### Technology Stack
- **Backend**: PHP 8.2
- **Database**: MySQL 8.0
- **Payment Gateway**: Square API v25.1.0
- **Email**: PHPMailer 6.7
- **Video**: SproutVideo API 1.3.3
- **Frontend**: HTML, CSS, vanilla JavaScript
- **Dependencies**: Composer for PHP package management

### Infrastructure
- Traditional LAMP stack deployment
- File-based PHP sessions stored in `/tmp/`
- Direct MySQL connections (no ORM)
- Synchronous request/response model
- No caching layer
- No CDN or asset optimization

## Data Boundaries

### Data Retention
- User accounts persist indefinitely
- Reading logs maintained per event cycle
- Payment records kept for reconciliation
- Session data expires based on PHP configuration

### Privacy Controls
- Student privacy settings at individual level
- No public-facing student information without authentication
- Sponsor access limited to pledged students
- Teacher access limited to their class

## Temporal Boundaries

### Event Lifecycle
- Pre-event: Registration and setup
- Active period: Reading logging and tracking (configurable dates)
- Post-event: Payment collection and reporting
- System remains accessible year-round with different features enabled

### Time-Based Features
- Read-a-thon active dates control available features
- Password reset tokens have expiration dates
- Session timeout based on PHP configuration
- No real-time updates (page refresh required)

## Integration Points

### External Services
1. **Square Payment Gateway**
   - Payment processing
   - Customer management
   - Receipt generation

2. **Email Services**
   - PHPMailer for SMTP
   - Configured sender: janneyreadathon@janneyschool.org

3. **SproutVideo**
   - Video upload and hosting capabilities
   - Pajama Jamboree video submissions

### No Integrations With
- School information systems
- Library management systems
- Reading assessment tools
- Parent communication platforms
- Accounting software (manual reconciliation only)