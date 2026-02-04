# User Behavior Requirements for Lovable Implementation

## Overview

This document defines the **actual behaviors** each user type must accomplish and the **data/inputs** required at each step. Use this to audit and complete Lovable pages.

---

# PARENT USER JOURNEY

## Parent Goal
Manage their children's participation in the read-a-thon, log reading, and collect sponsorship funds.

---

## P1. Registration

### Behavior
New parent creates a family account to enroll their children.

### Screen: Registration Form
**Required Inputs:**
| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| Username | text | Unique, 4-50 chars | Login identifier |
| Email | email | Valid format, used for recovery | Contact & password reset |
| Password | password | Min 8 chars | Authentication |
| Confirm Password | password | Must match | Prevent typos |

**Actions:**
- Submit → Create account → Redirect to Add Student flow
- Link to login for existing users

**Success State:**
- Account created
- Session started
- Redirect to "Add Your First Child" screen

---

## P2. Add Student (Child)

### Behavior
Parent adds each child who will participate. This is the FIRST thing a new parent must do.

### Screen: Add Student Form
**Required Inputs:**
| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| First Name | text | Required, 1-30 chars | Child identification |
| Last Name | text | Required, 1-30 chars | Child identification |
| Username | text | Unique, 4-16 chars | Child's login (if self-logging) |
| Password | text | Required, 4-8 chars | Child's login password |
| Grade | select | Pre-K, K, 1st, 2nd, 3rd, 4th, 5th | Class assignment |
| Teacher | select | Populated from teacher list for grade | Class assignment |
| Reading Goal | number | Default 500, min 100 | Target minutes |

**System Generated:**
- `stSponsorId`: Unique 10-char code for sponsor links

**Actions:**
- Submit → Create student → Return to dashboard
- "Add Another Child" → Repeat form
- Cancel → Return to dashboard

**UI Notes:**
- Show grade first, then filter teachers by grade
- Explain reading goal (suggest 500 mins = ~15 min/day)

---

## P3. Parent Dashboard (Landing)

### Behavior
Parent views family overview and quick-accesses all primary actions.

### Screen: Dashboard
**Displayed Data (per child):**
| Data | Source | Display |
|------|--------|---------|
| Child name | students.stFirstName + stLastName | Header |
| Grade & Teacher | students.grade, teacher | Subheader |
| Minutes read | SUM(readingLog.minutes) WHERE stSponsorId | Number + ProgressCircle |
| Reading goal | students.readingGoal | Number + percentage |
| Sponsor count | COUNT(pledges) WHERE stSponsorId | "X sponsors" |
| Total pledged | SUM(calculated pledge amounts) | Dollar amount |

**Quick Actions (per child):**
1. **Log Reading** → P4
2. **View Details** → P5
3. **Invite Sponsors** → P6
4. **Copy Sponsor Link** → Copy to clipboard

**Global Actions:**
- Add Another Child → P2
- View All Pledges → P7
- View All Reading Logs → P8

**Conditional Display:**
- If no children: Show "Add Your First Child" CTA prominently
- If event not active: Show "The read-a-thon hasn't started yet" or "The read-a-thon has ended"
- If event active: Show days remaining

---

## P4. Log Reading

### Behavior
Parent records reading time for a specific child on a specific day.

### Screen: Log Reading Form
**Pre-filled/Selected:**
- Child selector (if multiple children)

**Required Inputs:**
| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| Child | select | Required if multiple | Which child |
| Date | date | Must be within event period | When read |
| Minutes | number | Min 1, max 480 | How long |

**Optional Inputs:**
| Field | Type | Purpose |
|-------|------|---------|
| Book Title | text | Track what was read |
| Book Author | text | Track what was read |
| Notes | textarea | Additional context |

**UI Enhancements:**
- Preset buttons: 15, 30, 45, 60 minutes
- +/- stepper for fine adjustment
- Live preview: "This will bring [Child] to X minutes (Y%)"

**Actions:**
- Submit → Create readingLog entry → Success message
- After success: "Log More" or "Back to Dashboard"

**Validation:**
- Warn if logging for future date
- Warn if duplicate entry for same child + date exists
- Prevent logging outside event date range

---

## P5. Child Detail View

### Behavior
Parent views complete details for one child including reading history, sponsors, and pledges.

### Screen: Child Detail
**Sections:**

**A. Progress Overview:**
| Data | Display |
|------|---------|
| ProgressCircle | Large (220px), showing current/goal |
| Minutes read | "X of Y minutes" |
| Percentage | "Z% of goal" |
| Days remaining | "N days left" (if active) |

**B. Reading History:**
| Column | Data |
|--------|------|
| Date | readingLog.dateRead |
| Minutes | readingLog.minutes |
| Book | bookLog.title (if linked) |
| Entered by | readingLog.enteredBy |

- Edit action per row → Edit reading modal
- Delete action per row → Confirm + delete

**C. Sponsors & Pledges:**
| Column | Data |
|--------|------|
| Sponsor name | users.username (sponsor) |
| Pledge type | pledges.unit |
| Amount | pledges.amt (formatted) |
| Calculated total | amt × minutes OR flat amt |
| Status | "Paid" / "Pending" |

**Actions:**
- Edit Child Info → Edit form
- Delete Child → Confirm modal → Remove
- Log Reading → P4
- Invite More Sponsors → P6

---

## P6. Invite Sponsors

### Behavior
Parent shares child's unique sponsor link via email or copy/paste.

### Screen: Invite Sponsors
**Displayed:**
- Child's sponsor link: `{domain}/sponsor/{stSponsorId}`
- Copy button with "Copied!" feedback

**Email Invite Form:**
| Field | Type | Purpose |
|-------|------|---------|
| Recipient Email | email | Who to invite |
| Recipient Name | text | Personalize email |
| Personal Message | textarea | Optional note |

**Actions:**
- Copy Link → Clipboard
- Send Invite → Email via system
- Share buttons (optional): Facebook, Twitter, WhatsApp

**Display:**
- List of previously invited sponsors (if tracked)
- Status: Invited, Pledged, Paid

---

## P7. View All Pledges (Family)

### Behavior
Parent sees all pledges received across all children.

### Screen: Family Pledges List
**Table/List:**
| Column | Data |
|--------|------|
| Child | students.stFirstName |
| Sponsor | pledges.spUserName |
| Type | pledges.unit |
| Rate/Amount | pledges.amt |
| Calculated Total | (computed) |
| Status | Paid/Unpaid |

**Filters:**
- By child
- By status (Paid/Pending)

**Summary:**
- Total pledged: $X
- Total collected: $Y
- Outstanding: $Z

---

## P8. View All Reading Logs (Family)

### Behavior
Parent sees complete reading history across all children.

### Screen: Family Reading Logs
**Table:**
| Column | Data |
|--------|------|
| Date | readingLog.dateRead |
| Child | students.stFirstName |
| Minutes | readingLog.minutes |
| Book | bookLog.title |
| Entered | readingLog.dateEntered |

**Filters:**
- By child
- Date range

**Actions:**
- Edit (per row)
- Delete (per row)

---

# SPONSOR USER JOURNEY

## Sponsor Goal
Support a student by pledging money based on their reading and pay when event ends.

---

## S1. Sponsor Landing (via Unique Link)

### Behavior
Sponsor arrives via shared link, sees student progress, and is prompted to pledge.

### URL Pattern
`/sponsor/{stSponsorId}` - No login required to view

### Screen: Sponsor Landing
**Displayed Data (PUBLIC - privacy aware):**
| Data | Source | Display |
|------|--------|---------|
| Student first name | students.stFirstName | "Support [Name]!" |
| Grade | students.grade | "Xth grader at Janney" |
| ProgressCircle | current/goal | Visual progress |
| Minutes read | SUM(readingLog) | "X minutes read!" |
| Goal | students.readingGoal | "Goal: Y minutes" |
| Days remaining | (computed) | "Z days left" |
| Sponsor count | COUNT(pledges) | "N supporters so far" |

**NOT Displayed (privacy):**
- Last name
- Teacher name (unless permitted)
- Other sponsors' names or amounts

**Primary CTA:**
- "Make a Pledge" → S2

**Secondary:**
- Already have an account? Log in

---

## S2. Sponsor Registration/Login

### Behavior
Sponsor must have account to make pledge. If new, register. If returning, login.

### Screen: Auth Gate
**For New Sponsors:**
| Field | Type | Validation |
|-------|------|------------|
| Name | text | Required |
| Email | email | Required, becomes username |
| Password | password | Min 8 chars |

**For Returning Sponsors:**
| Field | Type |
|-------|------|
| Email | email |
| Password | password |

**After Auth:**
- Redirect to pledge form with student context preserved

---

## S3. Make a Pledge

### Behavior
Sponsor chooses pledge type and amount.

### Screen: Pledge Form
**Context Display:**
- Student name and current progress
- Reading goal

**Required Inputs:**
| Field | Type | Options/Validation |
|-------|------|-------------------|
| Pledge Type | radio/card | "Per Minute" / "Flat Amount" |

**If Per-Minute:**
| Field | Type | Validation |
|-------|------|------------|
| Amount per minute | currency | $0.01 - $1.00, default $0.05 |
| Maximum cap (optional) | currency | Optional ceiling |

**If Flat Amount:**
| Field | Type | Validation |
|-------|------|------------|
| Donation amount | currency | Min $1.00 |

**Live Calculator (Per-Minute):**
| Scenario | Display |
|----------|---------|
| Current | "At X minutes = $Y" |
| If goal reached | "At [goal] minutes = $Z" |
| If 150% of goal | "At [1.5×goal] = $W" |

**Actions:**
- "Pledge & Pay Now" → S4 (Square payment)
- "Pledge Now, Pay Later" → S5 (confirmation, pay when event ends)

---

## S4. Pay Now (Square Payment)

### Behavior
Sponsor pays immediately after pledging.

### Screen: Payment Form
**Pre-filled:**
- Sponsor name and email
- Pledge amount (for flat) or estimated amount (for per-minute)

**Square Payment Inputs:**
| Field | Type | Notes |
|-------|------|-------|
| Card Number | Square SDK | Tokenized |
| Expiration | Square SDK | MM/YY |
| CVV | Square SDK | Security code |
| ZIP | text | Billing ZIP |

**For Per-Minute (before event ends):**
- Pay estimated amount based on current minutes
- Note: "Final amount calculated when event ends"

**Actions:**
- Submit Payment → Process via Square → S6

**Error Handling:**
- Card declined → Show message, allow retry
- Network error → Show message, allow retry

---

## S5. Pledge Confirmation (Pay Later)

### Behavior
Sponsor confirms pledge, will pay when event ends.

### Screen: Confirmation
**Displayed:**
- Pledge details (student, type, amount/rate)
- Expected payment date (after event ends)
- "You'll receive an email when it's time to pay"

**Actions:**
- "Sponsor Another Student" → Start over
- "View My Pledges" → S7

---

## S6. Payment Success

### Behavior
Sponsor sees confirmation after successful payment.

### Screen: Payment Confirmation
**Displayed:**
- "Thank you!" message
- Amount paid
- Receipt link (from Square)
- Student's updated progress

**Actions:**
- View Receipt → Square receipt URL
- Sponsor Another Student
- Share with Friends (share link)

---

## S7. Sponsor Dashboard

### Behavior
Returning sponsor views all their pledges and payment status.

### Screen: My Pledges
**Table:**
| Column | Data |
|--------|------|
| Student | students.stFirstName |
| Pledge Type | pledges.unit |
| Rate/Amount | pledges.amt |
| Current Total | (calculated) |
| Status | Paid/Pending |
| Actions | Pay Now / View Receipt |

**Summary:**
- Total pledged: $X
- Total paid: $Y
- Outstanding: $Z

**Actions (per pledge):**
- Pay Now (if unpaid) → S4
- View Receipt (if paid)
- Update Pledge (if unpaid, before event ends)
- Cancel Pledge (if unpaid)

---

## S8. Payment Collection (Post-Event)

### Behavior
Sponsor returns after event to pay outstanding pledges.

### Screen: Collect Payment
**Displayed per unpaid pledge:**
| Data | Value |
|------|-------|
| Student | First name |
| Final minutes read | Locked total |
| Pledge type | Per-min / Flat |
| Amount owed | Final calculation |

**For Per-Minute Pledges:**
- Show: Rate × Final Minutes = Total
- If capped: "Capped at $X"

**Actions:**
- Select pledges to pay (checkbox per pledge)
- "Pay Selected" → S4
- "Pay All" → Pay all outstanding

---

# STUDENT USER JOURNEY

## Student Goal
Log their own reading and track their progress.

---

## St1. Student Login

### Behavior
Student logs in with simplified credentials.

### Screen: Student Login
**Inputs:**
| Field | Type | Notes |
|-------|------|-------|
| Username | text | Assigned by parent |
| Password | text | Assigned by parent |

**Design Notes:**
- Larger text and buttons (child-friendly)
- Fun, encouraging visuals
- No password reset (parent manages)

---

## St2. Student Dashboard

### Behavior
Student sees their reading progress in an engaging, age-appropriate way.

### Screen: Student Home
**Displayed:**
| Data | Display |
|------|---------|
| First name | "Hi, [Name]!" (Caveat font) |
| ProgressCircle | LARGE (280px), animated |
| Minutes read | Big number |
| Goal | "Goal: X minutes" |
| Percentage | "Y% done!" |
| Days remaining | "Z days to go!" |

**Celebrations:**
- 25% milestone: Stars animation
- 50% milestone: Bigger celebration
- 75% milestone: Almost there!
- 100%+ milestone: Confetti, "You did it!"

**Sponsor Display (child-appropriate):**
- "X people are cheering you on!"
- Names only, no amounts (inappropriate for children)

**Primary CTA:**
- Big "Log My Reading!" button → St3

---

## St3. Student Log Reading

### Behavior
Student logs their own reading with simple interface.

### Screen: Log Reading (Simplified)
**Inputs:**
| Field | Type | Notes |
|-------|------|-------|
| Minutes | number + stepper | BIG buttons, +/- |
| Presets | buttons | 15, 30, 45, 60 (as book icons) |
| What I read | text | Optional, simple |

**Date:**
- Defaults to today
- "Yesterday" button option
- No complex date picker

**UI Notes:**
- All touch targets 48px+
- Encouraging micro-copy
- Animated preview of progress updating

**Actions:**
- "I Read!" → Submit → Celebration feedback
- Back → Return to dashboard

---

# TEACHER USER JOURNEY

## Teacher Goal
Monitor class participation and access reports.

---

## T1. Teacher Registration

### Behavior
Teacher creates account with school verification.

### Screen: Teacher Registration
**Inputs:**
| Field | Type | Validation |
|-------|------|------------|
| Name | text | Required |
| Email | email | School domain preferred |
| Password | password | Min 8 chars |
| Grade | select | Pre-K through 5th |
| Homeroom | text | Room number/name |

**Note:** May require admin approval

---

## T2. Teacher Dashboard

### Behavior
Teacher views class overview with all students.

### Screen: Class Dashboard
**Header:**
- Teacher name and class
- Event status and dates
- Class aggregate stats

**Class Stats:**
| Metric | Data |
|--------|------|
| Total students | COUNT(students) WHERE teacher |
| Participating | COUNT(students with reading > 0) |
| Total minutes | SUM(all student minutes) |
| Class average | Total / participating students |
| Goal completion | Students at 100%+ |

**Student Grid/List:**
| Per Student | Data |
|-------------|------|
| Name | First + Last Initial |
| Small ProgressCircle | 64px |
| Minutes / Goal | X / Y (Z%) |
| Last logged | Date of most recent log |
| Status badge | On Track / Needs Encouragement / Exceeding |

**Status Logic:**
- "Exceeding": > 100% of goal
- "On Track": On pace for goal by end date
- "Needs Encouragement": Behind pace

**Filters/Sort:**
- Sort: Name, Progress, Last Activity
- Filter: All, Needs Attention, Goal Reached

**Actions:**
- Click student → T3 (detail view)
- Download Class Report → CSV
- Log Reading for Student → T4

---

## T3. Student Detail (Teacher View)

### Behavior
Teacher views individual student progress (limited info).

### Screen: Student Detail
**Displayed:**
| Data | Notes |
|------|-------|
| Name | Full name |
| Progress | ProgressCircle + stats |
| Reading history | Table of logs |
| Last activity | When last logged |

**NOT Displayed (privacy):**
- Sponsor names
- Pledge amounts
- Family contact info

**Actions:**
- Log Reading for This Student → T4

---

## T4. Teacher Log Reading

### Behavior
Teacher logs reading on behalf of student (e.g., classroom reading time).

### Screen: Log Reading (Teacher)
**Student Selection:**
- Searchable dropdown of class students
- Recently logged shown first

**Bulk Mode Toggle:**
- "Log for multiple students"
- Checkbox list of students
- Same date/minutes applies to all

**Inputs:**
| Field | Type | Notes |
|-------|------|-------|
| Student(s) | select/multi | Required |
| Date | date | Required |
| Minutes | number | Required |
| Activity Note | text | "Classroom read-aloud" etc. |

**Actions:**
- Submit → Create log(s) → Success
- Log Another / Back to Dashboard

---

## T5. Class Reports

### Behavior
Teacher generates and downloads class data.

### Screen: Reports
**Available Reports:**
1. **Class Summary** - Aggregate stats
2. **Student Detail** - All students with progress
3. **Daily Activity** - Reading by date
4. **Leaderboard** - Top readers

**Export Options:**
- View on screen
- Download CSV
- Print-friendly view

---

# ADMIN USER JOURNEY

## Admin Goal
Manage event, monitor all data, communicate with users, and handle payments.

---

## A1. Admin Dashboard

### Behavior
Admin sees school-wide overview and key metrics.

### Screen: Admin Home
**Event Status:**
- Current event name, dates, status
- Days remaining / days complete

**Key Metrics (Stat Cards):**
| Metric | Data |
|--------|------|
| Total Students | COUNT(students enrolled) |
| Participating | COUNT(students with logs) |
| Total Minutes | SUM(all reading minutes) |
| Total Pledged | SUM(calculated pledges) |
| Total Collected | SUM(payments) |
| Collection Rate | Collected / Pledged % |

**Charts:**
- Daily reading activity (line graph)
- Participation by grade (bar chart)
- Payment collection progress (pie/donut)

**Attention Items:**
- Unpaid pledges count
- Unverified registrations
- System alerts

---

## A2. User Management

### Behavior
Admin views and manages all user accounts.

### Screen: User List
**Table:**
| Column | Data |
|--------|------|
| Name | Display name |
| Email | Contact |
| Role | Parent/Teacher/Sponsor |
| Children/Class | Related students |
| Status | Active/Pending |
| Registered | Date |
| Last Active | Date |

**Filters:**
- By role
- By status
- By date range
- Search by name/email

**Actions (per user):**
- View Details
- Edit
- Suspend/Activate
- Impersonate (super admin)
- Send Email

**Bulk Actions:**
- Export to CSV
- Bulk email
- Bulk status change

---

## A3. Event Management

### Behavior
Admin configures read-a-thon event dates and settings.

### Screen: Event Settings
**Event Configuration:**
| Field | Type | Purpose |
|-------|------|---------|
| Event Name | text | "2024 Read-a-thon" |
| Start Date | date | When reading period begins |
| End Date | date | When reading period ends |
| Last Log Date | date | Last day to submit logs |
| Payment Deadline | date | When payments due |
| Default Goal | number | Default reading goal |

**Event Actions:**
- Save Changes
- End Event Early (with confirmation)
- Archive Event

---

## A4. Financial Management

### Behavior
Admin monitors and manages all payment activity.

### Screen: Payments Overview
**Summary:**
- Total pledged
- Total collected
- Outstanding
- Collection rate

**Payments Table:**
| Column | Data |
|--------|------|
| Date | Payment date |
| Sponsor | Payer name |
| Amount | Paid amount |
| Status | Completed/Failed |
| Receipt | Link |

**Outstanding Pledges:**
| Column | Data |
|--------|------|
| Sponsor | Name/email |
| Student | Child name |
| Amount | Owed |
| Days Outstanding | Since event end |

**Actions:**
- Send Payment Reminder (individual)
- Bulk Send Reminders
- Record Manual Payment (cash/check)
- View in Square Dashboard

---

## A5. Communications

### Behavior
Admin sends emails to user groups.

### Screen: Email Center
**Compose Email:**
| Field | Type | Purpose |
|-------|------|---------|
| Recipients | select | Parents/Teachers/Sponsors/Unpaid |
| Subject | text | Email subject |
| Body | rich text | Email content |
| Merge Fields | insert | {name}, {child}, {amount} |

**Email Templates:**
- Payment Reminder
- Event Starting
- Event Ending
- Thank You

**Email History:**
- Sent emails log
- Delivery status
- Open tracking (if enabled)

---

## A6. Reports & Export

### Behavior
Admin generates comprehensive reports.

### Screen: Reports
**Available Reports:**
1. **Participation Report** - All students, progress
2. **Financial Report** - All pledges, payments
3. **Class Comparison** - Classes ranked
4. **Grade Summary** - Aggregated by grade
5. **Sponsor Report** - All sponsors, amounts

**Export Options:**
- View on screen
- Download CSV
- Download PDF
- Print

---

# DATA REQUIREMENTS SUMMARY

## Required Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| users | All accounts | id, email, password, user_type |
| students | Child participants | id, stSponsorId, familyUserId, grade, teacher, readingGoal |
| teachers | Teacher profiles | id, userId, grade, homeroom |
| pledges | Sponsor commitments | id, pledgeId, spUserName, stSponsorId, amt, unit, paid |
| readingLog | Reading entries | id, stSponsorId, minutes, dateRead, enteredBy |
| bookLog | Books read | id, stSponsorId, title, author |
| payments | Payment records | id, pledgeId_json, paid_amt, receipt_link |
| events | Event configuration | id, name, startDate, endDate |

## Key Computed Values

| Value | Calculation |
|-------|-------------|
| Total minutes per student | SUM(readingLog.minutes) WHERE stSponsorId |
| Progress percentage | (minutes / readingGoal) × 100 |
| Per-minute pledge total | pledges.amt × student.totalMinutes |
| Flat pledge total | pledges.amt |
| Family total pledged | SUM(all child pledges) |
| Family total collected | SUM(payments for family pledges) |

## Session/State Requirements

| Session Data | When Set | Purpose |
|--------------|----------|---------|
| userId | Login | Identify current user |
| userType | Login | Route to correct dashboard |
| selectedChild | Select child | Context for actions |
| sponsorStudentId | Via URL param | Which child sponsor is viewing |
| eventActive | Computed | Control feature availability |

---

# LOVABLE IMPLEMENTATION CHECKLIST

For each screen, verify:

- [ ] All required inputs present with correct types
- [ ] All displayed data mapped to data source
- [ ] All actions wired to correct next screen
- [ ] Conditional display logic implemented
- [ ] Error states defined
- [ ] Success states defined
- [ ] Mobile layout considered
- [ ] Loading states present
- [ ] Empty states present

**Critical Flows to Test:**
1. New parent → register → add child → log reading
2. Sponsor → land via link → pledge → pay
3. Parent → share link → sponsor completes pledge
4. Student → login → log reading → see progress update
5. Teacher → view class → log for student → see update
6. Admin → view unpaid → send reminder → sponsor pays
