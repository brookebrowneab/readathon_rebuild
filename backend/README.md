# Backend (Readathon Slice A)

## Environment Variables
Set these for MySQL access:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

Student login validates `students.stUserName` against a password that matches either `students.student_public_id` or `students.stSponsorId` (legacy data has no explicit student password column).

## Dev Server

```bash
php -S localhost:8000 -t backend/public
```

## Endpoints (Slice A)

- `POST /api/functions/student-login`
- `GET /api/me/student`
- `GET /api/me/student/reading-logs`
- `POST /api/reading_logs`

All responses use `{ "ok": true, "data": ... }` or `{ "ok": false, "error": { ... } }`.
