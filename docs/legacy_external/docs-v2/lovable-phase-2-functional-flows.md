# Lovable Phase 2: Functional User Flows

## What Was Built (Phase 1)
- Design system (colors, typography, spacing)
- Core components (BookContainer, ProgressCircle, buttons, forms)
- Basic page layouts

## What's Missing
- Actual user journeys with correct flow logic
- Data connections between screens
- Senior-friendly sponsor experience
- Parent self-sponsorship during enrollment
- COPPA/GDPR compliant sponsor acquisition
- Magic link authentication
- Check/cash payment options

---

# PRIORITY 1: Parent Registration → Child Enrollment → Self-Pledge

This is the primary onboarding flow. Get this right first.

---

## Prompt 2.1: Parent Registration Flow

```
Create the parent registration flow with these connected screens:

SCREEN 1: REGISTRATION FORM
Route: /register

Layout:
- Split screen: illustration left (40%), form right (60%)
- Mobile: form only, full width
- BookContainer wrapping form area

Form fields:
- First Name (text, required)
- Last Name (text, required)
- Email (email, required, will be username)
- Password (password, min 8 chars, show/hide toggle)
- Confirm Password (must match)

Validation:
- Real-time email format check
- Password strength indicator
- Confirm password match check
- All errors shown inline below fields

Actions:
- "Create Account" primary button
- "Already have an account? Sign in" link → /login

On submit success:
- Create user session
- Redirect to /onboarding/add-child (NOT dashboard)

SCREEN 2: EMAIL VERIFICATION (optional, can be deferred)
- Show message: "We sent a verification email to [email]"
- "Continue to add your child" button (allow proceeding)
- "Resend email" link
- Verification can happen later, but required before payment
```

---

## Prompt 2.2: Add Child with Self-Pledge Flow (CRITICAL)

```
Create the child enrollment flow that includes parent self-sponsorship.
This is a MULTI-STEP flow, all within /onboarding/

STEP 1: ADD CHILD (/onboarding/add-child)

Header: "Add Your Child"
Subheader: "Tell us about the reader you're enrolling"

Form inside BookContainer:
- Child's First Name (text, required)
- Child's Last Name (text, required)
  Helper: "We only store the first initial for privacy"
- Grade (select: Pre-K, Kindergarten, 1st, 2nd, 3rd, 4th, 5th)
- Teacher (select, populated based on grade selection)
  If no teachers: show text input with note "Teacher not listed? Enter name"
- Reading Goal (number, default 500)
  Helper: "500 minutes = about 15 minutes per day"
  Quick buttons: 300, 500, 750, 1000

Actions:
- "Continue" primary button → Step 2
- "I have more than one child" checkbox (affects flow later)

STEP 2: PARENT SELF-PLEDGE (/onboarding/pledge)

Header: "Be [Child's First Name]'s First Sponsor!"

Encouraging message in Caveat font:
"Many families start by making their own pledge, then share
the link with grandparents and friends."

Show child's info:
- Name: [First Name] [Last Initial]
- Goal: [X] minutes
- ProgressCircle at 0% (empty, but showing goal)

Pledge type selection (large cards, not radio buttons):

CARD 1: "Pledge a fixed amount"
  When selected, show amount buttons:
  [$25] [$50] [$100] [Other: $___]

CARD 2: "Pledge per minute read"
  When selected, show:
  "I'll pledge $[0.05] per minute"
  Calculator: "At [goal] minutes, that's $[calculated]"
  Optional: "Cap my pledge at $[___]"

Below cards:
"Skip for now" link (subtle, not a button)

If amount selected, show payment timing:
- "Pay now" radio → reveals card form
- "Pay when read-a-thon ends" radio (default)

Actions:
- "[Pay $X Now]" or "[Pledge $X]" primary button
- "Skip for now" link

STEP 3: CONFIRMATION (/onboarding/complete)

Header: "You're all set!"

Show:
- Child's name and reading goal
- Your pledge (if made): "$50 pledged"
- ProgressCircle showing 0 minutes / [goal]

Primary CTA - large, prominent:
"Share [Child's First Name]'s sponsor link"
[Copy Link button] [Email] [Text] [Facebook] [Print]

Secondary actions:
- "Add another child" (if checkbox was checked) → back to Step 1
- "Go to Dashboard" → /dashboard

Important: This flow should feel like ONE continuous experience, not 3 separate pages.
Use progress indicator: "Step 1 of 3" etc.
```

---

## Prompt 2.3: Parent Dashboard (Post-Enrollment)

```
Create the parent dashboard at /dashboard

This is the HUB for all parent actions. Show it after onboarding.

HEADER SECTION:
- "Welcome back, [Parent First Name]!" (Caveat font for "Welcome back")
- If event active: "[Event Name] - [X] days remaining"
- If event not active: "The read-a-thon starts [date]" or "ended [date]"

CHILDREN SECTION:
For EACH child, show a card:

┌─────────────────────────────────────────────────────┐
│  [ProgressCircle 120px]    [Child First Name]       │
│                            3rd Grade • Ms. Johnson   │
│       67%                                            │
│                            335 of 500 minutes        │
│                                                      │
│  [$125 pledged by 4 sponsors]                       │
│                                                      │
│  [Log Reading]  [Invite Sponsors]  [View Details]   │
└─────────────────────────────────────────────────────┘

If no children:
  Empty state with "Add your first child" button

QUICK ACTIONS (right sidebar on desktop, below children on mobile):
- "Log Reading" button (opens child selector if multiple)
- "Invite Sponsors" button
- "View All Pledges" button

RECENT ACTIVITY:
Collapsible section showing:
- Recent reading logs: "[Child] read 30 minutes on [date]"
- Recent pledges: "Grandma Betty pledged $50 for [Child]"
Limit to 5 items, "View all" link

ADD CHILD:
If only one child, show subtle "+ Add another child" link
```

---

# PRIORITY 2: Senior-Friendly Sponsor Flow

This is the critical conversion path. Make it grandparent-proof.

---

## Prompt 2.4: Sponsor Email Invitation System

```
Create the sponsor invitation system for parents.

SCREEN: INVITE SPONSORS (/children/[id]/invite)

Header: "Invite sponsors for [Child First Name]"

SECTION 1: EMAIL INVITATION FORM
"Send a personal invitation"

Form:
- Recipient's Email (email, required)
- Recipient's Name (text, required) - "So we can personalize the message"
- Relationship (select, optional):
  Grandparent, Aunt/Uncle, Family Friend, Neighbor,
  Parent's Colleague, Other
- Personal Message (textarea, optional, max 500 chars)
  Placeholder: "Add a personal note..."

[Send Invitation] button

SECTION 2: QUICK SHARE OPTIONS
"Or share [Child]'s link directly"

Display link: readathon.school.org/s/[code]
- [Copy Link] button with "Copied!" feedback
- [Text Message] - opens SMS with pre-filled message
- [WhatsApp] - share link
- [Print Invitation] - generates printable card with QR code

SECTION 3: SENT INVITATIONS
"Invitations you've sent"

Table:
| Name | Email | Sent | Status | Actions |
| Grandma Betty | g@email.com | Jan 15 | Pledged $50 ✓ | - |
| Uncle Bob | bob@email.com | Jan 15 | Opened | Resend |
| Aunt Mary | mary@email.com | Jan 16 | Sent | Resend, Cancel |

Status badges:
- Sent (gray)
- Opened (blue)
- Pledged (green with amount)

Actions:
- Resend: sends new email, resets expiration
- Cancel: revokes invitation token

SECTION 4: PUBLIC LINK TOGGLE
"Allow anyone with the link to sponsor [Child]"

Toggle switch (default OFF)
When ON:
- Show public link
- Warning: "Anyone with this link can view [Child]'s progress and pledge"
- [Disable Link] appears when enabled
```

---

## Prompt 2.5: Sponsor Landing Page (Magic Link, One-Page Pledge)

```
Create the sponsor landing page - this is THE critical conversion page.
Must be senior-friendly: large text, simple flow, no password required.

ROUTE: /invite/[token] (from email invitation)
ROUTE: /s/[public_code] (from public sharing)

IMPORTANT: Token in URL = authenticated session. No login required.

SINGLE PAGE LAYOUT (everything visible, minimal scrolling):

HEADER:
- School logo (small)
- "You're invited by [Parent First Name]"

HERO SECTION:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        Support [Child First Name]'s Reading!           │
│                                                         │
│              [ProgressCircle - LARGE 200px]             │
│                      [X] minutes                        │
│                                                         │
│        [Child First Name] is a [grade] grader           │
│        at [School Name]                                 │
│                                                         │
│        Goal: [Y] minutes • [Z] days left               │
│        [N] sponsors cheering them on!                   │
│                                                         │
└─────────────────────────────────────────────────────────┘

PLEDGE SECTION (inside BookContainer):

"Your name" (pre-filled from invitation, editable)
[_________________________________]

"How much would you like to pledge?"

Large amount buttons (64px height, 24px text):
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│   $25   │  │   $50   │  │  $100   │  │  Other  │
└─────────┘  └─────────┘  └─────────┘  └─────────┘

"Or pledge per minute" (collapsed by default, "More options" link)
When expanded: $[0.05] per minute = ~$[calculated] at goal

"How would you like to pay?"

Three large option cards:
┌─────────────────────────┐
│ 💳 Pay now by card      │  ← Expands to show card form
└─────────────────────────┘
┌─────────────────────────┐
│ 📧 Pay later            │  ← "We'll email you when it's time"
└─────────────────────────┘
┌─────────────────────────┐
│ ✉️  Mail a check         │  ← Shows mailing instructions
└─────────────────────────┘

When "Pay now" selected, show inline:
- Card number (Square SDK field)
- Expiry / CVV (Square SDK fields)
- ZIP code

SUBMIT BUTTON:
[Complete My $50 Pledge] - large, 64px height, full width on mobile

FOOTER:
"Questions? Contact [Parent First Name] or email help@school.org"

DESIGN REQUIREMENTS:
- Minimum 18px font for all text
- All buttons 56px+ height
- Amount buttons 64px height
- 7:1 contrast ratio
- No login/password anywhere
- Single page, no navigation
- Works on iPad (common grandparent device)
```

---

## Prompt 2.6: Sponsor Confirmation & Check Payment Instructions

```
Create confirmation screens for sponsors.

SCREEN A: PAYMENT SUCCESS (/sponsor/thank-you)

Large, celebratory:
"Thank you, [Sponsor Name]!"

Show:
- "[Child First Name] will be so excited!"
- "Your $[amount] pledge makes a difference"
- [ProgressCircle showing updated progress]

If paid by card:
- "Receipt sent to [email]"
- [View Receipt] link

Actions:
- "Sponsor another student" button
- "Share with friends" with social buttons
- "Close" or redirect timer

SCREEN B: PLEDGE RECORDED - PAY LATER (/sponsor/pledged)

"Your pledge is recorded!"

Show:
- "You pledged $[amount] for [Child First Name]"
- "We'll email you at [email] when it's time to pay"
- "The read-a-thon ends [date]"

Actions:
- "Want to pay now instead?" link
- "Sponsor another student" button
- "Close"

SCREEN C: CHECK PAYMENT INSTRUCTIONS (/sponsor/check-instructions)

"Thank you for your pledge!"

Clear, printable instructions:

┌─────────────────────────────────────────────────────────┐
│  How to pay by check:                                   │
│                                                         │
│  Make check payable to:                                 │
│    [School Name] PTA                                    │
│                                                         │
│  Write in the memo line:                                │
│    Read-a-thon - [Child First Name] [Last Initial]     │
│                                                         │
│  Mail to:                                               │
│    [School Name] Read-a-thon                           │
│    [Street Address]                                     │
│    [City, State ZIP]                                    │
│                                                         │
│  Amount: $[pledge amount]                               │
│                                                         │
│  [Print These Instructions]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

"[Parent First Name] will be notified when your check arrives."

Action:
- [Print Instructions] prominent button
- "Email me these instructions" link
```

---

## Prompt 2.7: Parent-Assisted Pledge (Proxy Sponsorship)

```
Create the flow for parents to record pledges on behalf of sponsors.

SCREEN: ADD SPONSOR (/children/[id]/add-sponsor)

Header: "Record a pledge for [Child First Name]"

Subheader:
"Someone wants to sponsor [Child] but needs help with the website?
You can record their pledge here."

Form inside BookContainer:

Sponsor Information:
- Sponsor's Name (text, required)
- Sponsor's Email (email, optional)
  Helper: "If provided, we'll send them a payment link"
- Sponsor's Phone (tel, optional)
  Helper: "For text message payment link"

Pledge Details:
- Amount: $[___] (number, required)
- Type: ○ Fixed amount  ○ Per minute (radio, default fixed)

How will they pay?
○ Send payment link by email
  → Requires email above
○ Send payment link by text
  → Requires phone above
○ They're mailing a check
  → Shows check instructions to tell sponsor
○ They gave you cash
  → Records as received, parent remits to school
○ They'll pay you directly (Venmo/Zelle)
  → Records pledge, parent handles payment

Notes (optional):
[textarea - "e.g., Grandma called on phone"]

[Record This Pledge] button

SUCCESS MESSAGE:
"Pledge recorded!"
- If email/text: "Payment link sent to [contact]"
- If check: "Tell [Sponsor] to mail check to [address]"
- If cash: "Remember to submit $[amount] to the school"

"Record another pledge" or "Back to [Child]'s sponsors"
```

---

# PRIORITY 3: Student & Teacher Quick Flows

---

## Prompt 2.8: Student Login & Dashboard (Child-Friendly)

```
Create the student experience - must be child-friendly (ages 6-12).

SCREEN A: STUDENT LOGIN (/student/login)

Simple, fun design:
- Larger text (20px base)
- Colorful, encouraging
- Book/reading themed illustrations

Form:
- "What's your username?" [large input]
- "What's your password?" [large input, show/hide]
- [Let's Read!] large button (accent-gold background)

No "forgot password" - student tells parent

SCREEN B: STUDENT DASHBOARD (/student)

Header (Caveat font):
"Hi, [First Name]! 📚"

HERO - dominates the page:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           [GIANT ProgressCircle - 280px]                │
│                                                         │
│                    247 minutes!                         │
│                                                         │
│              You're almost halfway there!               │
│                                                         │
└─────────────────────────────────────────────────────────┘

Milestone celebrations (show when applicable):
- 25%: "Great start! ⭐"
- 50%: "Halfway there! 🌟"
- 75%: "So close! ✨"
- 100%: "YOU DID IT! 🎉" with confetti animation

Encouragement section:
"[X] people are cheering you on!"
[Row of heart icons, one per sponsor - no names/amounts]

BIG CTA:
[I Read Today!] - huge button, accent-gold, 72px height

Below:
"Your reading this week:"
Simple list of recent entries

SCREEN C: STUDENT LOG READING (/student/log)

Header: "Log Your Reading"

Date:
[Today] [Yesterday] (two big buttons, Today default)

"How many minutes did you read?"

Giant number display: [  0  ] minutes

[−] [+] buttons (56px, decrement/increment by 5)

Quick buttons:
[15 min] [30 min] [45 min] [60 min]
(show as book icons of increasing size)

"What did you read?" (optional)
[text input - simple, one field]

[I Read!] giant submit button

SUCCESS:
"Awesome! 🎉"
[Animated ProgressCircle updating]
"You've read [X] minutes total!"
[Log More] [Done]
```

---

## Prompt 2.9: Teacher Dashboard & Class Logging

```
Create the teacher experience.

SCREEN A: TEACHER DASHBOARD (/teacher)

Header:
"[Teacher Name]'s Class"
"[Grade] Grade • [School Name]"

Event status bar:
"[Event Name] • [X] days remaining • [Y] students participating"

CLASS STATS (row of stat cards):
| Students | Participating | Total Minutes | Avg per Student |
|    24    |      18       |    4,230      |      235        |

STUDENT GRID (default view):
Cards for each student:
┌─────────────────────────────┐
│ [ProgressCircle 64px]       │
│ [First Name] [Last Initial] │
│ 247 / 500 minutes (49%)     │
│ Last logged: Yesterday      │
│ [Status Badge]              │
└─────────────────────────────┘

Status badges:
- "Exceeding" (green) - >100% of goal
- "On Track" (blue) - on pace
- "Needs Encouragement" (orange) - behind pace
- "Not Started" (gray) - 0 minutes

Sort options:
[Name ▼] [Progress] [Last Active]

Filter:
[All] [Needs Attention] [Goal Reached]

Actions:
- Click card → student detail
- [Log Reading for Class] button
- [Download Report] button

SCREEN B: LOG FOR STUDENT (/teacher/log)

Header: "Log Reading"

Student selector:
[Search or select student...▼]
Shows recent students first

When student selected:
- Show their current progress
- Date picker (default today)
- Minutes input with +/- buttons
- Activity note: [optional - e.g., "Classroom read-aloud"]

[Log Reading] button

BULK MODE toggle:
"Log for multiple students"
When on:
- Checkbox list of all students
- Select all / none
- Single date and minutes applies to all
- [Log for Selected Students] button

SUCCESS:
"Logged [X] minutes for [Student(s)]"
[Log More] [Back to Dashboard]
```

---

# PRIORITY 4: Reading Log Flow (Parent)

---

## Prompt 2.10: Parent Reading Log Flow

```
Create the reading log flow for parents.

SCREEN: LOG READING (/reading/log)

If multiple children, show tabs or selector:
[Emma] [Jacob] [Sophie]

Selected child header:
[ProgressCircle 100px] [First Name] - [X] of [Y] minutes ([Z]%)

LOG FORM inside BookContainer:

"When did [First Name] read?"
[Date picker - default today, limited to event date range]
[Yesterday] quick button

"How many minutes?"

Large number input with steppers:
[−] [  30  ] [+]

Quick buttons:
[15] [30] [45] [60] [90] [120]

"What did [First Name] read?" (optional section)
[Book title input]
[Author input] (shows after title entered)

LIVE PREVIEW (updates as you type):
┌─────────────────────────────────────────────────────────┐
│ Adding 30 minutes will bring [First Name] to:          │
│                                                         │
│ [ProgressCircle animating] → 277 minutes (55%)         │
│                                                         │
└─────────────────────────────────────────────────────────┘

[Log Reading] primary button

SUCCESS STATE:
- Brief celebration (confetti if milestone reached)
- "[First Name] now has [X] minutes!"
- [Log More Reading] [Back to Dashboard]

READING HISTORY (collapsible, below form):
"Recent reading for [First Name]"

| Date | Minutes | Book | Actions |
| Jan 15 | 30 | Charlotte's Web | [Edit] [Delete] |
| Jan 14 | 45 | - | [Edit] [Delete] |

Edit: opens inline edit
Delete: confirmation modal, then removes
```

---

# PRIORITY 5: Sponsor Return & Payment Collection

---

## Prompt 2.11: Magic Link Return Flow

```
Create the passwordless return flow for sponsors.

SCREEN A: SPONSOR LOGIN (/sponsor/login)

Header: "Welcome back!"

Simple form:
"Enter your email to continue"
[email input - large, 56px height]
[Send me a login link] button (large, primary)

Helper text below:
"We'll email you a link to sign in. No password needed!"

Alternative:
"Made a pledge but never created an account?
Check your email for your original invitation link."

SCREEN B: CHECK YOUR EMAIL (/sponsor/check-email)

"Check your email!"

Icon: envelope illustration

"We sent a login link to [email]"
"Click the link in the email to continue."

"Didn't get it?"
- Check your spam folder
- [Resend email] link (with cooldown)
- "Try a different email" link → back to login

MAGIC LINK EMAIL:
Subject: "Your Read-a-thon Login Link"

Body:
"Hi [Name],

Click below to access your sponsor account:

[Sign In Now] ← big button

This link expires in 1 hour.
If you didn't request this, you can ignore this email."

SCREEN C: SPONSOR DASHBOARD (/sponsor/dashboard)
(After clicking magic link)

Header: "Your Pledges"

For each pledge:
┌─────────────────────────────────────────────────────────┐
│ [ProgressCircle 80px]  [Child First Name] [Last Init]   │
│                        [Grade] at [School]               │
│      67%                                                 │
│                        Your pledge: $0.05/minute        │
│                        Current total: $17.35            │
│                        Status: [Pay When Event Ends]    │
│                                                         │
│                        [Pay Now] [Update Pledge]        │
└─────────────────────────────────────────────────────────┘

If event has ended and payment due:
[Pay Now] is prominent, primary button

Summary at bottom:
"Total pledged: $[X] • Paid: $[Y] • Outstanding: $[Z]"

SCREEN D: PAYMENT COLLECTION (/sponsor/pay)

Header: "Complete Your Pledge"

Show each unpaid pledge:
☑ [Child Name] - $[amount] (calculated if per-minute)

Total: $[sum]

Payment options (same as initial pledge):
[Pay by Card] [Mail a Check]

Card form (Square SDK)

[Pay $[total]] button
```

---

# PRIORITY 6: Admin Basics

---

## Prompt 2.12: Admin Dashboard (Essential)

```
Create basic admin dashboard - not all features, just essentials.

SCREEN: ADMIN HOME (/admin)

HEADER:
"[School Name] Read-a-thon"
"[Event Name] • [Status: Active/Ended] • [X] days remaining"

KEY METRICS (stat cards row):
| Students | Reading | Pledged | Collected |
|   147    | 38,420  | $4,230  |  $2,180   |
|enrolled  | minutes | total   |   paid    |

Below each: small trend indicator or percentage

ATTENTION NEEDED (alert cards):
- "[X] pending check payments" → link to check list
- "[Y] pledges awaiting collection" → link to outstanding
- "[Z] high-value pledges need review" → link to review queue

QUICK ACTIONS:
[Send Payment Reminders] - opens confirmation modal
[Download Report] - dropdown: Students, Pledges, Payments
[Manage Event] - link to event settings

RECENT ACTIVITY (live feed):
- "New pledge: $50 from Betty S. for Emma J." - 5 min ago
- "Payment: $75 from John D." - 1 hour ago
- "New student enrolled: Jacob M." - 2 hours ago

Limited to 10 items, "View all" link

OUTSTANDING PAYMENTS (table preview):
| Sponsor | Student | Amount | Days Outstanding |
| Betty S. | Emma J. | $50 | 3 days |
| John D. | Sophie K. | $25 | 7 days |

[View All] [Send Reminders to Selected]
```

---

# IMPLEMENTATION ORDER

Run these prompts in order:

| Priority | Prompts | What It Builds |
|----------|---------|----------------|
| 1 | 2.1, 2.2, 2.3 | Parent registration → Child → Self-pledge → Dashboard |
| 2 | 2.4, 2.5, 2.6, 2.7 | Complete sponsor flow (invite, pledge, pay, proxy) |
| 3 | 2.8, 2.9 | Student and teacher experiences |
| 4 | 2.10 | Parent reading log |
| 5 | 2.11 | Sponsor return and payment collection |
| 6 | 2.12 | Admin essentials |

---

# WIRING CHECKLIST

After each prompt, verify these connections:

**2.1-2.3 Parent Flow:**
- [ ] Registration creates session, redirects to add-child
- [ ] Add-child generates sponsor_code for child
- [ ] Self-pledge creates pledge linked to child AND parent
- [ ] Completion shows shareable sponsor link
- [ ] Dashboard shows child with progress and pledge count

**2.4-2.7 Sponsor Flow:**
- [ ] Email invitation contains secure token
- [ ] Token URL auto-authenticates (no login form)
- [ ] Name pre-filled from invitation
- [ ] Pledge options include check/cash
- [ ] Parent can record proxy pledges
- [ ] Check instructions are printable

**2.8-2.9 Student/Teacher:**
- [ ] Student login uses simple credentials
- [ ] Student dashboard is child-friendly (large, fun)
- [ ] Teacher sees class roster with progress
- [ ] Teacher can bulk-log reading

**2.10 Reading Log:**
- [ ] Date restricted to event period
- [ ] Live preview shows progress update
- [ ] History shows edit/delete options

**2.11 Sponsor Return:**
- [ ] Magic link email works
- [ ] Dashboard shows all pledges
- [ ] Payment collection shows calculated totals

**2.12 Admin:**
- [ ] Metrics are accurate
- [ ] Outstanding payments visible
- [ ] Can send reminders
