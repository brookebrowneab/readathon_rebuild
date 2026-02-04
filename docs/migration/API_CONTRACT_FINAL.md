# API CONTRACT (FINAL)
Last updated: 2026-02-04

Generated: 2026-02-03

This is the **deduplicated** API contract derived from:
- `MIGRATION_MAP (2).md` — Section 4.8 tables across all pages
- `EDGE_FUNCTIONS_API (1).md` — edge-function parity surface
- `dbevptgp6jaaqa-2.sql` — legacy MySQL schema (tables referenced for compatibility)

## Conventions
- Base path: `/api` (prepend to endpoints below)
- JSON response envelope:
  - Success: `{"ok": true, "data": <payload>}`
  - Error: `{"ok": false, "error": {"code","message","details"}}`
- Standard error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`
- Pagination (when applicable): `{ items: [...], page, pageSize, total }`

## Endpoint Normalization
- All production endpoints MUST live under `/api/...`.
- Any Lovable/Supabase edge-function paths are treated as **parity references only** and are mapped to `/api/...` endpoints in this contract.

## Roles
`public`, `parent`, `student`, `sponsor`, `teacher`, `admin`

## Scoping Rules

These rules explain how the same endpoints return different data depending on the authenticated user’s relationship to a specific student. A single user can have different relationships with different students.

### General Principles
- The backend enforces all authorization and scope checks.
- The frontend MUST NOT “filter” data to enforce security; it may only filter for UX.
- If a user requests an out-of-scope resource, return:
  - `401 UNAUTHORIZED` if not logged in
  - `403 FORBIDDEN` if logged in but not permitted
- If a user holds multiple relationships to the same student, the most permissive applicable relationship governs (e.g., guardian permissions override sponsor permissions).

### Relationships (evaluated per student)
A logged-in user may be in one or more of these relationships for a given student:

#### 1) Guardian (Parent view)
A user is a guardian for a student when:
- `students.familyUserid == session.userId`

Guardian permissions:
- View the student (full guardian-safe fields)
- Edit/manage the student (within allowed fields)
- Log reading for the student (if enabled)
- View family-linked pledge/payment summaries for that student/family

#### 2) Sponsor (Sponsor view)
A user is a sponsor for a student when:
- the user has an existing pledge to that student (`pledges.sponsorUserId == session.userId` and `pledges.stSponsorId == student.stSponsorId`), OR
- the user is accessing via a valid sponsor token link (if supported)

Sponsor permissions:
- View limited student progress needed for sponsoring
- Create/update/delete the sponsor’s own pledges for that student
- View only the sponsor’s own pledge(s) and payment receipt(s)

Sponsor restrictions:
- Cannot edit/manage the student
- Cannot log reading for the student
- Cannot view family account details or other sponsors’ pledges

#### 3) Teacher
A user is a teacher for a student when:
- `students.homeroom_teacher_username == session.teacherUsername` (or equivalent legacy roster rule)

Teacher permissions:
- View roster students (teacher-safe fields)
- View reading logs for roster students (if enabled)
- Log reading and/or validate reading logs for roster students only if your workflow allows it

Teacher restrictions:
- Cannot view sponsor identities/contact info
- Cannot view payment details
- Cannot view family account details

#### 4) Student (Self)
A user is the student when:
- the student session is authenticated and maps to `students.stSponsorId` (or `students.student_public_id`)

Student permissions:
- View own student record (restricted fields)
- Log reading for self (if enabled)

Student restrictions:
- Cannot view sponsor contact info
- Cannot view payment info
- Cannot manage family/guardian settings

#### 5) Admin
Admin access is determined by:
- presence in the `admin` table (or an explicit admin role claim)

Admin rules:
- Admin functionality is exposed via `/api/admin/*` endpoints.
- Admin endpoints MUST validate admin authorization on every request.

### Public Endpoints
- Endpoints marked `Auth: No` are public.
- Public endpoints MUST NEVER return child-specific data, family associations, sponsor/payment data, or admin-only settings.
- Example: `GET /api/campaigns/active` returns only non-sensitive campaign metadata (name/dates/rules).

### Scoped Endpoints
- Endpoints under `/api/me/*` are scoped to the authenticated user’s identity and relationships.
- `/api/me/*` endpoints may return multiple relationship-based sets (e.g., guardian students, sponsored students, teacher roster, self) depending on the user.
- `/api/admin/*` endpoints are never scoped this way and require admin authorization.

### Enforcement
- All scoping and permission checks are enforced server-side.
- Failure to meet scope or role requirements MUST return:
  - `401 UNAUTHORIZED` (not logged in)
  - `403 FORBIDDEN` (logged in but outside scope)
  
## Authorization Policy Rules

Authorization is determined by the viewer’s relationship to the specific student and by the action being requested. These rules apply to all endpoints that reference a student.

### Capability checks (conceptual)
Backend implementations should enforce these capability checks consistently:

#### canViewStudent(studentId)
Allowed if viewer is:
- guardian of student, OR
- sponsor of student, OR
- teacher of student, OR
- the student (self), OR
- admin

#### canEditStudent(studentId)
Allowed ONLY if viewer is:
- guardian of student, OR
- admin (admin-only tools)

Sponsors, teachers, and students may not edit student profile fields.

#### canLogReading(studentId)
Allowed if viewer is:
- guardian of student, OR
- the student (self), OR
- teacher of student (ONLY if teacher logging is enabled in your workflow), OR
- admin (admin tools)

Explicitly NOT allowed for sponsors (even if the sponsor is also a parent of a different child).

#### canViewReadingLogs(studentId)
Allowed if viewer is:
- guardian of student, OR
- the student (self), OR
- teacher of student (roster only), OR
- admin

#### canCreatePledge(studentId)
Allowed if viewer is:
- sponsor of student, OR
- guardian of student, OR
- admin

#### canManageOwnPledge(pledgeId)
Allowed if viewer:
- created the pledge (`pledges.sponsorUserId == session.userId`), OR
- is admin

Guardians may view aggregate pledge summaries for their child, but MUST NOT edit or delete pledges created by other sponsors unless explicitly allowed.

#### canViewPaymentsForStudent(studentId)
Allowed if viewer is:
- guardian of student (family-linked summaries), OR
- sponsor of student (own payments/receipts only), OR
- admin

Teachers and students may not view payments.

### Response shaping (required)
Student-related endpoints MUST shape returned fields based on relationship:
- Sponsors see only sponsor-safe fields.
- Teachers see teacher-safe fields.
- Students see student-safe fields.
- Guardians see guardian-safe fields.
- Admin endpoints may return full fields.

Recommended: include `viewerRelationship` and `viewerCapabilities` in student-related responses so the frontend can render the correct “view” without guessing.

## Canonical Action Index
| Action Name | Method | Endpoint | Auth | Roles | Request (example) | Response (example) | Used By (routes) |
|---|---|---|---|---|---|---|---|
| createChild | POST | /children | Y | Parent | {"name":"Emma Smith","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"homeroom_teacher_id":"uuid","share_public_link":true} | {"id":"uuid",...} | /onboarding/add-child |
| createPledges | POST | /pledges | Y | Sponsor | [{"child_id":"uuid1","amount":50,"pledge_type":"flat"},{"child_id":"uuid2","amount":50,"pledge_type":"flat"}] | [{"id":"uuid1"},{"id":"uuid2"}] | /f/:userId |
| createReadingLog | POST | /reading_logs | Y* | Student | {"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"} | {"id":"uuid","minutes":30,...} | /log-reading,/student/dashboard |
| deleteChild | DELETE | /children/:id | Y | Parent | - | - | /children` or `/family/manage |
| deletePledge | DELETE | /pledges/:id | Y | Parent | - | - | /dashboard |
| deleteReadingLog | DELETE | /reading_logs/:id | Y* | Student | - | - | /log-reading,/student/dashboard |
| exportPaymentsReport | GET | /admin/reports/payments?format=csv | Y | Admin | - | CSV file | /admin |
| exportPledgesReport | GET | /admin/reports/pledges?format=csv | Y | Admin | - | CSV file | /admin |
| exportStudentReport | GET | /reports/students?format=csv | Y | Teacher | - | CSV file | /teacher |
| exportStudentsReport | GET | /admin/reports/students?format=csv | Y | Admin | - | CSV file | /admin |
| getActiveEvent | GET | /events?is_active=true | N | - | - | {"id":"uuid","name":"Spring Read-a-thon","start_date":"2024-01-15","end_date":"2024-02-28","goal_minutes":500} | /,/admin,/dashboard,/f/:userId,/log-reading,/teacher |
| getAdminMetrics | GET | /admin/metrics | Y | Admin | - | {"studentsEnrolled":150,"totalMinutes":45000,"totalPledged":5000,"totalCollected":3500} | /admin |
| getAlerts | GET | /admin/alerts | Y | Admin | - | [{"id":"outstanding","count":12,"label":"Outstanding payments","link":"/admin/outstanding"}] | /admin |
| getClassFavoriteBooks | GET | /rpc/get_class_favorite_books?p_class_name=Mrs.+Smith | Y* | Student | - | [{"book_title":"Dog Man","read_count":12}] | /student/dashboard |
| getClassFundraisingTotals | GET | /rpc/get_class_fundraising_total?p_class_name={class} | Y | Parent | - | 750.00 | /dashboard |
| getClassReadingStats | GET | /rpc/get_class_reading_stats?p_class_name=Mrs.+Smith | Y* | Student | - | {"total_minutes":5240,"total_books":45,"student_count":22} | /student/dashboard |
| getClassTotalMinutes | GET | /rpc/get_class_total_minutes?p_class_name={class} | Y | Parent | - | 5240 | /dashboard |
| getGradeFavoriteBooks | GET | /rpc/get_grade_favorite_books?p_grade_info=3rd | Y* | Student | - | [{"book_title":"Diary of a Wimpy Kid","read_count":28}] | /student/dashboard |
| getGradeTotalMinutes | GET | /rpc/get_grade_total_minutes?p_grade_info={grade} | Y | Parent | - | 12450 | /dashboard,/student/dashboard |
| getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | {"id":"uuid","display_name":"Jane Doe"} | /dashboard |
| getSiteContent | GET | /site_content | N | - | - | [{"key":"hero_headline","value":"Read-a-thon Time!"},{"key":"stats_minutes","value":"45000"}] | / |
| getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | {"id":"uuid","name":"Uncle Bob","email":"bob@email.com"} | /f/:userId |
| getStudentData | GET | /me/student | Y* | Student | - | {"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500} | /student/dashboard |
| getStudentReadingLogs | GET | /me/student/reading-logs | Y* | Student | - | [{"id":"uuid","minutes":30,"book_title":"Charlotte's Web","logged_at":"2024-02-01"}] | /student/dashboard,/teacher |
| getTeacherProfile | GET | /teachers?user_id=eq.{user_id}&is_active=eq.true | Y | Teacher | - | {"id":"uuid","name":"Mrs. Smith","teacher_type":"homeroom","grade_level":"3rd","has_full_access":false} | /teacher |
| listAvailableGrades | GET | /children?select=grade_info | Y | Parent | - | ["K","1st","2nd","3rd","4th","5th"] | /onboarding/add-child |
| listChildReadingLogs | GET | /reading_logs?child_id=eq.{id}&order=logged_at.desc | Y | Parent | - | [{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}] | /log-reading |
| listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | [{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"class_name":"Mrs. Smith","grade_info":"3rd"}] | /children` or `/family/manage,/dashboard,/log-reading |
| listFamilyChildren | GET | /children_public_safe?user_id=eq.{userId}&share_public_link=eq.true | N | - | - | [{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247}] | /f/:userId |
| listOutstandingPledges | GET | /pledges?is_paid=eq.false&limit=5 | Y | Admin | - | [{"id":"uuid","sponsor":{"name":"Uncle Bob"},"amount":50,"created_at":"..."}] | /admin |
| listPledgesByChild | GET | /pledges?child_id=in.(...) | Y | Parent | - | [{"id":"uuid","child_id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}] | /dashboard |
| listReadingLogsByChild | GET | /reading_logs?child_id=in.(...) | Y | Parent | - | [{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}] | /children` or `/family/manage,/dashboard |
| listRecentActivity | GET | /admin/activity?limit=10 | Y | Admin | - | [{"type":"pledge","message":"Uncle Bob pledged $50","time":"2 hours ago"}] | /admin |
| listTeachers | GET | /teachers?is_active=eq.true&teacher_type=eq.homeroom | Y | Parent | - | [{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}] | /onboarding/add-child |
| listTeacherStudents | GET | /children?homeroom_teacher_id=eq.{teacher_id} | Y | Teacher | - | [{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}] | /teacher |
| sendBulkReminders | POST | /functions/send-payment-reminder | Y | Admin | {"pledgeIds":["uuid1","uuid2"]} | {"sent":2,"failed":0} | /admin |
| signIn | POST | /auth/token | N | - | {"email":"user@example.com","password":"secret123"} | {"access_token":"jwt","refresh_token":"jwt","user":{"id":"uuid","email":"user@example.com"}} | /login |
| signOut | POST | /auth/logout | Y | Parent | - | - | /dashboard,/f/:userId,/teacher |
| signUp | POST | /auth/signup | N | - | {"email":"user@example.com","password":"Secret123!","data":{"display_name":"Jane Doe","phone":"555-1234"}} | {"access_token":"jwt","user":{"id":"uuid","email":"user@example.com"}} | /register |
| studentForgotPassword | POST | /functions/student-forgot-password | N | - | {"username":"emma_s"} | {"success":true} | /student/login |
| studentLogin | POST | /functions/student-login | N | - | {"username":"emma_s","password":"read123"} | {"success":true,"child":{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}} | /student/login |
| updateChild | PATCH | /children/:id | Y | Parent | {"name":"Emma Smith","grade_info":"4th","goal_minutes":600} | {"id":"uuid",...} | /children` or `/family/manage |
| updatePledge | PATCH | /pledges/:id | Y | Parent | {"amount":75,"pledge_type":"flat"} | {"id":"uuid","amount":75} | /dashboard |
| updateReadingLog | PATCH | /reading_logs/:id | Y* | Student | {"minutes":45,"book_title":"Updated Title"} | {"id":"uuid","minutes":45,...} | /log-reading,/student/dashboard |

## Legacy schema anchors
Legacy tables found in the schema export (high-level):  
admin, AgMinReadByDayFourthGR, audit_log, AvgMinByDaySecondGR, AvgMinByDayThirdGR, AvgMinReadByDayFifthGR, AvgMinReadByDayFirstGR, AvgMinReadByDayK, AvgMinReadByDayPK, AvgMinReadMaxDayTotalRead, AvgMinReadPerDay, bookLog, campaigns, duplicate_pledges, invite_links, janneyParents, kitchenSink, lastEmailSent, LogOver18Hrs, migrations, MoreThanFiveHrsOneDayLogs, payment_pledges, payments, pledges, pledges_old, pledgesPvYr, pledgeSums, pledgeSumsPaid, pledgeSumsR0, readingLog, readingLog_old, ReadingLogSummedbyStudentDate, Readover18hrs, RLSums, sessions, sponsor_invitations, sponsorTotals, stPlus, stPlusPledgeTotals, stPlusReadEmailAll, studentReading, studentReadingInclThoseNotLoggingReading, students, students_old, studentsPvYr, teachers, TotalsByClass, TotalsByClassGrade, TotalsByGrade, UnpaidSponsorsLastEmail, users

## Edge function parity list
Functions to re-implement (PHP service or endpoint):
- `admin-reset-password`
- `bootstrap-admin`
- `link-teacher-account`
- `notify-check-payment`
- `send-guest-payment-email`
- `send-parent-welcome`
- `send-payment-receipt`
- `send-payment-reminder`
- `send-pledge-notification`
- `send-sponsor-thank-you`
- `send-teacher-invite`
- `send-teacher-welcome`
- `send-template-email`
- `student-forgot-password`
- `student-login`
- `student-set-password`
- `process-square-payment`

## Auth

### signIn
- Method: **POST**
- Endpoint: `/auth/token`
- Auth: **N**
- Roles: **-**
- Request example: {"email":"user@example.com","password":"secret123"}
- Response example: {"access_token":"jwt","refresh_token":"jwt","user":{"id":"uuid","email":"user@example.com"}}
- Errors: UNAUTHORIZED ("Invalid login credentials")
- Used by:
- /login — LoginPage (LG-4)

### signOut
- Method: **POST**
- Endpoint: `/auth/logout`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: -
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-1)
- /teacher — TeacherDashboard (TD-1)
- /f/:userId — FamilySponsorPage (FS-13)

### signUp
- Method: **POST**
- Endpoint: `/auth/signup`
- Auth: **N**
- Roles: **-**
- Request example: {"email":"user@example.com","password":"Secret123!","data":{"display_name":"Jane Doe","phone":"555-1234"}}
- Response example: {"access_token":"jwt","user":{"id":"uuid","email":"user@example.com"}}
- Errors: CONFLICT ("User already registered"), VALIDATION_ERROR
- Used by:
- /register — RegisterPage (RG-8)

## Campaign & Site

### getActiveEvent
- **Endpoint:** `GET /api/campaigns/active`
- **Auth:** No
- **Roles:** Public
- **Purpose:** Return non-sensitive information about the currently active campaign/event.
- **Notes:** Used by all dashboards and public pages. Contains no student-, family-, teacher-, or admin-sensitive data.


### getSiteContent
- Method: **GET**
- Endpoint: `/site_content`
- Auth: **N**
- Roles: **-**
- Request example: -
- Response example: [{"key":"hero_headline","value":"Read-a-thon Time!"},{"key":"stats_minutes","value":"45000"}]
- Errors: -
- Used by:
- / — HomePage (HP-LOAD-002)

## Students

### createChild
- Method: **POST**
- Endpoint: `/children`
- Auth: **Y**
- Roles: **Parent**
- Request example: {"name":"Emma Smith","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"homeroom_teacher_id":"uuid","share_public_link":true}
- Response example: {"id":"uuid",...}
- Errors: VALIDATION_ERROR, CONFLICT
- Used by:
- /onboarding/add-child — OnboardingAddChild (OA-10)

### deleteChild
- Method: **DELETE**
- Endpoint: `/children/:id`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: -
- Errors: NOT_FOUND, CONFLICT
- Used by:
- /children` or `/family/manage — ManageChildrenPage (MC-5)

### listAvailableGrades
- Method: **GET**
- Endpoint: `/children?select=grade_info`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: ["K","1st","2nd","3rd","4th","5th"]
- Errors: -
- Used by:
- /onboarding/add-child — OnboardingAddChild (OA-LOAD-002)

### listChildren
- Method: **GET**
- Endpoint: `/children?user_id=eq.{user_id}`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: [{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"class_name":"Mrs. Smith","grade_info":"3rd"}]
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-002)
- /log-reading — LogReadingPage (LR-LOAD-001)
- /children` or `/family/manage — ManageChildrenPage (MC-LOAD-001)

### listFamilyChildren
- Method: **GET**
- Endpoint: `/children_public_safe?user_id=eq.{userId}&share_public_link=eq.true`
- Auth: **N**
- Roles: **-**
- Request example: -
- Response example: [{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247}]
- Errors: -
- Used by:
- /f/:userId — FamilySponsorPage (FS-LOAD-001)

### listTeacherStudents
- Method: **GET**
- Endpoint: `/children?homeroom_teacher_id=eq.{teacher_id}`
- Auth: **Y**
- Roles: **Teacher**
- Request example: -
- Response example: [{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}]
- Errors: -
- Used by:
- /teacher — TeacherDashboard (TD-LOAD-003)

### updateChild
- Method: **PATCH**
- Endpoint: `/children/:id`
- Auth: **Y**
- Roles: **Parent**
- Request example: {"name":"Emma Smith","grade_info":"4th","goal_minutes":600}
- Response example: {"id":"uuid",...}
- Errors: NOT_FOUND, VALIDATION_ERROR
- Used by:
- /children` or `/family/manage — ManageChildrenPage (MC-4)

## Reading Logs

### createReadingLog
- Method: **POST**
- Endpoint: `/reading_logs`
- Auth: **Y***
- Roles: **Student**
- Request example: {"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}
- Response example: {"id":"uuid","minutes":30,...}
- Errors: VALIDATION_ERROR, FORBIDDEN
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-6)
- /log-reading — LogReadingPage (LR-7)

### deleteReadingLog
- Method: **DELETE**
- Endpoint: `/reading_logs/:id`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: -
- Errors: NOT_FOUND, FORBIDDEN
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-8)
- /log-reading — LogReadingPage (LR-10)

### getClassReadingStats
- Method: **GET**
- Endpoint: `/rpc/get_class_reading_stats?p_class_name=Mrs.+Smith`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: {"total_minutes":5240,"total_books":45,"student_count":22}
- Errors: -
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-003)

### getStudentReadingLogs
- Method: **GET**
- Endpoint: `/me/student/reading-logs`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: [{"id":"uuid","minutes":30,"book_title":"Charlotte's Web","logged_at":"2024-02-01"}]
- Errors: -
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-002)
- /teacher — TeacherDashboard (TD-LOAD-004)

### listChildReadingLogs
- Method: **GET**
- Endpoint: `/reading_logs?child_id=eq.{id}&order=logged_at.desc`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: [{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]
- Errors: -
- Used by:
- /log-reading — LogReadingPage (LR-LOAD-003)

### listReadingLogsByChild
- Method: **GET**
- Endpoint: `/reading_logs?child_id=in.(...)`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: [{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-004)
- /children` or `/family/manage — ManageChildrenPage (MC-LOAD-002)

### updateReadingLog
- Method: **PATCH**
- Endpoint: `/reading_logs/:id`
- Auth: **Y***
- Roles: **Student**
- Request example: {"minutes":45,"book_title":"Updated Title"}
- Response example: {"id":"uuid","minutes":45,...}
- Errors: NOT_FOUND, FORBIDDEN
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-7)
- /log-reading — LogReadingPage (LR-9)

## Pledges

### createPledges
- Method: **POST**
- Endpoint: `/pledges`
- Auth: **Y**
- Roles: **Sponsor**
- Request example: [{"child_id":"uuid1","amount":50,"pledge_type":"flat"},{"child_id":"uuid2","amount":50,"pledge_type":"flat"}]
- Response example: [{"id":"uuid1"},{"id":"uuid2"}]
- Errors: VALIDATION_ERROR
- Used by:
- /f/:userId — FamilySponsorPage (FS-12)

### deletePledge
- Method: **DELETE**
- Endpoint: `/pledges/:id`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: -
- Errors: NOT_FOUND, FORBIDDEN
- Used by:
- /dashboard — DashboardPage (DB-7)

### listOutstandingPledges
- Method: **GET**
- Endpoint: `/pledges?is_paid=eq.false&limit=5`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: [{"id":"uuid","sponsor":{"name":"Uncle Bob"},"amount":50,"created_at":"..."}]
- Errors: -
- Used by:
- /admin — AdminDashboard (AD-LOAD-003)

### listPledgesByChild
- Method: **GET**
- Endpoint: `/pledges?child_id=in.(...)`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: [{"id":"uuid","child_id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}]
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-003)

### updatePledge
- Method: **PATCH**
- Endpoint: `/pledges/:id`
- Auth: **Y**
- Roles: **Parent**
- Request example: {"amount":75,"pledge_type":"flat"}
- Response example: {"id":"uuid","amount":75}
- Errors: NOT_FOUND, FORBIDDEN
- Used by:
- /dashboard — DashboardPage (DB-6)

## Payments

### sendBulkReminders
- Method: **POST**
- Endpoint: `/functions/send-payment-reminder`
- Auth: **Y**
- Roles: **Admin**
- Request example: {"pledgeIds":["uuid1","uuid2"]}
- Response example: {"sent":2,"failed":0}
- Errors: INTERNAL
- Used by:
- /admin — AdminDashboard (AD-1)

## Payments: Square Integration Rules

### Browser-initiated payment creation
- The frontend may only initiate payments via a backend endpoint (never call Square directly with secrets).

Typical flow:
1. Frontend calls `POST /api/payments` with pledge IDs and purchaser info.
2. Backend creates Square order/payment intent and returns `checkoutUrl` or client tokens as needed.
3. Frontend redirects user to Square checkout (or completes payment in embedded flow).

### Webhook handling (Square → backend)
- Square webhooks MAY be delivered multiple times.
- Webhook processing MUST be **idempotent**.

Idempotency requirements:
- Identify the payment/order uniquely (Square payment id / order id).
- If the payment is already recorded as `PAID`, ignore duplicates safely.
- Always verify webhook signature per Square requirements.
- Return `{ ok: true }` even when the event is a duplicate (after verification).

### Payment Status States (example)
- `CREATED` → `PENDING` → `PAID`
- Optional: `FAILED`, `CANCELED`, `REFUNDED`

### Data Consistency
- Payment record updates and pledge “paid” flags should be updated in a transaction where possible.
- Store receipt URL / receipt number if available.

## Teacher

### getTeacherProfile
- Method: **GET**
- Endpoint: `/teachers?user_id=eq.{user_id}&is_active=eq.true`
- Auth: **Y**
- Roles: **Teacher**
- Request example: -
- Response example: {"id":"uuid","name":"Mrs. Smith","teacher_type":"homeroom","grade_level":"3rd","has_full_access":false}
- Errors: NOT_FOUND
- Used by:
- /teacher — TeacherDashboard (TD-LOAD-001)

### listTeachers
- Method: **GET**
- Endpoint: `/teachers?is_active=eq.true&teacher_type=eq.homeroom`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: [{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]
- Errors: -
- Used by:
- /onboarding/add-child — OnboardingAddChild (OA-LOAD-001)

## Admin

### exportPaymentsReport
- Method: **GET**
- Endpoint: `/admin/reports/payments?format=csv`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: CSV file
- Errors: INTERNAL
- Used by:
- /admin — AdminDashboard (AD-4)

### exportPledgesReport
- Method: **GET**
- Endpoint: `/admin/reports/pledges?format=csv`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: CSV file
- Errors: INTERNAL
- Used by:
- /admin — AdminDashboard (AD-3)

### exportStudentsReport
- Method: **GET**
- Endpoint: `/admin/reports/students?format=csv`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: CSV file
- Errors: INTERNAL
- Used by:
- /admin — AdminDashboard (AD-2)

### getAdminMetrics
- Method: **GET**
- Endpoint: `/admin/metrics`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: {"studentsEnrolled":150,"totalMinutes":45000,"totalPledged":5000,"totalCollected":3500}
- Errors: -
- Used by:
- /admin — AdminDashboard (AD-LOAD-002)

### getAlerts
- Method: **GET**
- Endpoint: `/admin/alerts`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: [{"id":"outstanding","count":12,"label":"Outstanding payments","link":"/admin/outstanding"}]
- Errors: -
- Used by:
- /admin — AdminDashboard (AD-LOAD-005)

### listRecentActivity
- Method: **GET**
- Endpoint: `/admin/activity?limit=10`
- Auth: **Y**
- Roles: **Admin**
- Request example: -
- Response example: [{"type":"pledge","message":"Uncle Bob pledged $50","time":"2 hours ago"}]
- Errors: -
- Used by:
- /admin — AdminDashboard (AD-LOAD-004)

## Exports & Downloads Conventions

### Content types
- CSV downloads MUST return:
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="..."`

### Authorization
- Exports that include student data MUST require auth and enforce scope.
- Admin exports MUST be under `/api/admin/*` and require admin authorization.

### Large exports
- If exports may be large, support async export jobs:
  - `POST /api/admin/exports` → returns job id
  - `GET /api/admin/exports/:id` → status + download URL
  
## Email & Notifications Rules

### Sending model
- Email sending should be **queued** when possible (recommended), but may be synchronous initially.
- All email-send endpoints return:
  - `{ ok: true, data: { queued: true } }` if queued
  - `{ ok: true, data: { sent: true } }` if synchronous

### Templates
- Template-based email endpoints must validate required variables.
- Missing variables return `400 VALIDATION_ERROR`.

### Authorization
- Payment receipts: allowed for sponsor/parent for their own payment only.
- Payment reminders: admin-only.
- Teacher invites: admin or parent-only depending on workflow.
- Student emails: avoid direct student email; prefer parent-controlled communication for COPPA.

## Other

### exportStudentReport
- Method: **GET**
- Endpoint: `/reports/students?format=csv`
- Auth: **Y**
- Roles: **Teacher**
- Request example: -
- Response example: CSV file
- Errors: INTERNAL
- Used by:
- /teacher — TeacherDashboard (TD-8)

### getClassFavoriteBooks
- Method: **GET**
- Endpoint: `/rpc/get_class_favorite_books?p_class_name=Mrs.+Smith`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: [{"book_title":"Dog Man","read_count":12}]
- Errors: -
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-005)

### getClassFundraisingTotals
- Method: **GET**
- Endpoint: `/rpc/get_class_fundraising_total?p_class_name={class}`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: 750.00
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-008)

### getClassTotalMinutes
- Method: **GET**
- Endpoint: `/rpc/get_class_total_minutes?p_class_name={class}`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: 5240
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-005)

### getGradeFavoriteBooks
- Method: **GET**
- Endpoint: `/rpc/get_grade_favorite_books?p_grade_info=3rd`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: [{"book_title":"Diary of a Wimpy Kid","read_count":28}]
- Errors: -
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-006)

### getGradeTotalMinutes
- Method: **GET**
- Endpoint: `/rpc/get_grade_total_minutes?p_grade_info={grade}`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: 12450
- Errors: -
- Used by:
- /dashboard — DashboardPage (DB-LOAD-006)
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-004)

### getProfile
- Method: **GET**
- Endpoint: `/profiles?user_id=eq.{user_id}`
- Auth: **Y**
- Roles: **Parent**
- Request example: -
- Response example: {"id":"uuid","display_name":"Jane Doe"}
- Errors: NOT_FOUND
- Used by:
- /dashboard — DashboardPage (DB-LOAD-001)

### getSponsorProfile
- Method: **GET**
- Endpoint: `/sponsors?user_id=eq.{user_id}`
- Auth: **Y**
- Roles: **Sponsor**
- Request example: -
- Response example: {"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}
- Errors: -
- Used by:
- /f/:userId — FamilySponsorPage (FS-LOAD-003)

### getStudentData
- Method: **GET**
- Endpoint: `/me/student`
- Auth: **Y***
- Roles: **Student**
- Request example: -
- Response example: {"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500}
- Errors: UNAUTHORIZED
- Used by:
- /student/dashboard — StudentPinDashboardPage (SD-LOAD-001)

### studentForgotPassword
- Method: **POST**
- Endpoint: `/functions/student-forgot-password`
- Auth: **N**
- Roles: **-**
- Request example: {"username":"emma_s"}
- Response example: {"success":true}
- Errors: NOT_FOUND, RATE_LIMITED
- Used by:
- /student/login — StudentPinLoginPage (SL-5)

### studentLogin
- Method: **POST**
- Endpoint: `/functions/student-login`
- Auth: **N**
- Roles: **-**
- Request example: {"username":"emma_s","password":"read123"}
- Response example: {"success":true,"child":{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}}
- Errors: UNAUTHORIZED ("Login failed"), VALIDATION_ERROR
- Used by:
- /student/login — StudentPinLoginPage (SL-3)


