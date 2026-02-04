# Services and Functions

**Source Documents**: 03_user_flows.md, 07_payments_square.md, open_questions.md

## Application Services / Use Cases

### Identity & Access

#### RegisterParentAccount
**Purpose**: Create new parent account with email verification
**Inputs**:
- email: string
- password: string
- first_name: string
- last_name: string
- consent_marketing: boolean

**Outputs**:
- user: User entity
- verification_sent: boolean

**Side Effects**:
- Creates User record
- Creates ParentProfile record
- Sends verification email
- Creates ConsentRecord

**DB Objects**: User, ParentProfile, ConsentRecord

**Failure Modes**:
- Duplicate email → ValidationException
- Email send failure → queued for retry
- Weak password → ValidationException

#### AuthenticateUser
**Purpose**: Validate credentials and create session
**Inputs**:
- email: string
- password: string

**Outputs**:
- user: User entity
- session_token: string

**Side Effects**:
- Updates last_login_at
- Creates session
- Logs authentication event

**DB Objects**: User, AuditLog

**Failure Modes**:
- Invalid credentials → AuthenticationException
- Unverified email → UnverifiedAccountException
- Account locked → AccountLockedException

#### AuthenticateStudent
**Purpose**: Student login with parent permission
**Inputs**:
- sponsor_code: string (child's unique code)
- password: string

**Outputs**:
- child_profile: ChildProfile entity
- session_token: string

**Side Effects**:
- Creates student session
- Logs authentication event
- Updates last_login_at (child profile)

**DB Objects**: ChildProfile, AuditLog

**Failure Modes**:
- Invalid credentials → AuthenticationException
- Self-login not enabled → ForbiddenException
- Account disabled by parent → AccountDisabledException

### Consent Management

#### RecordConsent
**Purpose**: Track COPPA/GDPR consent
**Inputs**:
- user_id: UUID
- consent_type: enum
- consented: boolean
- ip_address: string
- user_agent: string

**Outputs**:
- consent_record: ConsentRecord

**Side Effects**:
- Creates immutable ConsentRecord
- Enables/disables features based on consent

**DB Objects**: ConsentRecord, AuditLog

**Failure Modes**:
- Missing user → NotFoundException
- Invalid consent type → ValidationException

### Event Management

#### CreateEvent
**Purpose**: Admin creates new read-a-thon event
**Inputs**:
- school_id: UUID
- name: string
- start_date: date
- end_date: date
- pledge_due_date: date
- reading_goal_default: integer

**Outputs**:
- event: Event entity

**Side Effects**:
- Deactivates previous events
- Notifies teachers

**DB Objects**: Event, School

**Failure Modes**:
- Date validation → ValidationException
- Overlapping events → ConflictException

### Teacher Management

#### CreateTeacherAccount
**Purpose**: Admin creates teacher account for new school year
**Inputs**:
- username: string
- email: string
- first_name: string
- last_name: string
- grade: string
- homeroom: boolean

**Outputs**:
- teacher: Teacher entity
- user: User entity
- invitation_sent: boolean

**Side Effects**:
- Creates User record with 'teacher' role
- Creates Teacher record
- Sends welcome email with login instructions
- Logs account creation

**DB Objects**: User, Teacher, AuditLog

**Failure Modes**:
- Duplicate email/username → ValidationException
- Invalid grade → ValidationException

#### BulkImportTeachers
**Purpose**: Annual teacher list updates via CSV upload
**Inputs**:
- csv_file: file
- replace_existing: boolean

**Outputs**:
- created_count: integer
- updated_count: integer
- errors: array

**Side Effects**:
- Processes CSV rows
- Creates/updates teacher accounts
- Deactivates missing teachers (if replace_existing)
- Sends bulk welcome emails
- Logs bulk operation

**DB Objects**: User, Teacher, AuditLog

**Failure Modes**:
- Invalid CSV format → ValidationException
- Email conflicts → skips row with error
- Partial success → returns error summary

#### DeactivateTeacher
**Purpose**: Remove teacher access without deleting data
**Inputs**:
- teacher_id: UUID
- reason: string

**Outputs**:
- teacher: Teacher entity (updated)

**Side Effects**:
- Sets teacher account as inactive
- Preserves historical data
- Logs deactivation with reason
- Revokes active sessions

**DB Objects**: Teacher, User, AuditLog

**Failure Modes**:
- Teacher not found → NotFoundException
- Already inactive → ConflictException

### Enrollment

#### EnrollHouseholdInEvent
**Purpose**: Register family for event participation
**Inputs**:
- parent_profile_id: UUID
- event_id: UUID
- child_profiles: array of child_ids

**Outputs**:
- enrollments: array of Enrollment entities

**Side Effects**:
- Creates Enrollment records
- Assigns to classrooms if specified
- Sends welcome email

**DB Objects**: Enrollment, ChildProfile, Event, Classroom

**Failure Modes**:
- Event not active → EventNotActiveException
- Child already enrolled → DuplicateEnrollmentException

#### CreateChildProfile
**Purpose**: Parent adds child (COPPA compliant)
**Inputs**:
- parent_profile_id: UUID
- first_name: string
- last_initial: string (single char)
- grade_level: enum
- classroom_id: UUID (optional)
- allow_self_login: boolean (default false)
- password: string (optional, required if allow_self_login)

**Outputs**:
- child_profile: ChildProfile entity

**Side Effects**:
- Creates minimal child record
- Generates unique 10-character sponsor_code
- Sets privacy_policy_acknowledged flag
- Logs PII access

**DB Objects**: ChildProfile, ParentProfile, AuditLog

**Failure Modes**:
- No COPPA consent → ConsentRequiredException
- Invalid grade → ValidationException
- Sponsor code collision → retry generation
- Password required if allow_self_login → ValidationException

### Reading Activity

#### LookupBookByISBN
**Purpose**: Fetch book metadata from Open Library API
**Inputs**:
- isbn: string (ISBN-10 or ISBN-13)

**Outputs**:
- book_data: object {isbn, title, authors, cover_url}

**Side Effects**:
- Validates and normalizes ISBN format
- Calls Open Library API
- Caches result for 7 days
- Logs API usage

**DB Objects**: Cache

**Failure Modes**:
- Invalid ISBN format → ValidationException
- Book not found → NotFoundException
- API rate limit → RateLimitException
- Network error → ServiceException

#### CreateReadingLog
**Purpose**: Record daily reading activity
**Inputs**:
- enrollment_id: UUID
- minutes_read: integer (0-960, configurable max)
- reading_date: date
- book_title: string (optional)
- book_author: string (optional)
- book_isbn: string (optional, normalized)
- book_cover_url: string (optional)
- entered_by: enum (parent/teacher/student)

**Outputs**:
- reading_log: ReadingLog entity
- updated_total: integer
- requires_approval: boolean

**Side Effects**:
- Creates/updates ReadingLog
- If >8 hours: sets status to 'pending_review' and sends parent email
- If ≤8 hours: sets status to 'approved'
- Updates Enrollment.total_minutes_read cache (if approved)
- Validates book cover URL if provided
- May trigger milestone notifications

**DB Objects**: ReadingLog, Enrollment

**Failure Modes**:
- Duplicate date → updates existing
- Event ended → EventEndedException
- Exceeds daily limit → ValidationException
- Student not authorized → ForbiddenException
- Invalid ISBN format → ValidationException
- Unsafe cover URL → ValidationException

#### ApproveReadingLog
**Purpose**: Parent approves high reading time entry
**Inputs**:
- reading_log_id: UUID
- approved: boolean

**Outputs**:
- reading_log: ReadingLog entity (updated)

**Side Effects**:
- Updates status to 'approved' or 'rejected'
- If approved: Updates enrollment total cache
- Logs approval decision
- Removes from parent's pending approvals list

**DB Objects**: ReadingLog, Enrollment, AuditLog

**Failure Modes**:
- Not authorized → ForbiddenException
- Already processed → ConflictException

#### GetLeaderboard
**Purpose**: Retrieve privacy-respecting rankings
**Inputs**:
- event_id: UUID
- scope: enum (school/grade/class)
- viewer_role: enum

**Outputs**:
- rankings: array of {display_name, total_minutes}

**Side Effects**:
- Logs access for audit

**DB Objects**: Enrollment, ChildProfile, ReadingLog (aggregated)

**Failure Modes**:
- No permissions → ForbiddenException

### Sponsor Management

#### CreateSponsorInvitation
**Purpose**: Parent sends email invitation to potential sponsor
**Inputs**:
- child_profile_id: UUID
- email: string
- message: string (optional, personal note)

**Outputs**:
- invitation: SponsorInvitation entity
- email_sent: boolean

**Side Effects**:
- Creates SponsorInvitation record with secure token
- Sends personalized email with invitation link
- Logs invitation creation

**DB Objects**: SponsorInvitation, ChildProfile

**Failure Modes**:
- Child not found → NotFoundException
- Invalid email → ValidationException
- Duplicate active invitation → ConflictException

#### GeneratePublicSponsorLink
**Purpose**: Parent creates shareable public sponsor link
**Inputs**:
- child_profile_id: UUID
- public_code: string (parent-chosen, human-readable)

**Outputs**:
- public_url: string
- updated_child: ChildProfile entity

**Side Effects**:
- Updates child's public_sponsor_code
- Enables allow_public_sponsoring flag
- Logs public link generation

**DB Objects**: ChildProfile

**Failure Modes**:
- Code already taken → ValidationException
- Invalid code format → ValidationException

#### DisableSponsorAccess
**Purpose**: Parent revokes sponsor access methods
**Inputs**:
- child_profile_id: UUID
- revoke_invitations: boolean (default true)
- revoke_public_link: boolean (default true)

**Outputs**:
- revoked_count: integer

**Side Effects**:
- Expires unused invitations
- Disables public sponsor link
- Logs access revocation

**DB Objects**: ChildProfile, SponsorInvitation

**Failure Modes**:
- Child not found → NotFoundException

### Pledge Management

#### CreatePledge
**Purpose**: Sponsor commits to support child
**Inputs**:
- child_profile_id: UUID
- sponsor_parent_profile_id: UUID
- event_id: UUID
- type: enum (flat/per_minute)
- amount: decimal
- cap_amount: decimal (optional)
- payment_timing: enum (end_of_event/immediate, default end_of_event)
- anonymous: boolean

**Outputs**:
- pledge: Pledge entity
- notification_sent: boolean
- needs_review: boolean

**Side Effects**:
- Creates Pledge record
- Validates amount rules ($0 or ≥$1 flat, ≥$0.01 per-minute)
- Validates payment timing (immediate only for flat pledges)
- Flags for admin review if over thresholds
- Sends notification to family
- Updates sponsor list

**DB Objects**: Pledge, ChildProfile, ParentProfile

**Failure Modes**:
- Child not enrolled → NotFoundException
- Invalid amount → ValidationException (violates business rules)
- Event ended → EventEndedException
- Immediate payment with per-minute pledge → ValidationException

#### CreatePledgeWithImmediatePayment
**Purpose**: Create flat pledge and process payment in one transaction
**Inputs**:
- child_profile_id: UUID
- sponsor_parent_profile_id: UUID
- event_id: UUID
- amount: decimal (flat only)
- payment_nonce: string (from Square SDK)
- anonymous: boolean
- idempotency_key: string

**Outputs**:
- pledge: Pledge entity
- payment: Payment entity
- receipt_url: string

**Side Effects**:
- Creates Pledge record with payment_timing='immediate'
- Validates amount rules ($0 or ≥$1 flat only)
- Creates Payment record
- Calls Square API immediately
- Updates pledge status to 'paid' if successful
- Sends confirmation email to sponsor and family

**DB Objects**: Pledge, Payment, PaymentItem, ParentProfile

**Failure Modes**:
- Square payment failure → PaymentException (pledge still created)
- Invalid amount → ValidationException
- Per-minute pledge attempted → ValidationException
- Duplicate idempotency key → returns existing payment

#### CalculatePledgeTotals
**Purpose**: Compute final pledge amounts after event
**Inputs**:
- event_id: UUID

**Outputs**:
- calculations: array of {pledge_id, calculated_total, collection_status}

**Side Effects**:
- Updates Pledge.calculated_total
- Sets collection_status: 'collectable', 'under_minimum', or 'needs_review'
- Sets payment_status to 'skipped_under_minimum' for <$1.00 totals
- Sends payment reminders only for collectable pledges

**DB Objects**: Pledge, Enrollment, ReadingLog

**Failure Modes**:
- Event not ended → EventNotEndedException

### Payment Processing

#### InitiateSquarePayment
**Purpose**: Process payment via Square
**Inputs**:
- parent_profile_id: UUID
- pledge_ids: array of UUIDs
- payment_nonce: string (from Square SDK)
- idempotency_key: string

**Outputs**:
- payment: Payment entity
- receipt_url: string

**Side Effects**:
- Creates Payment record
- Creates PaymentItems
- Calls Square API
- Updates pledge statuses

**DB Objects**: Payment, PaymentItem, Pledge, ParentProfile

**Failure Modes**:
- Duplicate idempotency key → returns existing
- Square API error → PaymentException
- Invalid nonce → ValidationException

**Idempotency Strategy**:
- Unique idempotency_key required
- Check for existing payment first
- Return existing if found
- Lock pledges during processing

#### HandleSquareWebhook
**Purpose**: Process Square payment webhooks
**Inputs**:
- event_id: string
- event_type: string
- payload: JSON
- signature: string

**Outputs**:
- processed: boolean

**Side Effects**:
- Creates WebhookEvent record
- Updates Payment status
- Updates Pledge payment_status
- Sends receipt email

**DB Objects**: WebhookEvent, Payment, Pledge

**Failure Modes**:
- Invalid signature → SecurityException
- Duplicate event → returns success (idempotent)
- Payment not found → logged but succeeds

**Idempotency Strategy**:
- Check square_event_id uniqueness
- Return success if already processed
- Use database transaction for updates

### Data Privacy

#### ExportParentData
**Purpose**: GDPR data portability
**Inputs**:
- user_id: UUID

**Outputs**:
- export_job: DataExportJob entity

**Side Effects**:
- Queues export job
- Compiles all user and child data
- Generates secure download link
- Sends notification email

**DB Objects**: All user-related entities

**Failure Modes**:
- Export in progress → ConflictException

#### DeleteParentData
**Purpose**: GDPR right to erasure
**Inputs**:
- user_id: UUID
- confirmed: boolean

**Outputs**:
- deletion_request: DeletionRequest entity

**Side Effects**:
- Schedules deletion for 30 days
- Sends confirmation email
- Blocks new operations

**DB Objects**: DeletionRequest, User, ParentProfile, ChildProfile

**Failure Modes**:
- Active payments → CannotDeleteException
- Unconfirmed → requires confirmation

#### ApplyRetentionPolicy
**Purpose**: Automated data cleanup (scheduled)
**Inputs**:
- None (cron job)

**Outputs**:
- deleted_count: integer
- archived_count: integer

**Side Effects**:
- Deletes old reading logs (>1 year)
- Archives completed events (>2 years)
- Removes expired exports
- Processes scheduled deletions

**DB Objects**: ReadingLog, Event, DataExportJob, DeletionRequest

**Failure Modes**:
- Database lock → retry with backoff

### Email Template Management

#### CreateEmailTemplate
**Purpose**: Admin creates reusable email template with variables
**Inputs**:
- school_id: UUID
- name: string
- subject: string (with variable placeholders)
- body: string (HTML with variable placeholders)
- category: enum
- variables: array (available database fields)

**Outputs**:
- template: EmailTemplate entity

**Side Effects**:
- Creates EmailTemplate record
- Validates variable syntax
- Logs template creation

**DB Objects**: EmailTemplate, AuditLog

**Failure Modes**:
- Invalid variable syntax → ValidationException
- Duplicate name → ConflictException

#### UpdateEmailTemplate
**Purpose**: Modify existing email template
**Inputs**:
- template_id: UUID
- subject: string (optional)
- body: string (optional)
- is_active: boolean (optional)

**Outputs**:
- template: EmailTemplate entity (updated)

**Side Effects**:
- Updates template fields
- Validates variable syntax
- Logs template modification

**DB Objects**: EmailTemplate, AuditLog

**Failure Modes**:
- System template modification → ForbiddenException
- Template in use → requires confirmation

#### RenderEmailTemplate
**Purpose**: Generate final email content with variable substitution
**Inputs**:
- template_id: UUID
- recipient_data: object (database values for variables)

**Outputs**:
- rendered_subject: string
- rendered_body: string

**Side Effects**:
- Substitutes variables with actual data
- Logs template usage

**DB Objects**: EmailTemplate

**Failure Modes**:
- Missing variable data → uses default values
- Invalid template → TemplateException

### Email Scheduling and Delivery

#### ScheduleEmail
**Purpose**: Queue email for immediate or delayed delivery
**Inputs**:
- template_id: UUID (optional)
- recipient_type: enum (individual/bulk)
- recipient_filter: object (for bulk)
- recipient_email: string (for individual)
- variables: object (data for substitution)
- scheduled_for: datetime (optional, defaults to now)

**Outputs**:
- scheduled_email: ScheduledEmail entity

**Side Effects**:
- Creates ScheduledEmail record
- Renders template with variables
- Queues for delivery worker

**DB Objects**: ScheduledEmail, EmailTemplate

**Failure Modes**:
- Invalid schedule time → ValidationException
- Template not found → NotFoundException

#### ProcessEmailQueue
**Purpose**: Background worker to send queued emails with rate limiting
**Inputs**:
- None (cron job/queue worker)

**Outputs**:
- processed_count: integer
- failed_count: integer

**Side Effects**:
- Processes pending ScheduledEmails
- Implements rate limiting (100 emails/hour default)
- Creates EmailDeliveryLog records
- Updates ScheduledEmail status

**DB Objects**: ScheduledEmail, EmailDeliveryLog

**Failure Modes**:
- Rate limit exceeded → schedules retry
- Provider error → exponential backoff

#### SendBulkEmail
**Purpose**: Send templated email to filtered recipients
**Inputs**:
- template_id: UUID
- recipient_filter: object
- scheduled_for: datetime (optional)
- variables: object (global variables)

**Outputs**:
- scheduled_count: integer
- estimated_delivery: datetime

**Side Effects**:
- Creates multiple ScheduledEmail records
- Applies recipient filtering
- Queues for batch delivery

**DB Objects**: ScheduledEmail, EmailTemplate

**Failure Modes**:
- No matching recipients → EmptyRecipientException
- Template inactive → ValidationException

### Communication

#### SendPaymentReminder
**Purpose**: Notify sponsors of unpaid pledges
**Inputs**:
- event_id: UUID
- dry_run: boolean

**Outputs**:
- sent_count: integer
- skipped_count: integer

**Side Effects**:
- Queues email jobs
- Updates last_reminder_sent timestamps
- Creates communication log

**DB Objects**: Pledge, ParentProfile, CommunicationLog

**Failure Modes**:
- Email service down → queued for retry

### Reporting

#### GenerateEventReport
**Purpose**: Create comprehensive event statistics
**Inputs**:
- event_id: UUID
- include_financial: boolean

**Outputs**:
- report: JSON/CSV
- metrics: {total_minutes, total_pledged, total_collected}

**Side Effects**:
- Logs report access
- May cache results

**DB Objects**: Event, Enrollment, ReadingLog, Pledge, Payment

**Failure Modes**:
- Insufficient permissions → ForbiddenException

## Service Layer Patterns

### Transaction Management
- Use database transactions for multi-step operations
- Rollback on any failure
- Explicit commit points

### Error Handling
- Domain-specific exceptions
- User-friendly error messages
- Detailed logging for debugging
- Graceful degradation where possible

### Validation
- Input validation at service boundary
- Business rule validation in domain
- Return specific validation errors

### Authorization
- Check permissions before operations
- Log all access to PII
- Fail closed (deny by default)

### Caching Strategy
- Cache read-heavy aggregations
- Invalidate on writes
- TTL-based expiration
- Warm cache for common queries

### Queue Usage
- Email sending → always queued with rate limiting
- Email template rendering → cached for reuse
- Exports → background job
- Webhooks → immediate with queue fallback
- Retention → scheduled job

### Email Rate Limiting Strategy
- Gmail SMTP: 100 emails/hour, 500 emails/day
- Exponential backoff on rate limit errors
- Multiple provider fallback (Gmail → SendGrid → Mailgun)
- Batch processing with delays between sends
- Queue priority: transactional > reminders > bulk