# User Flows

## 1. Family Registration and Setup Flow

### Initial Registration
1. User navigates to `register.php`
2. Provides username, email, password
3. System validates username uniqueness
4. Creates account with `user_type: 'parent'`
5. Redirects to `myaccount.php`

### Adding Students
1. Parent logs into `myaccount.php`
2. Uses "Add Student" form
3. Provides: first name, last name, username, password, grade, teacher, reading goal
4. System generates unique `stSponsorId`
5. Student linked to parent via `familyUserid`
6. Can add multiple students

### Student Account Management
- Edit student: Modify grade, teacher, reading goal
- Delete student: Remove from family (`del.php`)
- Privacy settings: Control visibility

## 2. Sponsor Pledge Flow

### Sponsor Acquisition
1. Parent shares unique sponsor link (contains `stSponsorId`)
2. Sponsor clicks link → `register.php?sponsor_id=XXX`
3. If not registered: Creates account
4. If registered: Logs in
5. Redirects to `pledge.php?sponsor_id=XXX`

### Making a Pledge
1. Sponsor views student information
2. Selects pledge type:
   - **One-time**: Fixed dollar amount
   - **Per-minute**: Amount per reading minute
3. Enters pledge amount
4. Submits pledge
5. System creates pledge record with `paid: 0`
6. Confirmation displayed

### Multiple Student Pledges
- Sponsor can pledge to multiple students
- Each pledge tracked separately
- Unique `pledgeId` per commitment

## 3. Reading Log Entry Flow

### Parent Entry
1. Parent logs into `myaccount.php`
2. Sees list of their students
3. For each student can:
   - Enter minutes read for specific date
   - Add books completed (title, author)
4. Submits reading log
5. System updates `readingLog` table
6. Running totals recalculated

### Student Self-Entry
1. Student logs in with credentials
2. Redirected to `landingSt.php` (active period)
3. Enters daily reading minutes
4. Can log books read
5. Views personal progress

### Teacher Monitoring
1. Teacher logs into `landingT.php`
2. Views class roster
3. Sees aggregate class statistics
4. Can download CSV reports
5. Monitors individual student progress

## 4. Payment Collection Flow

### Pre-Payment Phase
1. Read-a-thon active period ends
2. System calculates final amounts:
   - One-time pledges: Fixed amount
   - Per-minute: Rate × total minutes

### Payment Initiation
1. Sponsor logs into account
2. Navigates to payment page
3. System displays outstanding pledges
4. For per-minute pledges after cutoff date:
   - Shows calculated total
   - Displays student's reading minutes

### Square Payment Process
1. Sponsor selects pledges to pay (`square-payment/payment.php`)
2. Provides payment information:
   - Email address
   - Card details (tokenized)
3. System creates Square customer (if new)
4. Creates Square order with line items
5. Processes payment via Square API
6. On success:
   - Updates pledge `paid` status
   - Stores `payment_id` and `order_id`
   - Generates receipt link
7. Redirects to confirmation page

### Payment Tracking
- System records in `payments` table
- Email receipt sent via Square
- Pledge status updated
- Available in sponsor's account history

## 5. Administrative Flows

### Email Reminder Flow
1. Admin logs into `/admin/`
2. Navigates to email functions
3. System identifies unpaid pledges
4. Checks `lastEmailSent` to avoid duplicates
5. Sends bulk reminders via PHPMailer
6. Updates `lastEmailSent` table

### Reporting Flow
1. Admin accesses reporting dashboard
2. Can generate:
   - School-wide statistics
   - Top readers by grade
   - Top classes
   - Financial summaries
3. Downloads CSV exports
4. Uses stored procedures for aggregation

### Data Management
1. View all users and roles
2. Access payment reconciliation
3. Monitor system-wide activity
4. Handle support issues

## 6. Special Event Flows

### Pajama Jamboree (Video Submission)
1. Student/parent accesses `pjamboree.php`
2. Uploads video via SproutVideo API
3. Video linked to student record
4. Confirmation of submission

### Re-enrollment Flow
1. Returning families access `reenroll.php`
2. System finds existing account
3. Updates student information:
   - New grade level
   - New teacher
   - Reset reading goals
4. Preserves account history

### Password Reset Flow
1. User clicks "Forgot Password"
2. Enters username
3. System generates reset token
4. Sends email with reset link
5. User clicks link → `reset-password.php`
6. Provides new password
7. Token validated and expires
8. Password updated (MD5 hash)

## 7. Date-Dependent Behaviors

### During Active Period
- Full reading log entry enabled
- Real-time progress tracking
- Sponsor can view live progress
- Landing pages show active content

### Post-Event (Before Payment Deadline)
- Reading logs locked
- Payment collection active
- Final tallies displayed
- Reminder emails sent

### Off-Season
- Limited functionality
- Historical data viewable
- Registration still available
- Teachers retain access

## 8. Error Handling Flows

### Authentication Failures
- Invalid credentials → Error message
- Session timeout → Redirect to login
- Unauthorized access → Redirect to appropriate page

### Payment Failures
- Square API errors → Error display
- Invalid card → Retry prompt
- Network issues → Transaction rollback

### Data Entry Errors
- Duplicate entries → Warning message
- Invalid data → Validation errors
- Missing required fields → Form rejection