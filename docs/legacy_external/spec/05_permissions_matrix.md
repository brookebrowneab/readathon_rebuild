# Permissions Matrix

## Access Control Overview

The system uses session-based authentication with role checking at the page level. Access is controlled through:
1. Session validation (`$_SESSION["loggedin"]`)
2. User type checking (`$_SESSION["user_type"]`)
3. Page-level redirects based on role
4. Date-based feature availability

## Permission Matrix by Feature

| Feature | Parent | Student | Teacher | Sponsor | Admin | Guest |
|---------|--------|---------|---------|---------|-------|-------|
| **Account Management** |
| Register account | ✓ | - | ✓ | ✓ | - | ✓ |
| Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reset password | ✓ | - | ✓ | ✓ | ✓ | - |
| View own profile | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Edit own profile | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| **Student Management** |
| Add students | ✓ | - | - | - | - | - |
| Edit students | ✓ | - | - | - | - | - |
| Delete students | ✓ | - | - | - | - | - |
| View own students | ✓ | - | - | - | - | - |
| View all students | - | - | ✓* | - | ✓ | - |
| Set privacy settings | ✓ | - | - | - | - | - |
| **Reading Logs** |
| Log reading (own) | - | ✓ | - | - | - | - |
| Log reading (students) | ✓ | - | - | - | - | - |
| View own reading | - | ✓ | - | - | - | - |
| View family reading | ✓ | - | - | - | - | - |
| View pledged student | - | - | - | ✓ | - | - |
| View class reading | - | - | ✓ | - | - | - |
| View all reading | - | - | - | - | ✓ | - |
| Edit reading logs | ✓ | - | - | - | - | - |
| Delete reading logs | ✓ | - | - | - | - | - |
| **Book Logs** |
| Add books | ✓ | ✓ | - | - | - | - |
| View own books | - | ✓ | - | - | - | - |
| View family books | ✓ | - | - | - | - | - |
| **Pledges** |
| Make pledges | - | - | - | ✓ | - | - |
| View own pledges (received) | ✓ | ✓ | - | - | - | - |
| View own pledges (made) | - | - | - | ✓ | - | - |
| View all pledges | - | - | - | - | ✓ | - |
| Edit pledges | - | - | - | ✓** | - | - |
| Delete pledges | ✓*** | - | - | - | - | - |
| **Payments** |
| Make payments | - | - | - | ✓ | - | - |
| View own payments | - | - | - | ✓ | - | - |
| View family payments | ✓ | - | - | - | - | - |
| View all payments | - | - | - | - | ✓ | - |
| Process refunds | - | - | - | - | ✓ | - |
| Download receipts | - | - | - | ✓ | - | - |
| **Reporting** |
| View own statistics | ✓ | ✓ | - | ✓ | - | - |
| View class statistics | - | - | ✓ | - | - | - |
| View school statistics | - | - | ✓ | - | ✓ | - |
| Download class CSV | - | - | ✓ | - | - | - |
| Download all CSV | - | - | - | - | ✓ | - |
| View leaderboards | ✓ | ✓ | ✓ | ✓ | - | - |
| **Communications** |
| Send sponsor invites | ✓ | - | - | - | - | - |
| Send payment reminders | - | - | - | - | ✓ | - |
| Send bulk emails | - | - | - | - | ✓ | - |
| View email history | - | - | - | - | ✓ | - |
| **Special Features** |
| Upload videos (Pajama Jamboree) | ✓ | - | - | - | - | - |
| View sponsor list | - | - | - | - | ✓ | - |
| Re-enroll students | ✓ | - | - | - | - | - |
| Access admin panel | - | - | - | - | ✓ | - |

### Legend
- ✓ : Full access
- ✓* : Limited to own class
- ✓** : Can edit before payment
- ✓*** : Can delete family pledges
- \- : No access

## Page-Level Access Control

### Public Pages (No Authentication Required)
- `login.php`
- `register.php`
- `registerTeacher.php`
- `reset-password.php`
- `privacypolicy.php`

### Authenticated Pages by Role

#### Parent Access
- `landingP.php` (during active period)
- `myaccount.php`
- `enroll.php` (add students)
- `del.php` (delete students)
- `delPledge.php` (delete pledges)
- `delReading.php` (delete reading logs)
- `editPledge.php`
- `editReading.php`
- `reenroll.php`
- `pjamboree.php` (video upload)
- `uploadVideo.php`

#### Student Access
- `landingSt.php` (during active period)
- `myaccount.php` (limited view)

#### Teacher Access
- `landingT.php`
- `downloadCSV.php`
- `myaccount.php` (teacher view)

#### Sponsor Access
- `landingSp.php`
- `pledge.php`
- `square-payment/payment.php`
- `square-payment/payment-close.php`
- `repledge.php`

#### Admin Access
- `/admin/*` (all admin directory files)
- `admin-emails.php`
- `send-emails.php`
- `download.php`
- All user-accessible pages

## Session-Based Routing Logic

### Login Routing (`login.php`)
```
If logged in AND during active period:
  - sponsor → pledge.php or landingSp.php
  - Student → landingSt.php
  - teacher → landingT.php
  - parent → landingP.php
  - default → myaccount.php

If logged in AND outside active period:
  - sponsor → pledge.php or myaccount.php
  - Student → myaccount.php
  - teacher → landingT.php (always accessible)
  - parent → myaccount.php
  - default → myaccount.php
```

### Access Denial Handling
1. **Not Logged In**: Redirect to `login.php`
2. **Wrong Role**: Redirect to appropriate landing page
3. **Outside Date Range**: Redirect to `myaccount.php`
4. **Invalid Sponsor ID**: Show error or redirect

## Data-Level Access Control

### Student Privacy
- Privacy field in students table
- Controls visibility to non-family members
- Parents always see their own students

### Pledge Visibility
- Sponsors see only their pledges
- Parents see family pledges
- Students see pledges to them
- Admin sees all

### Payment Information
- Sponsors see own payments only
- Square receipt links accessible to payer
- Admin has full payment visibility

## Temporal Access Control

### Date-Based Features
Controlled by `BrookeDev/startenddate.php`:
- `$start_date`: Read-a-thon start
- `$end_date`: Read-a-thon end
- `$lastLog_date`: Last day to log reading

### Feature Availability
**During Active Period**:
- Reading log entry enabled
- Real-time progress visible
- Student self-entry allowed

**After End Date**:
- Reading logs locked
- Payment collection active
- Final totals frozen

**Off-Season**:
- Limited to viewing historical data
- Registration remains open
- Teachers retain full access

## Security Considerations

### Authentication Weaknesses
1. MD5 password hashing (outdated)
2. Student passwords in plain text
3. No password complexity requirements
4. No account lockout mechanism
5. No two-factor authentication

### Session Security
1. PHP session-based (file storage)
2. No explicit session timeout
3. Session fixation possible
4. No CSRF protection visible

### Authorization Gaps
1. Direct file access if URL known
2. No role hierarchy
3. Parameter tampering possible (sponsor_id)
4. SQL injection risks (some prepared statements missing)