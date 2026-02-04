# Returning Sponsor Compliance: GDPR/COPPA Analysis

## The Problem

**Scenario**: Grandma Betty sponsored Emma in 2024. It's now 2025. Betty returns to the website on her own (no invitation received yet). She wants to sponsor Emma again.

**The question**: Can we show Betty that Emma exists and let her sponsor again?

**The risk**: If we show child data based solely on email authentication, we're disclosing child PII without fresh parental consent for the new event.

---

## Why This Matters

### COPPA Requirements
- Parental consent required before collecting/disclosing child's personal information
- Consent is **purpose-specific** - consenting to 2024 disclosure doesn't cover 2025
- Each new "disclosure to third party" requires new consent
- Previous sponsorship ≠ perpetual access

### GDPR Requirements
- Lawful basis required for processing (consent or legitimate interest)
- Data minimization - only show what's necessary
- Purpose limitation - can't repurpose old consent for new uses

### The Specific Risk

If we show "Emma S., 3rd grade, Janney School" to anyone who:
1. Claims to have a certain email address
2. Previously sponsored that child

Then a bad actor could:
- Try random emails to discover child associations
- Access child data without current parental knowledge
- Parent has no control over who can see their child this year

---

## Compliant Approaches

### Approach 1: Historical Data Only (Minimal Disclosure)

**What sponsor sees (without invitation):**

```
Welcome back, Betty!

YOUR PLEDGE HISTORY
────────────────────────────────────────

2024 Read-a-thon:
• You pledged $50 for a student (paid ✓)
  Final result: 623 minutes read

2023 Read-a-thon:
• You pledged $40 for a student (paid ✓)
  Final result: 512 minutes read

────────────────────────────────────────

Want to sponsor again this year?

Contact the family to get a new sponsor link,
or wait for them to send you an invitation.

[I have a sponsor link] → enters code/URL
```

**What's shown:**
- Their own pledge history (their data, not child's)
- Aggregated outcome (minutes read)
- No child name, no grade, no school

**What's NOT shown:**
- Child's name
- Child's current grade
- Child's current progress
- Any identifying information

**Compliance:**
- ✅ COPPA: No child PII disclosed without consent
- ✅ GDPR: Sponsor sees only their own data
- ✅ Parent retains control: Must invite to grant access

**UX impact:**
- ❌ Friction for returning sponsors
- ❌ Grandma frustrated: "Why can't I see Emma?"
- ✅ But clear path forward: "Contact family for link"

---

### Approach 2: Access Request with Parent Approval

**What sponsor sees:**

```
Welcome back, Betty!

You sponsored a student in 2024.

To sponsor them again in 2025, we need to confirm
with the family that they'd like your support.

[Request Access for 2025]
```

**When sponsor clicks "Request Access":**

Parent receives notification (email + in-app):

```
Subject: Betty wants to sponsor Emma again!

Hi Sarah,

Betty (grandma@email.com) sponsored Emma last year
and wants to support her again in the 2025 Read-a-thon.

[Approve - Send Betty a sponsor link]
[Decline]

If you don't respond, no action will be taken.
```

**If parent approves:**
- System sends Betty an invitation email
- Betty clicks link → full access to pledge page
- Same as normal invitation flow

**If parent ignores/declines:**
- Betty sees: "Waiting for family approval..."
- After 7 days: "The family hasn't responded. You can contact them directly."

**Compliance:**
- ✅ COPPA: Parent explicitly consents to this year's disclosure
- ✅ GDPR: Consent is fresh and specific
- ✅ Audit trail: Request and approval logged
- ✅ Parent control: Can decline unwanted sponsors

**UX impact:**
- ⚠️ Adds a step for sponsor
- ✅ Parent is in the loop
- ✅ Handles awkward cases (estranged relatives, etc.)

---

### Approach 3: Pre-Authorized Returning Sponsors

**During parent's re-enrollment flow:**

```
PREVIOUS SPONSORS
────────────────────────────────────────

These people sponsored Emma last year:

☑ Grandma Betty (grandma@email.com) - $50
☑ Uncle Bob (bob@email.com) - $25
☐ Former neighbor (neighbor@email.com) - $20

Allow checked sponsors to return on their own
this year without a new invitation.

[Continue]
```

**If parent checks the box:**
- Those sponsors are "pre-authorized" for this event
- If they return on their own, they see child info and can pledge
- Parent gave consent during enrollment

**If parent unchecks:**
- That sponsor cannot self-return
- Must receive explicit invitation

**Data model:**

```
ReturningSponsorsAuthorization {
  event_id: FK
  child_id: FK
  sponsor_email: string
  authorized_at: timestamp
  authorized_by: parent_id
}
```

**Compliance:**
- ✅ COPPA: Explicit parental consent at enrollment
- ✅ GDPR: Consent is documented with timestamp
- ✅ Parent control: Chooses who gets automatic access
- ✅ Revocable: Parent can later remove authorization

**UX impact:**
- ✅ Smooth for approved returning sponsors
- ✅ Parent explicitly opts in
- ⚠️ Parent might not read carefully and approve everyone

---

### Approach 4: Hybrid (Recommended)

Combine the best of each approach:

**For sponsors:**
1. Show only historical aggregate data (no child names)
2. Offer "Request Access" button
3. Clear messaging about why

**For parents:**
1. During enrollment, show previous sponsors
2. Let them pre-authorize specific people
3. Notify when non-authorized sponsors request access

**Flow diagram:**

```
Returning sponsor logs in
        │
        ▼
┌─────────────────────────────────────┐
│ Show historical data (no names)    │
│ "You sponsored a student in 2024"  │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Is sponsor pre-authorized for      │
│ this child + this event?           │
└─────────────────────────────────────┘
        │
    ┌───┴───┐
    │       │
   YES      NO
    │       │
    ▼       ▼
┌──────────┐ ┌────────────────────────┐
│ Show     │ │ Show "Request Access"  │
│ child    │ │ button only            │
│ info,    │ └────────────────────────┘
│ allow    │         │
│ pledge   │         ▼
└──────────┘ ┌────────────────────────┐
             │ Parent notified        │
             │ Parent approves/denies │
             └────────────────────────┘
                      │
                  APPROVED
                      │
                      ▼
             ┌────────────────────────┐
             │ Sponsor receives       │
             │ invitation link        │
             └────────────────────────┘
```

---

## Implementation Details

### What Returning Sponsors See (No Authorization)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Welcome back, Betty!                                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  YOUR 2024 SPONSORSHIP                                  │
│                                                         │
│  You supported a student's reading last year:           │
│  • Your pledge: $50                                     │
│  • They read: 623 minutes                               │
│  • Status: Paid ✓                                       │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  SPONSOR AGAIN IN 2025                                  │
│                                                         │
│  To protect student privacy, we need the family's      │
│  permission before you can sponsor again.               │
│                                                         │
│  Option 1: Wait for an invitation                       │
│  The family may send you an invite when they enroll.    │
│                                                         │
│  Option 2: Request access                               │
│  We'll ask the family if they'd like your support.      │
│                                                         │
│  [Request Access]                                       │
│                                                         │
│  Option 3: I have a sponsor link                        │
│  [Enter sponsor link or code]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key elements:**
- Shows THEIR data (pledge amount, payment status)
- Shows outcome (minutes read) - this is aggregated, not identifying
- Does NOT show: child name, grade, school, current progress
- Explains WHY (privacy protection)
- Gives clear options

### Access Request Email to Parent

```
Subject: Someone wants to sponsor Emma again!

Hi Sarah,

Good news! Someone who supported Emma's reading last year
wants to sponsor her again in 2025.

SPONSOR DETAILS:
• Name: Betty
• Email: grandma@email.com
• 2024 Pledge: $50

Would you like to invite them to sponsor Emma this year?

[Yes, Send Them an Invite]

[No Thanks]

If you don't respond, no information will be shared.

────────────────────────────────────────

Why are we asking?
To protect Emma's privacy, we need your permission
before sharing her information with sponsors each year.
```

### Parent's Enrollment Pre-Authorization

```
PREVIOUS SPONSORS (2024)
────────────────────────────────────────

These people sponsored Emma last year.
Check the ones who can sponsor again without
needing a new invitation:

☑ Grandma Betty (grandma@email.com) - $50
    Relationship: Grandparent

☑ Uncle Bob (bob@email.com) - $25
    Relationship: Family

☐ John Smith (john@work.com) - $20
    Relationship: Parent's colleague

ℹ️ Unchecked sponsors will need you to send
   them a new invitation to sponsor this year.

[Continue]
```

---

## Edge Cases

### Sponsor Authorized but Child Not Enrolled

Betty was pre-authorized for Emma, but parent hasn't enrolled Emma in 2025 yet.

**What Betty sees:**
```
You're approved to sponsor Emma when the 2025
Read-a-thon begins!

Emma isn't enrolled yet. We'll notify you
when the family enrolls her.
```

### Child Graduated/Left School

Emma graduated. Parent deletes Emma's profile (or Emma marked inactive).

**What Betty sees:**
```
The student you sponsored in 2024 is no longer
participating in the Read-a-thon.

Thank you for your past support!
```

No child name disclosed. Just acknowledgment they're gone.

### Parent Removes Pre-Authorization

Parent pre-authorized Betty, then changes mind.

**Parent action:**
In settings: "Manage authorized sponsors"
- Remove Betty from list
- Betty loses access immediately

**Betty's experience:**
- If she hasn't pledged yet: loses access, must request again
- If she already pledged: pledge stands, but can't view progress

### Multiple Children

Betty sponsored both Emma and Jacob last year.

**What Betty sees (if neither authorized):**
```
YOUR 2024 SPONSORSHIPS

You supported 2 students last year:
• Student 1: $50 pledge, 623 minutes read
• Student 2: $25 pledge, 412 minutes read

To sponsor them again, request access or wait for invitations.

[Request Access]
```

No names, even in aggregate view.

**If one authorized, one not:**
```
2025 READ-A-THON

Emma S. (3rd grade)              [Sponsor Emma]
You're approved to sponsor!

────────────────────────────────────────

You also sponsored another student in 2024.
To sponsor them again, request access.

[Request Access for Other Student]
```

---

## Compliance Checklist

### Before Showing Child Name to Returning Sponsor:

- [ ] Sponsor authenticated (magic link)
- [ ] Child enrolled in current event
- [ ] Parent has authorized this sponsor for this event
  - [ ] Via pre-authorization during enrollment, OR
  - [ ] Via explicit invitation, OR
  - [ ] Via approval of access request

### Data Shown Without Authorization:

- ✅ Sponsor's own pledge history (amount, date)
- ✅ Aggregate outcome (minutes read)
- ✅ Payment status (their transaction)
- ❌ Child's name
- ❌ Child's grade
- ❌ Child's school
- ❌ Child's current progress
- ❌ Child's reading goal
- ❌ Other sponsors

### Audit Requirements:

Log all:
- Access requests (who, when, for which child)
- Authorizations (parent, timestamp, method)
- Denials (parent, timestamp)
- Data access (what child data shown to which sponsor)

---

## Messaging for Seniors

The compliance flow adds friction. Mitigate with clear, warm messaging:

**DON'T say:**
> "Access denied. Parental consent required per COPPA regulations."

**DO say:**
> "To protect Emma's privacy, we check with her family each year before sharing her reading progress. We've let them know you'd like to sponsor her again!"

**DON'T say:**
> "Your request is pending authorization."

**DO say:**
> "We've sent Sarah a message letting her know you want to support Emma. She'll send you a link soon!"

**DON'T say:**
> "Error: sponsor not in authorized list for this event/child combination."

**DO say:**
> "You sponsored a wonderful reader last year! To sponsor them again, we just need a quick OK from their family."

---

## Lovable Prompt

```
Create a COPPA-compliant returning sponsor experience.

RULE: Never show child name/grade/school to a returning sponsor
unless they have CURRENT EVENT authorization.

RETURNING SPONSOR DASHBOARD (no authorization):

Show:
- "Welcome back, [name]!"
- Their historical pledges (amounts, dates, payment status)
- Aggregate outcomes (minutes read - no child names)

Do NOT show:
- Child names
- Current grades
- School names
- Current progress

Actions:
- "Request Access" button - triggers parent notification
- "I have a sponsor link" - text input for code/URL

RETURNING SPONSOR DASHBOARD (with authorization):

Show:
- Child name and grade
- Current progress
- Pledge button

PRE-AUTHORIZATION DURING ENROLLMENT:

In parent enrollment flow, show:
- List of previous sponsors with checkboxes
- Checked = sponsor can self-return
- Unchecked = sponsor needs new invitation

ACCESS REQUEST FLOW:

When sponsor requests access:
- Create pending request in database
- Email parent with approve/deny buttons
- Show sponsor "Waiting for family response"

When parent approves:
- Send sponsor an invitation email (standard flow)
- Log authorization with timestamp

MESSAGING:
Use warm, clear language explaining privacy protection.
No jargon. No error-style messages.
```
