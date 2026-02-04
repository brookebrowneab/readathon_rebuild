# Domain Model

**Source Documents**: 02_user_roles.md, 04_data_dictionary.md, 05_permissions_matrix.md

## Core Domain Entities

### User
**Purpose**: Base authentication entity for all adult users
**Key Fields**:
- `id` (UUID)
- `email` (unique, verified)
- `password_hash` (bcrypt)
- `created_at`, `updated_at`
- `email_verified_at`
- `last_login_at`

**Relationships**:
- Has one ParentProfile
- Has many ConsentRecords
- Has many AuditLogs

**Invariants**:
- Email must be verified for payment operations
- Password must meet complexity requirements
- Cannot be deleted if active payments exist

### ParentProfile
**Purpose**: Extended profile for parents managing children
**Key Fields**:
- `id` (UUID)
- `user_id` (FK to User)
- `first_name`, `last_name`
- `phone` (optional)
- `household_id` (UUID, groups family)
- `stripe_customer_id` (from Square)
- `communication_preferences` (JSON)

**Relationships**:
- Belongs to User
- Has many ChildProfiles
- Has many Pledges (as sponsor)
- Has many Payments

**Invariants**:
- Must have verified email to add children
- Cannot delete if children have active enrollments

### ChildProfile
**Purpose**: Child participant (COPPA/GDPR compliant, minimal data)
**Key Fields**:
- `id` (UUID)
- `parent_profile_id` (FK)
- `sponsor_code` (unique, 10-char alphanumeric, persistent across years)
- `first_name` (required)
- `last_initial` (single char)
- `display_name` (for family/class displays)
- `grade_level` (enum)
- `public_sponsor_code` (nullable, parent-generated for social sharing)
- `allow_public_sponsoring` (boolean, default false)
- `allow_self_login` (boolean, default false, parent-controlled)
- `password_hash` (nullable, only if allow_self_login enabled)
- `privacy_policy_acknowledged` (boolean, parent consent flag)
- `deleted_at` (soft delete)

**Relationships**:
- Belongs to ParentProfile
- Has many Enrollments
- Has many ReadingLogs
- Has many Pledges (received)
- Has many SponsorInvitations

**Invariants**:
- No email, phone, or full last name stored (COPPA)
- Direct authentication only if parent enables
- Age/birthdate never stored
- Must be soft-deleted, not hard-deleted
- sponsor_code is immutable and persistent across years

### Event
**Purpose**: Read-a-thon event configuration
**Key Fields**:
- `id` (UUID)
- `name`
- `school_id` (FK)
- `start_date`, `end_date`
- `pledge_due_date`
- `reading_goal_default` (minutes)
- `is_active` (boolean)
- `reading_review_threshold` (minutes, default 480 = 8 hours)
- `max_daily_reading` (minutes, default 960 = 16 hours)
- `pledge_review_flat_threshold` (decimal, default 750.00)
- `pledge_review_per_minute_threshold` (decimal, default 5.00)
- `settings` (JSON: other customizations)

**Relationships**:
- Belongs to School
- Has many Enrollments
- Has many Classrooms

**Invariants**:
- Only one active event per school
- Dates must be in logical order
- Cannot modify after pledges exist

### Enrollment
**Purpose**: Child participation in an event
**Key Fields**:
- `id` (UUID)
- `child_profile_id` (FK)
- `event_id` (FK)
- `classroom_id` (FK, optional)
- `reading_goal` (minutes)
- `total_minutes_read` (cached)
- `enrolled_at`
- `withdrawn_at` (nullable)

**Relationships**:
- Belongs to ChildProfile
- Belongs to Event
- Belongs to Classroom (optional)
- Has many ReadingLogs

**Invariants**:
- One enrollment per child per event
- Cannot enroll after event ends
- Total minutes cached but verifiable

### ReadingLog
**Purpose**: Daily reading activity entry
**Key Fields**:
- `id` (UUID)
- `enrollment_id` (FK)
- `minutes_read` (integer, 0-960, configurable max)
- `reading_date` (date)
- `entered_by` (enum: parent/teacher/student)
- `entered_at` (timestamp)
- `status` (enum: approved/pending_review/rejected)
- `approved_at` (timestamp, nullable)
- `approved_by` (FK to User, nullable)
- `book_title` (optional)
- `book_author` (optional)
- `book_isbn` (optional, normalized ISBN-13)
- `book_cover_url` (optional, external URL)

**Relationships**:
- Belongs to Enrollment

**Invariants**:
- Max one entry per enrollment per date
- Cannot exceed event's max_daily_reading limit
- Cannot be future-dated
- No backdate limit (parents can enter any past date)
- >8 hours (configurable) requires parent approval
- Cannot modify after event ends + 7 days
- ISBN stored as normalized 13-digit string (no hyphens)
- Cover URL must be from approved domains (Open Library, etc.)
- Book fields are optional - manual entry still supported

### Pledge
**Purpose**: Sponsor commitment to support a child
**Key Fields**:
- `id` (UUID)
- `child_profile_id` (FK)
- `sponsor_parent_profile_id` (FK)
- `event_id` (FK)
- `type` (enum: flat/per_minute)
- `amount` (decimal: flat amount or rate)
- `cap_amount` (optional, for per_minute)
- `calculated_total` (cached)
- `payment_timing` (enum: end_of_event/immediate, default end_of_event)
- `payment_status` (enum: pending/paid/cancelled/skipped_under_minimum)
- `collection_status` (enum: collectable/under_minimum/needs_review)
- `admin_approved` (boolean, default false)
- `anonymous` (boolean)

**Relationships**:
- Belongs to ChildProfile
- Belongs to ParentProfile (sponsor)
- Belongs to Event
- Has many PaymentItems

**Invariants**:
- Amount must be $0.00 or ≥$1.00 for flat pledges
- Amount must be ≥$0.01 for per-minute pledges
- Flat pledges >$750 flagged for review (configurable)
- Per-minute pledges >$5.00/min flagged for review (configurable)
- Final calculated totals <$1.00 not collected but still shown
- Cannot modify after payment initiated
- Immediate payment only allowed for flat pledges
- Per-minute pledges must use end_of_event timing

### Payment
**Purpose**: Square payment transaction
**Key Fields**:
- `id` (UUID)
- `parent_profile_id` (FK: payer)
- `square_payment_id` (unique)
- `square_order_id`
- `amount` (decimal)
- `status` (enum: pending/completed/failed/refunded)
- `initiated_at`
- `completed_at`
- `idempotency_key` (unique)

**Relationships**:
- Belongs to ParentProfile
- Has many PaymentItems
- Has many WebhookEvents

**Invariants**:
- Idempotency key prevents duplicates
- Status transitions are one-way
- Amount must match sum of items

### PaymentItem
**Purpose**: Line item in a payment
**Key Fields**:
- `id` (UUID)
- `payment_id` (FK)
- `pledge_id` (FK)
- `amount` (decimal)
- `description`

**Relationships**:
- Belongs to Payment
- Belongs to Pledge

**Invariants**:
- Amount must match pledge calculation
- Cannot modify after payment completed

### WebhookEvent
**Purpose**: Square webhook audit trail
**Key Fields**:
- `id` (UUID)
- `square_event_id` (unique)
- `event_type`
- `payload` (JSON)
- `signature`
- `processed_at`
- `error_message`

**Relationships**:
- Belongs to Payment (optional)

**Invariants**:
- Must verify signature
- Process exactly once (idempotent)
- Retain for audit (90 days minimum)

### ConsentRecord
**Purpose**: GDPR/COPPA consent tracking
**Key Fields**:
- `id` (UUID)
- `user_id` (FK)
- `consent_type` (enum: coppa/marketing/data_processing)
- `consented` (boolean)
- `ip_address`
- `user_agent`
- `consented_at`

**Relationships**:
- Belongs to User

**Invariants**:
- Immutable once created
- Required for child operations
- Timestamp and context required

### DataExportJob
**Purpose**: GDPR data export requests
**Key Fields**:
- `id` (UUID)
- `user_id` (FK)
- `status` (enum: pending/processing/completed/expired)
- `requested_at`
- `completed_at`
- `expires_at`
- `download_url`

**Relationships**:
- Belongs to User

**Invariants**:
- Expires after 7 days
- Includes all user and child data
- Secure download link

### DeletionRequest
**Purpose**: GDPR right to erasure
**Key Fields**:
- `id` (UUID)
- `user_id` (FK)
- `requested_at`
- `scheduled_for` (30 days later)
- `completed_at`
- `cancelled_at`

**Relationships**:
- Belongs to User

**Invariants**:
- 30-day grace period
- Cannot delete if active payments
- Cascades to all child data

### EmailTemplate
**Purpose**: Reusable templated emails with variable substitution
**Key Fields**:
- `id` (UUID)
- `school_id` (FK to School)
- `name` (template identifier)
- `subject` (template subject with variables)
- `body` (HTML template with variables)
- `category` (enum: welcome/reminder/notification/announcement)
- `variables` (JSON: available variables and descriptions)
- `is_system_template` (boolean: system vs custom)
- `is_active` (boolean)
- `created_by` (FK to User)
- `updated_by` (FK to User)
- `created_at`, `updated_at`

**Relationships**:
- Belongs to School
- Belongs to User (creator)
- Has many ScheduledEmails

**Invariants**:
- System templates cannot be deleted
- Variables must be valid database fields
- Subject and body required for active templates
- Name unique within school

### ScheduledEmail
**Purpose**: Queued and scheduled email delivery with rate limiting
**Key Fields**:
- `id` (UUID)
- `email_template_id` (FK, nullable for one-off emails)
- `school_id` (FK to School)
- `recipient_type` (enum: individual/bulk)
- `recipient_email` (for individual)
- `recipient_filter` (JSON: for bulk targeting)
- `subject` (final rendered subject)
- `body` (final rendered body)
- `variables` (JSON: variable values for rendering)
- `scheduled_for` (timestamp)
- `status` (enum: pending/queued/sending/sent/failed/cancelled)
- `sent_at` (timestamp, nullable)
- `failed_at` (timestamp, nullable)
- `failure_reason` (text, nullable)
- `created_by` (FK to User)
- `created_at`, `updated_at`

**Relationships**:
- Belongs to EmailTemplate (optional)
- Belongs to School
- Belongs to User (sender)
- Has many EmailDeliveryLogs

**Invariants**:
- Cannot modify after status changes to 'sending'
- Scheduled_for cannot be in the past (except immediate)
- Must have either template_id or direct subject/body

### EmailDeliveryLog
**Purpose**: Track individual email delivery attempts and rate limiting
**Key Fields**:
- `id` (UUID)
- `scheduled_email_id` (FK)
- `recipient_email`
- `attempt_number` (integer, starts at 1)
- `attempted_at` (timestamp)
- `status` (enum: sent/failed/bounced/rate_limited)
- `provider_id` (external provider message ID)
- `provider_response` (JSON)
- `retry_after` (timestamp, for rate limiting)

**Relationships**:
- Belongs to ScheduledEmail

**Invariants**:
- Max 3 retry attempts
- Rate limit backoff increases exponentially
- Logs retained for 90 days minimum

### AuditLog
**Purpose**: Security and compliance audit trail
**Key Fields**:
- `id` (UUID)
- `user_id` (FK, nullable)
- `action` (string)
- `entity_type`
- `entity_id`
- `old_values` (JSON)
- `new_values` (JSON)
- `ip_address`
- `user_agent`
- `created_at`

**Relationships**:
- Belongs to User (optional)

**Invariants**:
- Immutable
- Retained for 1 year minimum
- Includes all PII access

### Teacher
**Purpose**: School staff member with classroom access
**Key Fields**:
- `id` (UUID)
- `user_id` (FK to User)
- `school_id` (FK to School)
- `username` (unique within school)
- `first_name`, `last_name`
- `grade_level` (enum)
- `is_homeroom_teacher` (boolean)
- `is_active` (boolean, default true)
- `deactivated_at` (timestamp, nullable)
- `deactivation_reason` (string, nullable)
- `created_at`, `updated_at`

**Relationships**:
- Belongs to User
- Belongs to School
- Has many Classrooms

**Invariants**:
- Must have corresponding User with 'teacher' role
- Username unique within school
- Cannot be hard deleted (preserve historical data)
- Active teachers must have valid User account

### School
**Purpose**: School/organization running events
**Key Fields**:
- `id` (UUID)
- `name`
- `subdomain` (unique)
- `timezone`
- `settings` (JSON)

**Relationships**:
- Has many Events
- Has many Classrooms
- Has many Teachers

**Invariants**:
- Subdomain must be unique
- Timezone required for date calculations

### Classroom
**Purpose**: Group students by class/teacher
**Key Fields**:
- `id` (UUID)
- `school_id` (FK)
- `event_id` (FK)
- `name`
- `grade_level`
- `teacher_name`

**Relationships**:
- Belongs to School
- Belongs to Event
- Has many Enrollments

**Invariants**:
- Unique per school per event
- Grade level must be valid

### SponsorInvitation
**Purpose**: Email-based sponsor invitations (secure, grandparent-friendly)
**Key Fields**:
- `id` (UUID)
- `child_profile_id` (FK)
- `email` (sponsor email address)
- `token` (unique, secure invitation token)
- `expires_at` (timestamp, 30 days from creation)
- `used_at` (timestamp, nullable)
- `created_by` (FK to User, parent who sent invite)

**Relationships**:
- Belongs to ChildProfile
- Belongs to User (creator)

**Invariants**:
- Token must be cryptographically secure
- Expires after 30 days
- One-time use only
- Cannot be regenerated for same email/child combo if unused

## Data Minimization (COPPA/GDPR)

### Child Data Restrictions
- **Never Stored**: Email, phone, birthdate, full last name, address, photos
- **Minimal Storage**: First name + last initial only
- **No Direct Contact**: All communication through parent
- **Retention**: Deleted 1 year after event ends
- **Export**: Included in parent's data export
- **Consent**: Parent consent required and tracked

### Adult Data Restrictions
- **Minimal Collection**: Only what's needed for operations
- **Purpose Limitation**: Data used only for stated purposes
- **Consent Tracking**: Explicit consent for marketing
- **Right to Erasure**: 30-day deletion process
- **Data Portability**: JSON export on request

### Security Measures
- Encryption at rest (database)
- Encryption in transit (HTTPS)
- PII access logged
- Regular retention policy application
- Pseudonymization where possible