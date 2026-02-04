# Returning User Flows

## The Reality

After year one:
- **Most parents are returning** (siblings, multi-year students)
- **Most sponsors are returning** (grandparents sponsor every year)
- **Seniors don't remember** if they have an account or what email they used

These users should have an EASIER experience than new users, not harder.

---

# RETURNING PARENTS

## Scenario
Parent participated last year. Children exist in system. New read-a-thon event starting.

## Problems to Solve
1. Parent may not remember login credentials
2. Child info needs updating (new grade, new teacher)
3. Previous reading/pledge history should be preserved but separate from new event
4. Don't make them re-enter everything

---

## Flow A: Parent Returns via Login

### Screen: Login (/login)

```
Welcome back!

Email: [________________________]
Password: [____________________]

[Sign In]

Forgot password? [Send me a login link]  ← Magic link, not reset
```

**Key change**: "Forgot password" sends a magic link, not a password reset flow.
Seniors click this 90% of the time. Make it the happy path.

### After Login: Re-enrollment Prompt

If parent has children NOT enrolled in current event:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Welcome back, Sarah!                                   │
│                                                         │
│  The [2025 Read-a-thon] is starting!                   │
│                                                         │
│  Ready to enroll your children?                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑ Emma (was 2nd grade, Ms. Johnson)             │   │
│  │   Now: [3rd grade ▼] [Select teacher ▼]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑ Jacob (was Kindergarten, Mr. Smith)           │   │
│  │   Now: [1st grade ▼] [Select teacher ▼]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Reading goal: [500] minutes each                       │
│                                                         │
│  [Enroll My Children]                                   │
│                                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  + Add a new child                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key UX Decisions

**Pre-populated fields:**
- Child names (immutable)
- Previous grade (shown as reference)
- Grade auto-incremented by 1 as suggestion
- Teacher dropdown filtered to new grade

**One-click re-enrollment:**
- Checkboxes default to checked
- Uncheck to skip a child (graduated, different school, etc.)
- Single button enrolls all selected children

**Smart defaults:**
- Grade = last year's grade + 1
- Goal = event default or last year's goal
- Teacher = blank (must select, teachers change)

### After Re-enrollment: Same as New Parent

→ Self-pledge prompt (optional)
→ Invite sponsors (with returning sponsor reminder - see below)
→ Dashboard

---

## Flow B: Parent Forgot Everything

### Screen: "I forgot my email" flow

On login page, add:
```
"Not sure what email you used? [Find my account]"
```

### Find Account Screen

```
Let's find your account

Enter your child's information:

Child's first name: [Emma        ]
Child's last name:  [Smith       ]

[Find Account]
```

### Result Options

**If found:**
```
Found it!

We found an account for Emma Smith.
It's registered to: s***h@gmail.com

[Send login link to this email]

Not your email? Contact help@school.org
```

**If not found:**
```
We couldn't find a matching student.

This might mean:
• Your child was registered under a different name
• You haven't registered before

[Create a new account] or [Contact help@school.org]
```

### Privacy Note
- Only shows masked email (s***h@gmail.com)
- Cannot reveal full email
- Requires child name match (something only parent would know)

---

## Flow C: Magic Link for Returning Parents

### How It Works

Parent clicks "Send me a login link" from login page.

**Email they receive:**
```
Subject: Your Read-a-thon Login Link

Hi Sarah,

Click below to sign in to your Read-a-thon account:

[Sign In Now]

This link expires in 24 hours.

────────────────────────────────────

The 2025 Read-a-thon is starting soon!

Your children from last year:
• Emma (now 3rd grade)
• Jacob (now 1st grade)

Sign in to enroll them for this year's read-a-thon.
```

**Magic link behavior:**
- Valid for 24 hours (longer than sponsor links - parents check email less frequently)
- Creates authenticated session
- Redirects to re-enrollment prompt if children not enrolled
- Redirects to dashboard if already enrolled

---

# RETURNING SPONSORS

## Scenario
Grandma Betty sponsored Emma last year. New read-a-thon starting. She wants to sponsor Emma again.

## Problems to Solve
1. Betty doesn't remember if she has an account
2. Betty doesn't remember what email she used
3. Betty may not have received a new invitation yet
4. Betty shouldn't have to re-enter her information
5. Betty should see Emma automatically, not search for her

---

## Flow A: Sponsor Gets New Invitation

### Parent Invites Returning Sponsors

When parent goes to invite sponsors for the new event:

**Screen: Invite Sponsors**

```
Invite sponsors for Emma

PREVIOUS SPONSORS (new section!)
──────────────────────────────────────────────────
These people sponsored Emma last year:

┌─────────────────────────────────────────────────┐
│ Grandma Betty (grandma@email.com)              │
│ Pledged $50 last year                          │
│ [Send Invitation for This Year]                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Uncle Bob (bob@email.com)                      │
│ Pledged $25 last year                          │
│ [Send Invitation for This Year]                │
└─────────────────────────────────────────────────┘

[Invite All Previous Sponsors] ← One click!

NEW SPONSORS
──────────────────────────────────────────────────
[email field] [name field] [Send Invitation]
```

### One-Click Re-Invite

Parent clicks "Invite All Previous Sponsors":

```
Send invitations to 3 previous sponsors?

• Grandma Betty (grandma@email.com)
• Uncle Bob (bob@email.com)
• Aunt Mary (mary@email.com)

[Send All Invitations]
```

### Email Returning Sponsor Receives

```
Subject: Emma is reading again this year!

Hi Betty,

Great news! Emma is participating in the 2025 Read-a-thon
and would love your support again!

Last year you pledged $50 and Emma read 623 minutes.
This year her goal is 500 minutes.

[Support Emma Again]

────────────────────────────────────────

Your previous pledge: $50 (flat amount)
Click above to pledge for this year.
```

**Key difference from new sponsor email:**
- References last year's pledge
- Shows last year's outcome (minutes read)
- Pre-fills pledge amount from last year

---

## Flow B: Returning Sponsor Pledge Page

When Betty clicks the link:

**Screen: /invite/[token] (returning sponsor version)**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        Welcome back, Betty!                             │
│                                                         │
│        Support Emma's Reading Again!                    │
│                                                         │
│              [ProgressCircle - 0%]                      │
│                                                         │
│        Emma is a 3rd grader at Janney School           │
│        Goal: 500 minutes                                │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Last year you pledged $50 and Emma read 623 minutes!  │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Your pledge this year:                                 │
│                                                         │
│  [$25] [$50 ✓] [$100] [Other]   ← $50 pre-selected    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ○ Pay now by card                                      │
│  ○ Pay later (we'll email you)                         │
│  ○ Mail a check                                         │
│                                                         │
│            [Pledge $50 for Emma]                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pre-filled from last year:**
- Sponsor name (Betty)
- Default amount ($50 - matches last year)
- Payment preference (if they paid by card before, default to card)

**Zero friction for repeat:**
- Click link → Amount already selected → One button → Done

---

## Flow C: Sponsor Returns on Their Own (No Invitation)

Betty wants to sponsor Emma but hasn't received this year's invitation.

### Screen: Sponsor Login (/sponsor/login)

```
Welcome back to the Read-a-thon!

Enter your email:
[grandma@email.com          ]

[Send me a login link]

────────────────────────────────────

First time sponsoring?
Ask the parent for their child's sponsor link.
```

### Magic Link Email

```
Subject: Your Read-a-thon Login Link

Hi Betty,

Click below to access your sponsor account:

[Sign In Now]

────────────────────────────────────

Children you've sponsored:
• Emma S. (2024: $50, 2023: $40)

Sign in to sponsor them again for 2025!
```

### Sponsor Dashboard (Returning)

After clicking magic link:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Welcome back, Betty!                                   │
│                                                         │
│  SPONSOR AGAIN FOR 2025                                │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Emma S. (3rd grade)                             │   │
│  │                                                 │   │
│  │ 2024: You pledged $50, Emma read 623 minutes   │   │
│  │ 2025: Not yet sponsored                        │   │
│  │                                                 │   │
│  │ [Sponsor Emma for 2025]                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Jacob S. (1st grade)                           │   │
│  │                                                 │   │
│  │ 2024: You pledged $25, Jacob read 412 minutes  │   │
│  │ 2025: Not yet sponsored                        │   │
│  │                                                 │   │
│  │ [Sponsor Jacob for 2025]                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  YOUR PLEDGE HISTORY                                    │
│                                                         │
│  2024 Read-a-thon:                                     │
│  • Emma S.: $50 (paid) ✓                               │
│  • Jacob S.: $25 (paid) ✓                              │
│                                                         │
│  2023 Read-a-thon:                                     │
│  • Emma S.: $40 (paid) ✓                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- Shows ALL children they've previously sponsored
- Shows pledge history by year
- One-click to sponsor again
- Pre-fills last year's amount

---

## Flow D: Sponsor Doesn't Remember Email

### "Find My Account" for Sponsors

On sponsor login, add:
```
"Not sure what email you used? [Find my account]"
```

### Find Account Screen

```
Let's find your account

Who did you sponsor?

Child's first name: [Emma        ]
School: [Janney Elementary ▼]

[Find My Account]
```

### Result

**If found:**
```
Found it!

You sponsored Emma S. in 2024.
Your account email is: g***a@email.com

[Send login link to this email]

Not your email? You may have used a different one.
Contact help@school.org for assistance.
```

### Privacy Considerations
- Requires knowing child's first name AND school
- Only shows masked email
- Rate-limited to prevent enumeration
- Logs all lookup attempts

---

# SENIOR-SPECIFIC CONSIDERATIONS

## Problem: "I Don't Remember Anything"

Grandma calls daughter: "I want to sponsor Emma again but I can't figure out the website."

### Solution 1: Parent Re-Invites

Parent goes to invite screen → sees previous sponsors → clicks "Send Invitation for This Year"

Grandma receives fresh email with magic link. No memory required.

### Solution 2: Parent Records Pledge

Parent uses proxy pledge feature:
- "Grandma called, she wants to pledge $50 again"
- Records pledge on grandma's behalf
- Sends payment link via text (seniors check texts more than email)

### Solution 3: Check Payment

Grandma pledges → Selects "mail a check" → Gets printable instructions
- No online payment anxiety
- Familiar process (writing checks)
- Parent marks received when check arrives

---

## UI Adjustments for Returning Seniors

### Larger "Welcome Back" State

When system recognizes returning sponsor:

```
Welcome back, Betty!

We remember you! You sponsored Emma last year.

[Sponsor Emma Again - $50]   ← Giant button, pre-filled amount

Want to change the amount? [Other amount]
```

One giant button to complete the entire flow.

### Remember Payment Preference

If Betty paid by card last year:
- Pre-select "Pay by card"
- If same card on file (via Square), offer "Use card ending in 4242"

If Betty mailed a check:
- Pre-select "Mail a check"
- Show same instructions as last year

### Simplified Return Dashboard

For returning sponsors, minimize cognitive load:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Hi Betty! Ready to sponsor Emma again?                │
│                                                         │
│  [Yes! Pledge $50 again]  ← ONE BUTTON                 │
│                                                         │
│  or [Change amount] [View my history]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Most returning sponsors want to do the SAME THING as last year.
Make that the one-click path.

---

# DATA MODEL ADDITIONS

## Sponsor History Tracking

```
PledgeHistory {
  sponsor_id: FK
  child_id: FK
  event_id: FK
  event_year: 2024
  pledge_amount: $50
  pledge_type: flat
  final_minutes: 623
  payment_status: paid
}
```

Query: "Show me all sponsors who pledged to this child in previous years"

## Returning Sponsor Detection

When invitation is created, check:
```sql
SELECT * FROM pledges
WHERE sponsor_email = :email
AND child_id = :child_id
AND event_id != :current_event_id
```

If found → Mark invitation as "returning_sponsor: true"
→ Use returning sponsor email template
→ Pre-fill amount on pledge page

## Parent's Previous Sponsor List

```sql
SELECT DISTINCT sponsor_email, sponsor_name, pledge_amount, event_year
FROM pledges
WHERE child_id IN (SELECT id FROM children WHERE parent_id = :parent_id)
AND event_id != :current_event_id
ORDER BY event_year DESC
```

Returns list of people who sponsored any of this parent's children before.

---

# LOVABLE PROMPTS

## Prompt: Returning Parent Re-Enrollment

```
Create a re-enrollment flow for returning parents.

TRIGGER: Parent logs in AND has children not enrolled in current event.

SCREEN: RE-ENROLLMENT PROMPT

Header: "Welcome back, [Name]!"
Subheader: "The [Event Name] is starting! Enroll your children."

For each child not enrolled:
- Checkbox (default checked)
- Child name
- "Was [old grade], [old teacher]"
- Grade dropdown (default = old grade + 1)
- Teacher dropdown (filtered by grade)

Below children:
- Reading goal input (default from event or last year)
- "+ Add a new child" link

[Enroll Selected Children] button

After enrollment → self-pledge prompt → invite sponsors

IMPORTANT: Show previous sponsors for easy re-inviting.
```

## Prompt: Returning Sponsor Invite Section

```
Add a "Previous Sponsors" section to the invite page.

SCREEN: INVITE SPONSORS (enhanced)

SECTION 1: PREVIOUS SPONSORS
"These people sponsored [Child] before:"

For each previous sponsor:
- Card showing name, email, last pledge amount, year
- [Invite for This Year] button per sponsor
- [Invite All Previous Sponsors] button at top

SECTION 2: NEW INVITATION
(existing email invitation form)

BEHAVIOR:
- Query pledges from previous events for this child
- Group by sponsor email, show most recent pledge
- "Invite All" sends batch invitations
- Invitations marked as "returning" for different email template
```

## Prompt: Returning Sponsor Landing Page

```
Create a variant of the sponsor landing page for returning sponsors.

DETECTION: Invitation marked as returning_sponsor = true

CHANGES FROM NEW SPONSOR PAGE:

Header:
"Welcome back, [Sponsor Name]!"
"Support [Child]'s Reading Again!"

Add section showing last year:
"Last year you pledged $[X] and [Child] read [Y] minutes!"

Pre-select amount:
- Amount buttons: last year's amount is pre-selected
- Default to same payment method as last year

Simplify:
- Name field hidden (already known)
- Email hidden (already known)
- Just amount selection and payment

ONE-CLICK OPTION:
If same amount as last year:
[Pledge $50 Again] - giant single button that skips amount selection
```

## Prompt: Sponsor Self-Service Return

```
Create a flow for sponsors to return without an invitation.

SCREEN A: SPONSOR LOGIN (/sponsor/login)
- Email input
- "Send me a login link" button
- "Find my account" link for forgotten email

SCREEN B: FIND ACCOUNT
- Child's first name input
- School dropdown
- Search returns masked email
- Send magic link to found email

SCREEN C: RETURNING SPONSOR DASHBOARD
After magic link login:

Header: "Welcome back, [Name]!"

Section: "Sponsor Again for [Current Year]"
- Cards for each previously-sponsored child
- Shows: child name, grade, last year's pledge, last year's result
- [Sponsor Again] button (pre-fills last amount)
- Visual: "Not yet sponsored for [year]" badge

Section: "Your History"
- Table of all past pledges by year
- Paid status for each
```

## Prompt: Parent-Assisted Return Pledge

```
Enhance the proxy pledge form for returning sponsors.

SCREEN: ADD SPONSOR (enhanced)

When parent starts typing sponsor email:
- Check if email exists in previous pledges
- If found, show: "Betty sponsored Emma before ($50 in 2024)"
- Pre-fill amount with last year's pledge

Add option:
"This sponsor pledged before"
- Toggle that pre-fills from history
- Shows: "Same as last year: $50"
```
