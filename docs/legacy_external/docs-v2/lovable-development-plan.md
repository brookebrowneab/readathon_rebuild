# Lovable Development Plan

## Overview

This document provides stage-by-stage prompts for building the Read-a-thon V2 prototype in Lovable, optimized for Figma-to-code workflow.

**Import Order**: Before using these prompts, ensure your Figma file is connected to Lovable and the design tokens are synced.

---

## Stage 1: Design System Foundation

### Prompt 1.1: Global Styles & Tokens

```
Create the global design system with the following specifications:

COLORS (CSS custom properties):
- Background: --bg-primary: #FFFFFF, --bg-secondary: #FAF9F7, --bg-tertiary: #FFF9F5
- Brand (IMMUTABLE): --brand-blue: #3760AC, --brand-yellow: #C8C42D
- Accents (NO PURPLE): --accent-orange: #FF6B35, --accent-teal: #4ECDC4, --accent-green: #52C41A, --accent-coral: #FF6B6B, --accent-gold: #FFD93D
- Text: --text-primary: #262626, --text-secondary: #595959, --text-tertiary: #8C8C8C
- System: --color-success: #C8C42D, --color-warning: #FAAD14, --color-error: #FF4D4F, --color-info: #3760AC

TYPOGRAPHY:
- Primary font: Inter (system fallback stack)
- Secondary font: Caveat for hand-written accents (use sparingly, <15% of content)
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px

SPACING: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

SHADOWS:
- --shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
- --shadow-sm: 0 2px 4px rgba(0,0,0,0.08)
- --shadow-md: 0 4px 8px rgba(0,0,0,0.10)
- --shadow-lg: 0 8px 16px rgba(0,0,0,0.12)
- --shadow-xl: 0 12px 24px rgba(0,0,0,0.15)

BORDER RADIUS:
- Standard: 2px, 4px, 6px, 8px, 12px, 16px
- Book corner: 8vw (CRITICAL - this is immutable)

MOTION:
- Durations: 150ms (fast), 250ms (base), 400ms (slow)
- Easing: cubic-bezier(0.4, 0, 0.2, 1) for standard, cubic-bezier(0.34, 1.56, 0.64, 1) for spring

Apply these as Tailwind CSS custom configuration and global CSS variables.
```

### Prompt 1.2: BookContainer Component (CRITICAL LEGACY MOTIF)

```
Create a BookContainer component that replicates the legacy book-shaped container. This is a CRITICAL visual element that must be preserved exactly.

SPECIFICATIONS:
- White background (#FFFFFF)
- Curved top-right corner with 8vw border-radius (NEVER change this value)
- Shadow: 3px 3px 6px 3px rgba(0,0,0,0.3)
- Padding: 6% top, 5% right, 2% bottom, 8% left
- Content must flow around the curved corner with minimum 16px clearance

PROPS:
- variant: 'default' | 'compact' | 'wide'
- shadowLevel: 'subtle' | 'normal' | 'prominent'

RESPONSIVE BEHAVIOR:
- Corner radius scales with viewport (8vw maintains proportion)
- On mobile (<768px), padding adjusts to 4% all sides
- Container maintains readable content area at all sizes

Create as a reusable component that wraps child content. This is the PRIMARY container for all main content areas.
```

### Prompt 1.3: ProgressCircle Component (CRITICAL LEGACY MOTIF)

```
Create a ProgressCircle component for visualizing reading progress. This is a CRITICAL visual element with specific overflow behavior.

SPECIFICATIONS:
- SVG-based circular progress indicator
- Default size: 220px diameter (minimum 48px for mobile)
- Stroke width: 10px
- Primary stroke color: #3760AC (brand blue)
- Background track color: #E6EAF1 (light blue)

PROPS:
- progress: number (current minutes read)
- goal: number (target minutes)
- size: number (diameter in pixels)
- strokeColor: string
- animated: boolean
- showPercentage: boolean
- allowOverflow: boolean

OVERFLOW BEHAVIOR (CRITICAL):
When progress exceeds goal (>100%), render MULTIPLE concentric circles:
- Each circle represents 100% of goal
- Inner circles are fully filled
- Outermost circle shows partial progress for remainder
- Stack order: newest circles on outside
- Example: 250% = 2 full inner circles + 50% outer circle

ANIMATION:
- Smooth stroke-dashoffset transition (400ms ease-out)
- Entry animation: draw from 0 to current value

ACCESSIBILITY:
- role="progressbar"
- aria-valuenow, aria-valuemin, aria-valuemax
- Screen reader announces percentage

The center should display the percentage text when showPercentage is true.
```

### Prompt 1.4: Logo and BookIcon Components

```
Create two icon components for the brand identity:

BOOK ICON:
- Simple open book silhouette
- ViewBox: 32x24
- Default fill: white (#FFFFFF)
- Props: size (number), color (string), ariaLabel (string)
- Used in headers and navigation
- SVG path: Open book with pages fanning left and right

LOGO ICON:
- Complex dimensional book design
- Brand colors: blue (#3760AC) and yellow (#C8C42D)
- Size presets: favicon (16px), small (32px), medium (64px), large (128px), header (256px)
- Props: size (preset string), theme ('default' | 'monochrome' | 'inverse'), width (number override)
- Maintains exact proportions at all sizes
- Include page curve effect and binding detail

Both components should be SVG-based with proper viewBox preservation for crisp rendering at any size.
```

---

## Stage 2: Core UI Components

### Prompt 2.1: Button System

```
Create a button component system with these variants:

PRIMARY BUTTON:
- Background: #3760AC (brand blue)
- Text: white
- Padding: 12px 24px
- Border radius: 8px
- Hover: darken 10%, scale 1.02
- Active: darken 15%, scale 0.98
- Focus: 3px solid outline with 2px offset

SECONDARY BUTTON:
- Background: transparent
- Border: 2px solid #3760AC
- Text: #3760AC
- Same hover/active/focus behavior with color inversion

ACCENT BUTTON (for celebrations/achievements):
- Background: #C8C42D (brand yellow)
- Text: #262626 (dark text for contrast)
- Used sparingly for achievement actions

DANGER BUTTON:
- Background: #FF4D4F
- Text: white
- Confirm actions required for destructive operations

ALL BUTTONS:
- Minimum touch target: 44x44px
- Disabled state: 50% opacity, cursor not-allowed
- Loading state: spinner icon, disabled interaction
- Size variants: sm (32px height), md (40px), lg (48px)
```

### Prompt 2.2: Form Components

```
Create form input components with the following specifications:

TEXT INPUT:
- Height: 44px (touch-friendly)
- Border: 1px solid #8C8C8C
- Border radius: 6px
- Focus: 2px solid #3760AC border, subtle blue glow
- Error state: #FF4D4F border, error message below
- Padding: 12px 16px
- Label above input with 8px gap

SELECT DROPDOWN:
- Same styling as text input
- Custom dropdown arrow (brand blue)
- Options with 8px padding, hover highlight

CHECKBOX:
- 20x20px box
- Checked: brand blue fill with white checkmark
- Focus ring: 2px offset

RADIO BUTTONS:
- 20x20px circle
- Selected: brand blue fill with white center dot
- Group label with 16px gap between options

FORM FIELD WRAPPER:
- Label (14px, medium weight, text-secondary)
- Input
- Helper text (12px, text-tertiary)
- Error message (12px, color-error)
- 24px vertical spacing between fields
```

### Prompt 2.3: Card Components

```
Create card components for displaying content:

DATA CARD:
- White background
- 16px padding
- Border radius: 12px
- Shadow: shadow-sm, hover: shadow-md transition
- Optional header section with 16px bottom padding and border

STAT CARD:
- Compact card for numerical displays
- Large number (36px, brand blue)
- Label below (14px, text-secondary)
- Optional icon left-aligned
- Background: bg-secondary (#FAF9F7)

STUDENT CARD:
- Avatar placeholder (48px circle, bg-tertiary)
- Name (18px, font-medium)
- Grade/class info (14px, text-secondary)
- Reading progress indicator (small ProgressCircle, 48px)
- Actions: view details, log reading

PLEDGE CARD:
- Sponsor name and relationship
- Pledge type (per-minute or flat)
- Pledge amount with calculation preview
- Status badge (pending, paid, cancelled)
- Payment action button when applicable
```

### Prompt 2.4: Navigation Components

```
Create navigation components:

TOP HEADER:
- Fixed position, white background
- Height: 64px (desktop), 56px (mobile)
- Logo on left (using LogoIcon, medium size)
- Navigation links center (desktop only)
- User menu on right (avatar + dropdown)
- Shadow-sm on scroll

MOBILE NAV:
- Hamburger menu icon (24px)
- Slide-in drawer from right
- Full-height overlay
- Navigation links stacked vertically
- Close button top-right

SIDEBAR (Admin/Teacher):
- 240px width, collapsible to 64px (icons only)
- Brand blue background at top with logo
- White background for navigation items
- Active item: bg-secondary with left border accent
- Icons (24px) with labels

BREADCRUMBS:
- Text links separated by "/"
- Current page not linked, text-primary
- Previous pages: text-link with hover underline
```

---

## Stage 3: Page Layouts

### Prompt 3.1: Auth Pages Layout

```
Create authentication page layouts:

LOGIN PAGE:
- Split layout: left side illustration (40%), right side form (60%)
- Mobile: form only, full width
- BookContainer wrapping the form section
- Logo centered above form
- Fields: email, password
- "Forgot password?" link below password
- Primary button: "Sign In"
- Secondary link: "Create an account"
- Optional: "Sign in as Student" link (different flow)

REGISTER PAGE:
- Same split layout as login
- BookContainer for form
- Fields: name, email, password, confirm password
- Checkbox: accept terms
- Primary button: "Create Account"
- Link to login page

STUDENT LOGIN PAGE:
- Simplified layout, child-friendly
- Larger touch targets (56px buttons)
- Fields: student code OR email
- Fun illustration of reading children
- Warmer color accents (accent-gold, accent-orange)

PASSWORD RESET:
- Centered narrow form (max-width 400px)
- Email input only
- Success state: show confirmation message
```

### Prompt 3.2: Parent Dashboard Layout

```
Create the parent dashboard page:

HEADER SECTION:
- Welcome message with parent name (using Caveat font for "Welcome!")
- Current event status banner (if active)

CHILDREN OVERVIEW:
- Grid of child cards (1 column mobile, 2-3 columns desktop)
- Each child card shows:
  - Name and avatar
  - ProgressCircle showing reading progress (120px size)
  - Minutes read / goal with percentage
  - Quick action: "Log Reading"
  - Secondary action: "View Details"

RECENT ACTIVITY:
- List of recent reading log entries
- Entry shows: child name, minutes, date, book title (if provided)
- "View all" link

SPONSORSHIP SUMMARY:
- Total pledges received across all children
- Breakdown by child
- Link to invite more sponsors

QUICK ACTIONS SIDEBAR (desktop):
- "Add Reading Log" button
- "Invite Sponsor" button
- "View All Pledges" button

Use BookContainer for main content area. Warm background (#FAF9F7) behind cards.
```

### Prompt 3.3: Reading Log Entry Page

```
Create the reading log entry form:

CHILD SELECTOR:
- If multiple children, show toggle/tabs to select which child
- Selected child shows avatar and name prominently

READING LOG FORM inside BookContainer:
- Date picker (default to today, can select past dates within event period)
- Minutes read: number input with +/- stepper buttons (easier than typing)
- Preset buttons: 15, 30, 45, 60 minutes
- Book title (optional): text input with autocomplete
- Notes (optional): textarea

PROGRESS PREVIEW:
- Show ProgressCircle updating in real-time as minutes are entered
- Display: "This will bring [Child] to X minutes (Y% of goal)"
- Celebration message if this entry will reach/exceed goal

SUBMIT SECTION:
- Primary button: "Log Reading"
- Cancel link
- Success state: confetti animation (brief), confirmation message

READING HISTORY (below form):
- Collapsible list of recent entries for selected child
- Edit/delete actions on each entry
```

### Prompt 3.4: Sponsor Landing Page

```
Create the public sponsor landing page (no auth required):

HERO SECTION:
- Child's first name and grade displayed
- Large ProgressCircle showing current progress (220px)
- "X minutes read so far!"
- Event name and end date

ABOUT THE CHILD (privacy-conscious):
- Reading goal
- Days remaining in event
- Number of sponsors supporting them
- Optional: teacher name, classroom

PLEDGE FORM inside BookContainer:
- Sponsor info: name, email, relationship to child
- Pledge type toggle:
  - Per-minute: amount input (e.g., $0.05), shows projected total
  - Flat amount: fixed donation amount
- Maximum pledge cap (optional)

PLEDGE CALCULATOR:
- Live calculation showing:
  - If per-minute: "At X minutes, your pledge would be $Y"
  - Projected scenarios: goal reached, 150% of goal, current pace

PAYMENT OPTIONS:
- "Pay Now" (immediate Square payment)
- "Pay Later" (pledge now, pay when event ends)

SUCCESS CONFIRMATION:
- Thank you message with BookIcon
- Share buttons to invite others
- Receipt/confirmation email note
```

---

## Stage 4: Student Experience

### Prompt 4.1: Student Dashboard (Child-Friendly)

```
Create a student-facing dashboard optimized for children (ages 6-12):

VISUAL DESIGN:
- Larger text (base 18px minimum)
- More whitespace and simpler layouts
- Warmer, encouraging color palette
- Fun illustrations of reading/books

PROGRESS HERO:
- LARGE ProgressCircle (280px desktop, 200px mobile)
- Big, friendly percentage number in center
- "You've read X minutes!" in Caveat font
- Celebration animations at milestones (25%, 50%, 75%, 100%)

GOAL VISUALIZATION:
- Visual progress bar as alternative to circle
- Book-themed progress (pages filling up, bookshelf filling)
- Days remaining with friendly language

QUICK LOG:
- BIG "Log My Reading!" button (accent-gold background)
- Recent entries as simple list
- Teacher approval status (if applicable)

SPONSOR SECTION:
- "X people are cheering you on!"
- Sponsor names in friendly display (no amounts shown to children)
- Heart/star icons for each sponsor

ACHIEVEMENTS (if implemented):
- Badge display for milestones
- "Keep going!" encouragement messages

All touch targets minimum 48px. Avoid small text or complex navigation.
```

### Prompt 4.2: Student Reading Log (Simplified)

```
Create a child-friendly reading log entry form:

DATE DISPLAY:
- Large, friendly date display (not a picker)
- "Today" as default, simple "Yesterday" option
- Calendar picker only if needed (hidden complexity)

MINUTES INPUT:
- LARGE number display (64px)
- Big +/- buttons (48px touch targets)
- Preset buttons as book icons:
  - 15 min = small book
  - 30 min = medium book
  - 60 min = large book
  - Custom = keyboard icon

BOOK INFO (simplified):
- "What did you read?" single text input
- Optional, not required
- Autocomplete from popular children's books

CELEBRATION PREVIEW:
- Animated preview of progress circle filling
- Encouraging message: "Great job!"
- Star/sparkle effects for good reading sessions

SUBMIT:
- Large, friendly button: "I Read!"
- Green checkmark confirmation
- Option to log more or go back to dashboard

NO error messages in red - use gentle guidance instead.
```

---

## Stage 5: Teacher Dashboard

### Prompt 5.1: Teacher Class Overview

```
Create the teacher dashboard for classroom management:

CLASS HEADER:
- Teacher name and class/grade
- Event participation status
- Quick stats: X students, Y total minutes, Z% participating

STUDENT GRID:
- Card grid of all students
- Each card shows:
  - Student name
  - Small ProgressCircle (64px)
  - Minutes / goal
  - Status indicator (on track, needs encouragement, exceeding)
- Sort options: name, progress, recent activity
- Filter: all, needs attention, goal reached

CLASS PROGRESS:
- Large aggregate progress display
- Class total minutes vs class goal
- Comparison to other classes (if enabled)

PENDING APPROVALS (if teacher approval required):
- Count badge on section
- List of reading logs awaiting approval
- Bulk approve/reject actions

QUICK ACTIONS:
- "Log Reading for Student" (select student, then log)
- "Download Class Report"
- "Send Encouragement Emails"

LEADERBOARD (optional, toggleable):
- Top readers in class
- Privacy: first name + last initial only
```

### Prompt 5.2: Teacher Reading Log Entry

```
Create teacher interface for logging reading on behalf of students:

STUDENT SELECTOR:
- Searchable dropdown of all class students
- Recent students shown first
- Avatar and name display

BULK ENTRY MODE:
- Toggle for "Log for multiple students"
- Checkbox selection of students
- Single date and minutes applies to all selected
- Useful for classroom reading time

SINGLE ENTRY FORM:
- Same fields as parent: date, minutes, book title
- Additional field: "Notes for parent" (optional)
- Checkbox: "Requires parent confirmation" (optional feature)

STUDENT CONTEXT:
- Show selected student's current progress
- Recent reading history
- Alert if unusual entry (e.g., 200+ minutes)

CONFIRMATION:
- Success message with student name
- "Log another" button for efficiency
- Return to class overview option
```

---

## Stage 6: Admin Dashboard

### Prompt 6.1: Admin Event Dashboard

```
Create the admin dashboard for event management:

EVENT STATUS HERO:
- Current event name and date range
- Days remaining countdown
- Status: setup, active, ended
- Quick action buttons: Edit Event, End Event (with confirmation)

KEY METRICS (Stat Cards row):
- Total students enrolled
- Total minutes read
- Total pledges received
- Total amount pledged
- Total amount collected

PARTICIPATION CHART:
- Line graph: daily reading activity
- Bar chart: participation by grade/class
- Toggle: minutes vs student count

TOP PERFORMERS:
- Leaderboard cards for:
  - Top students (by minutes)
  - Top classes (by average or total)
  - Top sponsors (by pledge amount)

RECENT ACTIVITY FEED:
- Live feed of registrations, readings, pledges, payments
- Filterable by type
- Time-relative display (5 min ago, 1 hour ago)

ALERTS/ATTENTION:
- Pending payments to collect
- Unconfirmed registrations
- System alerts
```

### Prompt 6.2: Admin User Management

```
Create admin interface for managing users:

USER LIST:
- Searchable, sortable table
- Columns: name, email, role, children/class, status, last active
- Role badges: Parent, Teacher, Sponsor, Admin
- Status: active, pending, suspended

FILTERS:
- By role
- By status
- By registration date
- By participation (has logged reading, has pledged)

USER DETAIL VIEW:
- Profile information
- Role and permissions
- Related data:
  - Parents: their children, pledges received
  - Teachers: their class, students
  - Sponsors: their pledges, payments
- Action history

BULK ACTIONS:
- Select multiple users
- Bulk email
- Bulk status change
- Export selected to CSV

USER CREATION:
- Manual user creation form
- Role selection determines required fields
- Optional: send welcome email
```

### Prompt 6.3: Admin Payments & Financial

```
Create admin interface for financial management:

FINANCIAL SUMMARY:
- Total pledged amount
- Total collected amount
- Outstanding (pledged - collected)
- Collection rate percentage

PAYMENTS TABLE:
- All payments with: date, payer, amount, status, method
- Status badges: completed, pending, failed, refunded
- Search by payer name or email
- Date range filter

OUTSTANDING PLEDGES:
- List of unpaid pledges
- Sponsor info, student name, amount
- Days since pledge
- "Send Reminder" individual action
- Bulk reminder option

PAYMENT DETAILS:
- Click-through to full payment details
- Square transaction ID
- Receipt link
- Refund option (with confirmation)

MANUAL PAYMENT ENTRY:
- For cash/check payments
- Fields: payer, amount, payment method, reference number
- Links to existing pledge or creates new record

EXPORT:
- Financial report CSV
- Date range selection
- Include/exclude options for data fields
```

---

## Stage 7: Sponsor Flow

### Prompt 7.1: Sponsor Pledge Flow

```
Create the complete sponsor pledge flow (multi-step form):

STEP 1 - SPONSOR INFO:
- Name (required)
- Email (required)
- Relationship to child: dropdown (grandparent, aunt/uncle, family friend, neighbor, parent's colleague, other)
- "Other" shows text input

STEP 2 - PLEDGE TYPE:
- Visual toggle/cards for pledge type
- PER-MINUTE CARD:
  - Amount per minute input ($0.01 - $1.00 range)
  - Shows calculation: "At 500 minutes = $XX"
  - Optional maximum cap input
- FLAT AMOUNT CARD:
  - Fixed dollar amount input
  - "This is a one-time gift regardless of minutes read"

STEP 3 - REVIEW & PAYMENT:
- Summary of pledge
- Child info (first name, goal)
- Calculated amount or range
- Payment options:
  - "Pay Now" - immediate Square payment
  - "Pay When Event Ends" - promise to pay

SQUARE PAYMENT (if Pay Now):
- Square Web Payments SDK integration
- Card input fields
- Billing address (optional)
- Submit payment button

CONFIRMATION:
- Success message
- Pledge details
- Child's progress display
- Share link to invite others
- Email confirmation note
```

### Prompt 7.2: Sponsor Dashboard (Returning Sponsors)

```
Create dashboard for registered sponsors:

MY PLEDGES:
- List of all pledges made
- For each: child name, pledge type, amount, status
- Status: active, paid, pending payment

CHILD PROGRESS:
- For each pledged child, show:
  - ProgressCircle (small, 80px)
  - Current minutes vs goal
  - Projected pledge amount (for per-minute)

PAYMENT ACTIONS:
- "Pay Now" for unpaid pledges
- "Update Pledge" to modify amount
- "Cancel Pledge" (with confirmation)

INVITE OTHERS:
- Share link for each child
- Copy link button
- Email invite option

PAYMENT HISTORY:
- Past payments with receipts
- Download receipt PDF
```

---

## Stage 8: Mobile Optimization

### Prompt 8.1: Mobile Navigation & Layout

```
Apply mobile-first responsive design:

GLOBAL MOBILE RULES:
- Base font size: 16px (prevent iOS zoom)
- Touch targets: minimum 44px
- Padding: 16px horizontal on mobile
- Stack layouts vertically on mobile

MOBILE HEADER:
- Height: 56px
- Logo: small size (32px)
- Hamburger menu icon on right
- No visible navigation links

MOBILE NAVIGATION DRAWER:
- Slide from right
- Full screen overlay
- Large touch-friendly links (56px height)
- User info at top
- Logout at bottom

BOTTOM TAB BAR (for logged-in users):
- Fixed to bottom
- 4-5 key actions as icons with labels
- Parent: Home, Children, Pledges, Profile
- Student: Home, Log Reading, Sponsors, Profile
- Active state: brand blue icon and text

MOBILE CARDS:
- Full width on mobile
- Stack actions vertically
- Larger touch targets for actions

MOBILE FORMS:
- Single column
- Labels above inputs
- Large input heights (48px)
- Sticky submit button at bottom of viewport
```

### Prompt 8.2: Mobile-Specific Components

```
Create mobile-optimized component variants:

MOBILE PROGRESS DISPLAY:
- ProgressCircle: 160px on mobile (vs 220px desktop)
- Stats below in horizontal scroll if multiple
- Swipe between children (if multiple)

MOBILE READING LOG:
- Stepper buttons larger (56px)
- Preset minute buttons in 2x2 grid
- Keyboard: numeric keypad when focused
- Haptic feedback on increment (if supported)

MOBILE STUDENT CARDS:
- Swipeable actions (swipe left for edit/delete)
- Tap for expand/details
- Progress bar instead of circle for compact view

MOBILE TABLES → CARDS:
- Convert tables to stacked cards on mobile
- Key info prominent
- Actions in overflow menu (three dots)
- Expandable for full details

MOBILE FORMS:
- Date picker: native mobile date picker
- Number inputs: native number pad
- Select: native select for accessibility
- Multi-step forms with progress indicator
```

---

## Stage 9: Polish & Interactions

### Prompt 9.1: Micro-interactions & Animations

```
Add polish micro-interactions:

BUTTON INTERACTIONS:
- Hover: scale(1.02), shadow-md, 150ms ease
- Active/Press: scale(0.98), shadow-sm, 100ms
- Loading: subtle pulse animation on background

PROGRESS CIRCLE ANIMATIONS:
- Initial load: stroke draws from 0 to current (800ms ease-out)
- Update: smooth transition to new value (400ms)
- Goal reached: brief pulse + particle burst
- Overflow: new circle appears with scale animation

CARD INTERACTIONS:
- Hover: translate-y(-2px), shadow-lg
- Click feedback: subtle background flash
- Enter viewport: fade-in-up (stagger for lists)

NAVIGATION:
- Page transitions: fade + subtle slide (200ms)
- Drawer: slide from right (300ms ease-out)
- Tab switch: underline slides to active tab

FORM FEEDBACK:
- Success: green checkmark appears + input border green
- Error: shake animation (gentle, 2 cycles)
- Focus: ring appears with subtle scale

CELEBRATIONS (achievement moments):
- Confetti burst (goal reached)
- Star explosion (milestone achievements)
- Respect prefers-reduced-motion: disable or simplify
```

### Prompt 9.2: Loading & Empty States

```
Create loading and empty state components:

SKELETON LOADERS:
- Card skeleton: gray pulsing rectangles matching card layout
- Table skeleton: row placeholders
- Progress circle skeleton: gray ring
- Text skeleton: line placeholders with realistic widths

LOADING SPINNERS:
- Primary: brand blue spinner
- Small (16px): for buttons
- Medium (24px): for inline loading
- Large (48px): for page/section loading
- Always include loading text for accessibility

EMPTY STATES:
- No children: illustration of empty classroom + "Add your first child"
- No reading logs: book illustration + "Log your first reading session"
- No pledges: heart illustration + "Invite sponsors to support [Child]"
- No results (search): magnifying glass + "No results found"
- Each has primary action button

ERROR STATES:
- Connection error: retry button + helpful message
- Not found: 404 with navigation back
- Permission denied: explanation + contact support link
- Generic error: friendly message, no technical jargon
```

### Prompt 9.3: Toast Notifications & Feedback

```
Create notification system:

TOAST NOTIFICATIONS:
- Position: top-right desktop, top-center mobile
- Auto-dismiss: 5 seconds (adjustable)
- Types with icons and colors:
  - Success: green check, bg-green-50
  - Error: red X, bg-red-50
  - Warning: yellow triangle, bg-yellow-50
  - Info: blue info icon, bg-blue-50
- Dismiss button (X)
- Stack multiple (max 3 visible)
- Slide-in animation

INLINE FEEDBACK:
- Form success: inline success message below submit
- Save confirmation: "Saved!" text appears briefly
- Copy confirmation: "Copied!" tooltip

MODAL CONFIRMATIONS:
- Destructive actions require confirmation
- Clear action labels: "Delete Reading Log" not "OK"
- Cancel and confirm buttons (confirm is danger-styled for destructive)
- Backdrop click closes (except for critical confirmations)

PROGRESS FEEDBACK:
- Multi-step forms: step indicator (1 of 3)
- Long operations: progress bar with percentage
- Upload: file name + progress
```

---

## Implementation Notes

### Figma Sync Recommendations

1. **Name layers consistently** - Match component names to these prompts
2. **Use auto-layout** - Ensures responsive behavior translates
3. **Define variants in Figma** - Maps to component props
4. **Group by page/feature** - Easier Lovable import

### Order of Implementation

1. **Stage 1**: Foundation (do first, all other stages depend on it)
2. **Stage 2**: Core components (needed for all pages)
3. **Stage 3**: Parent flows (primary user)
4. **Stage 4**: Student experience (secondary, simpler)
5. **Stage 5**: Teacher dashboard (tertiary)
6. **Stage 6**: Admin (can be later, less user-facing)
7. **Stage 7**: Sponsor flow (critical for fundraising)
8. **Stage 8**: Mobile (apply throughout or at end)
9. **Stage 9**: Polish (final stage)

### Critical Constraints Reminders

- **NO PURPLE** anywhere in the color system
- **8vw corner radius** on BookContainer is IMMUTABLE
- **Progress circle overflow** must show multiple circles
- **Hand-written fonts (Caveat)** limited to 15% of content
- **Touch targets** minimum 44px on mobile
- **Brand colors** (#3760AC blue, #C8C42D yellow) are IMMUTABLE
