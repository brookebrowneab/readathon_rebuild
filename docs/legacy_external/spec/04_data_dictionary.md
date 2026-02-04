# Data Dictionary

## Core Tables

### `users`
**Purpose**: Primary authentication and account table for parents, sponsors, and administrators

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(255) | NOT NULL | Contact email address |
| password | VARCHAR(255) | NOT NULL | MD5 hashed password |
| user_type | TINYTEXT | NOT NULL | Role: 'parent', 'sponsor', 'admin' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| reset_link_token | VARCHAR(255) | NULL | Password reset token |
| exp_date | DATE | NULL | Token expiration date |

### `students`
**Purpose**: Student participant records linked to family accounts

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student identifier |
| stUserName | VARCHAR(16) | NOT NULL | Student's login username |
| stPassword | VARCHAR(8) | NOT NULL | Student's password (plain text) |
| stFirstName | VARCHAR(30) | NULL | Student's first name |
| stLastName | VARCHAR(30) | NULL | Student's last name |
| stSponsorId | VARCHAR(10) | UNIQUE | Unique identifier for sponsor links |
| familyUserName | VARCHAR(50) | NULL | Parent's username (link to users) |
| familyUserid | INT | NULL | Parent's user ID (link to users.id) |
| readingGoal | INT | NULL | Target reading minutes |
| grade | VARCHAR(30) | NULL | Grade level (Pre-K through Fifth) |
| teacher | VARCHAR(50) | NULL | Assigned teacher name |
| schoolId | VARCHAR(11) | NULL | School identifier |
| privacy | VARCHAR(11) | NULL | Privacy setting for visibility |

### `teachers`
**Purpose**: Teacher accounts and class assignments

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique teacher identifier |
| username | VARCHAR(255) | NOT NULL | Teacher's username |
| grade | VARCHAR(255) | NULL | Grade level taught |
| homeroom | VARCHAR(255) | NULL | Homeroom designation |

### `pledges`
**Purpose**: Sponsor commitments to students

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Record identifier |
| pledgeId | VARCHAR(10) | UNIQUE | Unique pledge identifier |
| spUserName | VARCHAR(50) | NOT NULL | Sponsor's username |
| stSponsorId | VARCHAR(10) | NOT NULL | Student's sponsor ID |
| amt | DECIMAL(6,2) | NOT NULL | Pledge amount (dollars or per-minute rate) |
| unit | VARCHAR(20) | NOT NULL | 'one-time' or 'by-the-minute' |
| paid | INT | DEFAULT 0 | Amount paid in cents |
| order_id | VARCHAR(255) | NULL | Square order identifier |
| payment_id | VARCHAR(255) | NULL | Square payment identifier |
| dateTime | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Pledge creation time |

### `payments`
**Purpose**: Payment transaction records from Square

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Record identifier |
| sponsor_id | VARCHAR(50) | NULL | Sponsor identifier |
| payment_id | VARCHAR(255) | NULL | Square payment ID |
| order_id | VARCHAR(255) | NULL | Square order ID |
| pledgeId_json | JSON | NULL | Array of pledge IDs in payment |
| customerId | VARCHAR(255) | NULL | Square customer ID |
| paid_amt | DECIMAL(10,2) | NULL | Total amount paid |
| paid_date | DATETIME | NULL | Payment timestamp |
| pymt_status | VARCHAR(50) | NULL | Payment status |
| receipt_link | VARCHAR(255) | NULL | Square receipt URL |

### `readingLog`
**Purpose**: Individual reading session entries

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| logId | INT | PRIMARY KEY, AUTO_INCREMENT | Unique log entry |
| minutes | INT | NOT NULL | Minutes read in session |
| dateRead | DATE | NULL | Date of reading |
| dateEntered | DATETIME | DEFAULT CURRENT_TIMESTAMP | Entry timestamp |
| stSponsorId | VARCHAR(10) | NOT NULL | Student identifier |
| enteredBy | VARCHAR(50) | NULL | Who entered the log |

### `bookLog`
**Purpose**: Books completed by students

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| title | VARCHAR(100) | NOT NULL | Book title |
| author | VARCHAR(60) | NOT NULL | Book author |
| stSponsorId | VARCHAR(10) | NOT NULL | Student identifier |

### `lastEmailSent`
**Purpose**: Track email communications to prevent duplicates

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| spUserName | VARCHAR(100) | NULL | Sponsor username |
| dateSent | DATETIME | NULL | Email sent timestamp |

### `admin`
**Purpose**: Administrative user accounts (parallel to users table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Admin identifier |
| username | VARCHAR(50) | NOT NULL | Admin username |
| email | VARCHAR(255) | NOT NULL | Admin email |
| password | VARCHAR(255) | NOT NULL | MD5 hashed password |
| user_type | TINYTEXT | NOT NULL | Always 'admin' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| reset_link_token | VARCHAR(255) | NULL | Password reset token |
| exp_date | DATE | NULL | Token expiration |

## Key Views

### `studentReading`
**Purpose**: Aggregated reading totals per student
- Combines: students + SUM(readingLog.minutes)
- Fields: Student info + totalRead (total minutes)

### `kitchenSink`
**Purpose**: Comprehensive denormalized view for reporting
- Joins: pledges + students + users + reading totals + payments
- Includes calculated pledge amounts and payment status

### `pledgeSums`
**Purpose**: Calculate total pledge amounts
- Handles per-minute calculation (rate × minutes read)
- Aggregates by sponsor

### `TotalsByClassGrade`
**Purpose**: Class-level reading statistics
- Groups by: grade, class (teacher)
- Calculates: total minutes per class

### `sponsorTotals`
**Purpose**: Sponsor-level financial summary
- Total pledged amount
- Total paid amount
- Outstanding balance

## Relationships

### Primary Relationships
1. **Parent ↔ Students**: One-to-many via `familyUserid`
2. **Student ↔ Reading Logs**: One-to-many via `stSponsorId`
3. **Student ↔ Pledges**: One-to-many via `stSponsorId`
4. **Sponsor ↔ Pledges**: One-to-many via `spUserName`
5. **Pledge ↔ Payment**: Many-to-one via `pledgeId_json`
6. **Student ↔ Books**: One-to-many via `stSponsorId`

### Key Identifiers
- `stSponsorId`: Unique student identifier for sponsor relationships
- `pledgeId`: Unique pledge transaction identifier
- `payment_id`: Square payment transaction ID
- `order_id`: Square order ID for grouping line items

## Data Types and Constraints

### Monetary Values
- `pledges.amt`: DECIMAL(6,2) - Dollar amounts
- `pledges.paid`: INT - Cents (for precision)
- `payments.paid_amt`: DECIMAL(10,2) - Dollar amounts

### Temporal Data
- Dates: DATE format for reading dates
- Timestamps: DATETIME/TIMESTAMP for transactions
- No timezone handling (assumes local time)

### Text Constraints
- Usernames: 16-50 characters
- Passwords: 8 characters (students), 255 (hashed for others)
- Names: 30 characters
- Email: 255 characters

## Calculated Fields

### Total Reading Minutes
- Source: SUM(readingLog.minutes) GROUP BY stSponsorId
- Used for: Progress tracking, per-minute pledge calculations

### Pledge Amounts
- One-time: `amt` field directly
- Per-minute: `amt × total_minutes`
- Stored in cents for payment processing

### Payment Status
- Derived from: `pledges.paid > 0`
- Full payment when: `paid = calculated_total`

## Data Integrity Notes

1. **No Foreign Key Constraints**: Relationships enforced in application logic
2. **Duplicate Prevention**: Username uniqueness enforced
3. **Orphan Records**: Possible due to lack of cascading deletes
4. **Password Storage**: 
   - MD5 hashing for users/admin (security concern)
   - Plain text for students (major security concern)
5. **Soft Deletes**: Not implemented, records physically deleted