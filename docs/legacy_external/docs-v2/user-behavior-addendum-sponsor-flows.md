# User Behavior Addendum: Parent Self-Sponsorship & COPPA-Compliant Sponsor Acquisition

## Overview

This document addresses two critical flows:
1. **Parents sponsoring their own children** during enrollment
2. **How sponsors find and sponsor children** while maintaining GDPR/COPPA compliance

---

# PART 1: PARENT SELF-SPONSORSHIP FLOW

## Business Rationale
Parents are the most likely sponsors. Prompting them to make the first pledge during child enrollment:
- Sets the expectation that sponsorship is part of participation
- Provides an example pledge amount for grandparents/friends
- Increases total pledges significantly
- Creates immediate engagement with the payment system

---

## P2-Extended: Add Child with Self-Pledge

### Behavior
After entering child information, parent is prompted to make an initial pledge themselves.

### Screen Flow: Add Child → Self-Pledge → Confirm

**Step 1: Child Information** (existing P2)
| Field | Type | Validation |
|-------|------|------------|
| First Name | text | Required |
| Last Name | text | Required (stored as initial only) |
| Grade | select | Required |
| Teacher | select | Required |
| Reading Goal | number | Default 500 |

**Step 2: Parent Pledge Prompt** (NEW)

Screen: "Support [Child's First Name]'s Reading!"

**Messaging:**
```
You're [Child]'s first sponsor!

Many families start by making their own pledge, then share the
link with grandparents, aunts, uncles, and friends.

Your pledge shows others that you believe in [Child]'s reading!
```

**Pledge Options:**
| Option | UI | Default |
|--------|-----|---------|
| Flat Amount | Quick select buttons | $25, $50, $100, Other |
| Per-Minute | Rate input | $0.05 default |
| Skip | Link | "Skip for now" |

**If Flat Amount Selected:**
- Show selected amount
- "Pay Now" or "Pay Later" choice
- For Pay Now → Square payment flow
- For Pay Later → Pledge recorded, pay at event end

**If Per-Minute Selected:**
- Show rate per minute
- Show estimate: "If [Child] reaches their 500-minute goal, you'll pledge $25"
- Optional cap: "Maximum amount: $___"
- Always Pay Later (per-minute must wait for final total)

**Skip Option:**
- "Skip for now" link (not a prominent button)
- Goes directly to confirmation
- Can add pledge later from dashboard

**Step 3: Confirmation**
- Child added successfully
- Pledge recorded (if made)
- Show sponsor link for sharing
- CTA: "Invite Family & Friends to Sponsor [Child]"

---

## Data Model for Self-Pledge

The parent's pledge is stored the same as any sponsor pledge:

```
Pledge {
  child_profile_id: [new child]
  sponsor_parent_profile_id: [same parent who created child]
  type: flat | per_minute
  amount: [selected amount]
  is_family_pledge: true  // Flag to identify self-pledges
  payment_timing: immediate | end_of_event
}
```

**Note**: `is_family_pledge` helps with:
- Reporting (separate family vs external pledges)
- Messaging ("You've pledged $X" vs "Grandma pledged $X")
- Reminders (don't send payment reminders to self)

---

# PART 2: COPPA/GDPR-COMPLIANT SPONSOR ACQUISITION

## Privacy Constraints

**What Sponsors CANNOT See:**
- Child's last name (only initial)
- Child's age or birthdate
- Parent's contact information
- Teacher's full name (optional, parent-controlled)
- School address
- Photos of the child
- Other sponsors' identities or amounts

**What Sponsors CAN See:**
- Child's first name + last initial ("Emma S.")
- Grade level ("3rd grader")
- School name (if parent allows)
- Reading progress (minutes read, goal, percentage)
- Days remaining in event

---

## Two Sponsor Acquisition Methods

### Method A: Private Email Invitation (Recommended, Grandparent-Friendly)

Parent sends a secure, personal invitation to specific people.

#### Screen: Invite Sponsors

**Displayed:**
- Child's name and photo placeholder
- Current sponsor count
- Total pledged so far

**Email Invitation Form:**
| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| Recipient Email | email | Yes | Who to invite |
| Recipient Name | text | Yes | Personalize greeting |
| Relationship | select | No | "Grandparent, Aunt/Uncle, Friend..." |
| Personal Message | textarea | No | Custom note from parent |

**Actions:**
- "Send Invitation" → Generates secure token, sends email
- "Add Another" → Clear form for next invite
- View sent invitations list

**Sent Invitations List:**
| Recipient | Sent | Status |
|-----------|------|--------|
| grandma@email.com | Jan 15 | Opened, Pledged $50 |
| uncle.bob@email.com | Jan 15 | Opened, Not yet pledged |
| friend@email.com | Jan 16 | Not opened |

**Resend/Revoke:**
- Resend invitation (resets expiration)
- Revoke invitation (deactivates token)

---

#### Sponsor Receives: Email Invitation

**Subject:** "[Parent Name] invited you to support [Child First Name]'s reading!"

**Email Content:**
```
Hi [Recipient Name],

[Parent First Name] [Parent Last Name] has invited you to
support [Child First Name]'s read-a-thon!

[Personal message if provided]

[Child First Name] is a [grade] grader working toward a goal
of [goal] reading minutes. Your sponsorship will encourage
their love of reading!

[BUTTON: Support [Child First Name]'s Reading]

This invitation expires in 30 days.
```

**Privacy Notes:**
- No last name of child in email
- No school address
- No photos
- Secure token in URL (not child ID)

---

#### Sponsor Clicks Link: Secure Landing Page

**URL Pattern:** `/invite/{secure_token}`

The token is:
- 32+ character random string
- Single-use (marked used after pledge)
- Expires in 30 days
- Cannot be guessed or enumerated

**Landing Page Content:**

```
Support [Child First Name S.]'s Reading!

[ProgressCircle - current progress]

[First Name] is a [grade] grader participating in the
[School Name] Read-a-thon.

Progress: X minutes read (Y% of goal)
Goal: Z minutes
Days remaining: N

[Parent First Name] invited you to sponsor [Child First Name]!
```

**Sponsor Registration/Login:**
- If not logged in: Register or login form
- Pre-filled email from invitation
- After auth → pledge form

**Pledge Form:** (Standard S3 from main doc)

---

### Method B: Public Sharing Link (Parent-Controlled, Optional)

For parents who want to share on social media or group texts.

#### Enabling Public Link

**Screen: Manage Sponsor Link (within Child Settings)**

**Toggle:**
```
[ ] Allow public sponsor link

When enabled, anyone with the link can view [Child]'s
progress and make a pledge. You can disable this at any time.
```

**If Enabled:**
- Generate `public_sponsor_code` (different from internal `sponsor_code`)
- Display shareable URL: `readathon.school.org/s/[public_code]`
- Copy button
- Share to: Facebook, Twitter, WhatsApp, Text Message

**Public Link Settings:**
| Setting | Options | Default |
|---------|---------|---------|
| Show school name | Yes/No | Yes |
| Show grade | Yes/No | Yes |
| Show teacher name | Yes/No | No |
| Link expiration | Event end / 30 days / Never | Event end |

**Security Controls:**
- Parent can disable link at any time
- Parent can regenerate link (invalidates old one)
- Link automatically expires when event ends
- Rate limiting on page views (prevent enumeration attacks)

---

#### Public Sponsor Landing Page

**URL Pattern:** `/s/{public_sponsor_code}`

**What's Displayed (Privacy-First):**

```
Support [First Name S.]!

[ProgressCircle]

A [grade] grader at [School Name] is reading for a great cause!

[First Name] has read X minutes toward their Y-minute goal.
That's Z%!

[Days remaining: N]

[Number] sponsors are cheering them on!

[BUTTON: Make a Pledge]
```

**What's NOT Displayed:**
- Full last name
- Parent name or contact
- Teacher name (unless parent enables)
- Specific school address
- Other sponsors' names or amounts
- Child's photo

**Sponsor Flow:**
- Click "Make a Pledge"
- Register/login (required to pledge)
- Enter pledge details
- Complete

---

## Sponsor Discovery: What's NOT Allowed

**No Public Directory:**
- Cannot browse all children
- Cannot search by name
- Cannot filter by school/grade
- No "sponsor any child" feature

**No Child-Initiated Sharing:**
- Children cannot share their own link
- Children cannot see the link
- Student login does not expose sponsor URL

**No External Sharing by System:**
- System never posts to social media
- System never shares child info externally
- All sharing is parent-initiated

---

## Data Minimization in Practice

### Child Profile Storage

```
ChildProfile {
  first_name: "Emma"           // Required
  last_initial: "S"            // Derived from last name, then last name discarded
  grade_level: "3"             // Generic, not class-identifying
  classroom_id: FK             // Links to teacher internally only

  // NEVER STORED:
  // - last_name (beyond initial)
  // - email
  // - phone
  // - birthdate
  // - address
  // - photo
}
```

### Sponsor Invitation Storage

```
SponsorInvitation {
  child_profile_id: FK
  email: "grandma@email.com"   // Recipient email only
  token: "a8f3...secure...9d2" // Cryptographic random
  expires_at: timestamp
  used_at: nullable
  created_by: FK               // Parent who sent

  // NO child data duplicated here
}
```

### What Sponsors See in Database

When a sponsor queries their pledges, they see:

```
{
  child_display_name: "Emma S.",
  grade: "3rd grade",
  school_name: "Janney School",
  progress_minutes: 347,
  goal_minutes: 500,
  pledge_type: "per_minute",
  pledge_amount: 0.05,
  calculated_total: 17.35
}
```

They do NOT have access to:
- `child_profile_id` (internal only)
- Parent contact info
- Teacher name (unless parent opted in)
- Other sponsors' data

---

## Consent Flow

### When Parent Registers Child

**Screen: Privacy Consent (Required)**

```
To participate in the read-a-thon, please confirm:

[x] I am the parent or legal guardian of this child
[x] I consent to [Child]'s first name and grade being visible
    to sponsors I invite
[x] I understand that sponsors will see [Child]'s reading progress
[x] I have read and agree to the Privacy Policy [link]

[ ] (Optional) I consent to receiving marketing emails about
    future school events
```

**Stored as ConsentRecord:**
- `consent_type: 'coppa'`
- `consented: true`
- `consented_at: timestamp`
- `ip_address`
- `user_agent`

**Requirement:**
- Cannot add child without COPPA consent
- Consent is immutable (new consent required for changes)
- Consent is auditable

---

## Complete Sponsor Acquisition Journey

### Path 1: Email Invitation (Recommended)

```
Parent Dashboard
     │
     ▼
"Invite Sponsors" for [Child]
     │
     ▼
Enter grandma@email.com + "Grandma"
     │
     ▼
System sends secure email invitation
     │
     ▼
Grandma receives email, clicks link
     │
     ▼
Lands on secure page showing [Child First Name S.] progress
     │
     ▼
Grandma registers (email pre-filled)
     │
     ▼
Grandma makes pledge ($50 flat)
     │
     ▼
Grandma pays immediately OR pledges now, pays later
     │
     ▼
Parent sees: "Grandma pledged $50!"
Child sees: "1 person is cheering you on!"
```

### Path 2: Public Link (Parent-Enabled)

```
Parent Dashboard
     │
     ▼
Child Settings → Enable Public Link
     │
     ▼
Parent copies link: readathon.school.org/s/abc123
     │
     ▼
Parent texts link to family group chat
     │
     ▼
Aunt clicks link
     │
     ▼
Sees public landing: "[Child First Name S.] - 3rd grader"
     │
     ▼
Clicks "Make a Pledge"
     │
     ▼
Registers with email
     │
     ▼
Makes pledge
     │
     ▼
Parent notified, pledge recorded
```

---

## Lovable Implementation Prompts

### Prompt: Parent Self-Pledge During Enrollment

```
After the child information form, add a self-pledge step:

SCREEN: "Be [Child]'s First Sponsor!"

CONTENT:
- Encouraging message about parents leading by example
- Child's name and reading goal displayed

PLEDGE OPTIONS:
- Quick-select buttons: $25, $50, $100
- "Other amount" text input
- "Per-minute" option with rate input
- "Skip for now" subtle link at bottom

IF AMOUNT SELECTED:
- Show pledge summary
- Two buttons: "Pay Now" / "Pledge Now, Pay Later"
- Pay Now → Square payment inline
- Pay Later → Record pledge, continue to confirmation

AFTER:
- "Great! You're [Child]'s first sponsor!"
- Show shareable link
- "Invite others to sponsor [Child]"
```

### Prompt: Email Invitation System

```
Create a sponsor invitation flow:

INVITE FORM:
- Recipient email (required)
- Recipient name (required)
- Relationship dropdown (optional): Grandparent, Aunt/Uncle,
  Family Friend, Neighbor, Parent's Colleague, Other
- Personal message textarea (optional)
- "Send Invitation" button

SENT INVITATIONS LIST:
- Table showing: Recipient, Date Sent, Status
- Status: Sent, Opened, Pledged
- Actions: Resend, Revoke

EMAIL TEMPLATE:
- Personalized subject with parent name + child first name
- Warm, simple message (grandparent-friendly)
- Big button: "Support [Child]'s Reading"
- Expires in 30 days notice

LANDING PAGE (from email link):
- Shows child first name + last initial only
- Grade level
- ProgressCircle with current/goal
- School name
- "Make a Pledge" button
- Login/register required to pledge
```

### Prompt: Public Link Management

```
Add public link controls to child settings:

TOGGLE: "Allow public sponsor link"

WHEN ENABLED:
- Display link: readathon.school.org/s/[code]
- Copy button with "Copied!" feedback
- Share buttons: Facebook, Twitter, WhatsApp, SMS
- QR code option

SETTINGS:
- Toggle: Show school name (default on)
- Toggle: Show grade (default on)
- Toggle: Show teacher name (default off)

CONTROLS:
- "Regenerate Link" (invalidates old one)
- "Disable Link" (revokes access)

PUBLIC LANDING PAGE:
- Minimal child info: "[First Name] [Last Initial]"
- Progress visualization
- Sponsor count (no names)
- "Make a Pledge" CTA
- Must register to pledge
```

---

## Key Compliance Checkpoints

### Before Displaying Child to Sponsor:
- [ ] Parent has given COPPA consent
- [ ] Only first name + last initial shown
- [ ] No photos, email, phone, birthdate exposed
- [ ] Sponsor accessed via secure token OR parent-enabled public link

### Before Processing Pledge:
- [ ] Sponsor is registered adult (email verified)
- [ ] Sponsor has accepted terms
- [ ] Pledge amount is reasonable (flag for review if >threshold)

### Before Collecting Payment:
- [ ] Event has ended (for per-minute)
- [ ] Final calculation is correct
- [ ] Minimum $1.00 for collection

### Data Retention:
- [ ] Child data deleted 1 year after event
- [ ] Invitation tokens deleted after use or expiration
- [ ] Audit logs retained per policy
