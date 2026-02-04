# User Roles and Types

## Primary User Roles

### 1. Parent (`user_type: 'parent'`)

**Purpose**: Family account holders who manage student participants

**Characteristics**:
- Primary account type for families
- Can manage multiple student accounts
- Stored in `users` table
- Linked to students via `familyUserid` and `familyUserName`

**Key Capabilities**:
- Register family account
- Add/edit/delete student profiles
- Log reading minutes for their students
- View family pledges and payments
- Track student progress
- Access year-round

**Landing Page**: `landingP.php` (during active period) or `myaccount.php` (off-season)

### 2. Student (`user_type: 'Student'`)

**Purpose**: Individual student participants in the read-a-thon

**Characteristics**:
- Stored in `students` table
- Must be linked to a parent account
- Has unique `stSponsorId` for pledge tracking
- Includes grade level and teacher assignment

**Key Capabilities**:
- Log their own reading minutes (when logged in)
- View their reading progress
- See their sponsor list
- Track books read

**Landing Page**: `landingSt.php` (during active period) or `myaccount.php` (off-season)

### 3. Teacher (`user_type: 'teacher'`)

**Purpose**: School staff managing classes and monitoring progress

**Characteristics**:
- Stored in both `users` and `teachers` tables
- Associated with specific grade level
- May be designated as homeroom teacher
- Has administrative capabilities for their class

**Key Capabilities**:
- View class reading statistics
- Monitor student progress
- Access class rosters
- Generate class reports
- Download class data (CSV)
- Available year-round functionality

**Landing Page**: `landingT.php`

### 4. Sponsor (`user_type: 'sponsor'`)

**Purpose**: Individuals making pledges to support students

**Characteristics**:
- Stored in `users` table
- Linked to pledges via `spUserName`
- May sponsor multiple students
- Accessed via unique sponsor links

**Key Capabilities**:
- Make pledges (one-time or per-minute)
- View sponsored students' progress
- Make payments for pledges
- Receive payment receipts
- Access payment history

**Landing Page**: `landingSp.php` or `pledge.php` (with sponsor_id parameter)

### 5. Administrator (`user_type: 'admin'`)

**Purpose**: System administrators with full access

**Characteristics**:
- Stored in `admin` table
- Separate authentication system
- Full system access

**Key Capabilities**:
- Access all system functions
- Send bulk emails
- Generate system-wide reports
- Download all data
- Manage payment reconciliation
- View all user accounts
- Access admin panel at `/admin/`

**Landing Page**: `/admin/index.php`

## User Account Structure

### Account Relationships

```
Users (Parent Account)
├── Students (Children)
│   ├── Reading Logs
│   ├── Book Logs
│   └── Pledges
│       └── Sponsors (Users)
└── Payment History
```

### Authentication Details

**Users Table Fields**:
- `id`: Primary key
- `username`: Unique login identifier
- `email`: Contact email
- `password`: MD5 hashed (legacy security)
- `user_type`: Role designation
- `created_at`: Registration timestamp
- `reset_link_token`: Password reset token
- `exp_date`: Token expiration

**Students Table Fields**:
- `id`: Primary key
- `stUserName`: Student's username
- `stFirstName`, `stLastName`: Name
- `grade`: Grade level (Pre-K through Fifth)
- `teacher`: Assigned teacher
- `stSponsorId`: Unique identifier for sponsors
- `familyUserid`: Link to parent account
- `familyUserName`: Parent's username
- `privacy`: Visibility settings

## Session Management

**Session Variables**:
- `$_SESSION["loggedin"]`: Boolean authentication flag
- `$_SESSION["id"]`: User ID
- `$_SESSION["username"]`: Username
- `$_SESSION["user_type"]`: Role type
- `$_SESSION["sponsor_id"]`: For sponsor redirects

## Role Transitions

### Registration Paths
1. **Family Registration**: `register.php` → Creates parent account
2. **Teacher Registration**: `registerTeacher.php` → Creates teacher account
3. **Sponsor Registration**: Accessed via unique links with `sponsor_id`
4. **Student Creation**: Through parent account after login

### Login Routing
The `login.php` file routes users based on:
1. Authentication status
2. User type
3. Current date (active period vs off-season)
4. Sponsor ID (for sponsor-specific flows)

### Special Considerations

**Multi-Role Users**:
- A parent can also be a sponsor
- Teachers may have parent accounts
- System uses primary `user_type` for routing

**Guest/Anonymous Access**:
- No guest access to system functions
- Public pages limited to login/registration
- Sponsor links require registration/login

**Account Lifecycle**:
- No apparent account deactivation
- Accounts persist across read-a-thon cycles
- Password reset via email token
- No automatic session expiration defined in code