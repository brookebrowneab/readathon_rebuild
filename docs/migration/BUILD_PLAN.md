# Build Plan (Claude Reference → Main Repo)

## Vertical Slice A — Student Logs Reading for Self

### Step A1: Backend endpoints + session (Build new in main repo)
- **Endpoints (contract):**
  - `POST /api/functions/student-login`
  - `GET /api/me/student`
  - `GET /api/me/student/reading-logs`
  - `POST /api/reading_logs`
- **Claude reference files (for guidance only):**
  - `claude_reference/config/routes.php`
  - `claude_reference/api/Controllers/AuthController.php`
  - `claude_reference/api/Controllers/ReadingLogController.php`
  - `claude_reference/api/Repositories/StudentRepository.php`
  - `claude_reference/api/Repositories/ReadingLogRepository.php`
- **Main repo files to create/modify:**
  - `backend/public/index.php`
  - `backend/src/Controller/StudentAuthController.php`
  - `backend/src/Controller/StudentReadingLogsController.php`
  - `backend/src/Service/StudentAuthService.php`
  - `backend/src/Service/StudentReadingLogService.php`
  - `backend/src/Repository/StudentRepository.php`
  - `backend/src/Repository/ReadingLogRepository.php`
  - `backend/src/Support/Session.php`
  - `backend/src/Support/Response.php`
  - `backend/src/Support/Database.php`
- **Tests to add (main repo):**
  - `backend/tests/student_login_test.php`
  - `backend/tests/reading_log_test.php`
- **Acceptance criteria:**
  - Login sets secure session cookie and stores student identity (`stSponsorId` or `student_public_id`).
  - Student `GET /api/me/student` returns contract envelope and expected fields.
  - Student can create a log for self only; unauthorized access returns `401`.
  - `GET /api/me/student/reading-logs` returns only the student’s logs.

### Step A2: Frontend pages + API client (Build new in main repo)
- **Pages (contract/UI):**
  - `/student/login` → Student PIN login page per `PAGE_COMPOSITION.md`
  - `/student/log` → Student log reading page per `PAGE_COMPOSITION.md`
- **Claude reference files (for guidance only):**
  - `claude_reference/frontend/src/pages/student/StudentPinLoginPage.tsx`
  - `claude_reference/frontend/src/pages/student/StudentLogReadingPage.tsx`
  - `claude_reference/frontend/src/components/layout/PageHeader.tsx`
  - `claude_reference/frontend/src/components/legacy/BookContainer.tsx`
  - `claude_reference/frontend/src/components/books/BookSelector.tsx`
- **Main repo files to create/modify:**
  - `frontend/src/pages/student/StudentPinLoginPage.tsx`
  - `frontend/src/pages/student/StudentLogReadingPage.tsx`
  - `frontend/src/components/layout/PageHeader.tsx`
  - `frontend/src/components/legacy/BookContainer.tsx`
  - `frontend/src/components/books/BookSelector.tsx`
  - `frontend/src/components/mobile/MobileMinutesStepper.tsx`
  - `frontend/src/lib/api.ts`
  - `frontend/src/App.tsx`
- **Tests to add (main repo):**
  - `frontend/tests/student-log.spec.ts`
- **Acceptance criteria:**
  - Successful login routes to `/student/log`.
  - Submitting minutes calls `POST /api/reading_logs` and refreshes list.
  - UI matches token/component/layout specs (no redesigns).

### Migration Checklist (Slice A)
1. Implement all four student endpoints with contract envelope.
2. Enforce student-only access via server-side session.
3. Add integration tests for login + reading log create/list.
4. Implement StudentPinLoginPage and StudentLogReadingPage per UI docs.
5. Add Playwright happy-path for login + logging.

### Risks (Slice A)
- Contract mismatch: student endpoints must use `/api/functions/student-login` and `/api/me/student/*`.
- Legacy schema mismatch: no `students.password` column; must rely on `student_public_id` or `stSponsorId`.
- UI parity: must match `StudentLoginPage` and `StudentLogReadingPage` composition exactly.

---

## Slice B — Parent Logs Reading for Child (Refactor + build in main repo)

- **Endpoints:** `GET /children`, `GET /reading_logs?child_id=in.(...)`, `POST /reading_logs`, `PATCH /reading_logs/:id`, `DELETE /reading_logs/:id`
- **Claude reference:** `claude_reference/api/Controllers/ReadingLogController.php`, `claude_reference/frontend/src/pages/parent/LogReadingPage.tsx`
- **Main repo:** build/replace parent log reading pages + backend controllers/services/repositories to match contract
- **Tests:** integration tests for list/create/update/delete with guardian auth; UI tests for parent log flow
- **Acceptance:** parent can log, edit, delete, and view reading logs for their own children only

### Migration Checklist (Slice B)
1. Add guardian authorization checks to reading log endpoints.
2. Implement parent log reading UI per `LogReadingPage` spec.
3. Wire UI to contract endpoints with envelope parsing.
4. Add integration + UI tests.

### Risks (Slice B)
- Relationship scoping must prevent access to other families’ children.
- Reading log update/delete must respect verification rules.
- UI composition for LogReadingPage is detailed and must match.

---

## Slice C — Sponsor Pledge + Payment Flow (Refactor + build in main repo)

- **Endpoints:** `GET /children_public_safe`, `POST /pledges`, `PATCH /pledges/:id`, `DELETE /pledges/:id`, sponsor payment endpoints per contract
- **Claude reference:** `claude_reference/api/Controllers/PledgeController.php`, `claude_reference/api/Controllers/PaymentController.php`, `claude_reference/frontend/src/pages/sponsor/*`
- **Main repo:** align to contract endpoints + UI composition
- **Tests:** integration tests for pledge CRUD, sponsor-scope permissions, payment flow; UI tests for pledge flow
- **Acceptance:** sponsor can pledge to allowed child only; payments reflect pledge totals

### Migration Checklist (Slice C)
1. Implement sponsor pledge creation/update/delete per contract paths.
2. Ensure sponsor can only manage own pledges.
3. Implement sponsor payment flow (guest + logged-in).
4. Add integration tests + UI flow tests.

### Risks (Slice C)
- Legacy pledge schema lacks new fields; must map carefully.
- Sponsor scoping must block access to other sponsors’ pledges.
- Payment endpoints must match contract exactly.

---

## Slice D — Teacher Roster + Reading Logs (Refactor + build in main repo)

- **Endpoints:** `GET /teachers?is_active=...`, `GET /children?homeroom_teacher_id=...`, `GET /reading_logs?child_id=in.(...)`, `POST /reading_logs`
- **Claude reference:** `claude_reference/api/Controllers/TeacherController.php`, `claude_reference/frontend/src/pages/teacher/*`
- **Main repo:** align to contract endpoints + UI composition
- **Tests:** teacher-scope integration tests; UI tests for log entry
- **Acceptance:** teacher can view roster and log reading only for roster students

### Migration Checklist (Slice D)
1. Implement teacher roster lookup using legacy homeroom rules.
2. Implement teacher reading log creation within roster scope.
3. Build teacher dashboard + log reading UI per specs.
4. Add integration + UI tests.

### Risks (Slice D)
- Teacher roster scoping must be exact and enforced server-side.
- Teacher logging permissions may vary by grade; verify contract requirements.

---

## Slice E — Admin Management + Reporting (Refactor + build in main repo)

- **Endpoints:** `/api/admin/*` endpoints in contract (metrics, reports, payments, content, settings)
- **Claude reference:** `claude_reference/api/Controllers/*`, `claude_reference/frontend/src/pages/admin/*`
- **Main repo:** align to contract endpoints + UI composition
- **Tests:** admin-scope integration tests and UI smoke tests
- **Acceptance:** admin can access all admin endpoints with correct scoping and report exports

### Migration Checklist (Slice E)
1. Implement admin auth checks for every admin endpoint.
2. Build admin pages per layout and component specs.
3. Implement report exports and CSV endpoints.
4. Add integration tests + admin UI smoke tests.

### Risks (Slice E)
- CSV/report output must match contract formats.
- Admin endpoints must never leak to non-admins.
- UI layout for admin pages is strict and consistent.

---

## Appendix — Component Diff Reference (Claude → Main Repo)

This appendix flags high-impact shared components to review when migrating/refactoring.

| Component | Claude Source | Common Issues | Target in Main Repo |
|---|---|---|---|
| Button | `claude_reference/frontend/src/components/ui/button.tsx` | Variants/sizes/states differ from `COMPONENT_SPECS.md`. | `frontend/src/components/ui/button.tsx` |
| Input | `claude_reference/frontend/src/components/ui/input.tsx` | Missing error/success variants; size mismatch. | `frontend/src/components/ui/input.tsx` |
| Label | `claude_reference/frontend/src/components/ui/label.tsx` | Variant styling mismatch. | `frontend/src/components/ui/label.tsx` |
| FormField | `claude_reference/frontend/src/components/ui/form-field.tsx` | Spacing/typography mismatch. | `frontend/src/components/ui/form-field.tsx` |
| PageHeader | `claude_reference/frontend/src/components/layout/PageHeader.tsx` | Layout/spacing mismatch to spec. | `frontend/src/components/layout/PageHeader.tsx` |
| BookContainer | `claude_reference/frontend/src/components/legacy/BookContainer.tsx` | Requires exact padding/shadow/variant mapping. | `frontend/src/components/legacy/BookContainer.tsx` |
| ReadingGoalRing | `claude_reference/frontend/src/components/legacy/ReadingGoalRing.tsx` | Legacy SVG behavior must match spec. | `frontend/src/components/legacy/ReadingGoalRing.tsx` |
| BookSelector | `claude_reference/frontend/src/components/books/BookSelector.tsx` | Requires spec-defined structure. | `frontend/src/components/books/BookSelector.tsx` |
| MobileMinutesStepper | not present | Must be built per spec. | `frontend/src/components/mobile/MobileMinutesStepper.tsx` |

