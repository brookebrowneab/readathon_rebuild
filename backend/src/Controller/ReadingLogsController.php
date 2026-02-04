<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\ParentReadingLogService;
use App\Service\StudentReadingLogService;
use App\Service\TeacherReadingLogService;
use App\Service\TeacherRosterService;
use App\Support\AppException;
use App\Support\Auth;
use App\Support\Response;
use App\Support\Session;

class ReadingLogsController
{
    private ParentReadingLogService $parentLogs;
    private StudentReadingLogService $studentLogs;
    private TeacherReadingLogService $teacherLogs;
    private TeacherRosterService $roster;

    public function __construct(
        ParentReadingLogService $parentLogs,
        StudentReadingLogService $studentLogs,
        TeacherReadingLogService $teacherLogs,
        TeacherRosterService $roster
    ) {
        $this->parentLogs = $parentLogs;
        $this->studentLogs = $studentLogs;
        $this->teacherLogs = $teacherLogs;
        $this->roster = $roster;
    }

    public function list(Request $request): void
    {
        $teacherSession = Session::teacher();
        if ($teacherSession && !empty($teacherSession['teacher_username'])) {
            $childIdParam = $request->query['child_id'] ?? null;
            $childIds = $this->parseInList($childIdParam);
            if (count($childIds) === 0) {
                Response::error('VALIDATION_ERROR', 'child_id is required.', null, 422);
                return;
            }

            $rosterIds = $this->rosterIds($teacherSession['teacher_username']);
            foreach ($childIds as $childId) {
                if (!in_array($childId, $rosterIds, true)) {
                    Response::error('FORBIDDEN', 'Teacher cannot access these reading logs.', null, 403);
                    return;
                }
            }

            $rows = $this->teacherLogs->listBySponsorIds($childIds);
            $payload = array_map(static function (array $row): array {
                return [
                    'id' => $row['logId'],
                    'child_id' => $row['stSponsorId'],
                    'minutes' => (int) $row['minutes'],
                    'book_title' => $row['book_title'],
                    'logged_at' => $row['dateRead'],
                    'status' => $row['status'],
                ];
            }, $rows);

            Response::ok($payload);
            return;
        }

        $parentUserId = Auth::parentUserId($request);
        if ($parentUserId) {
            $childIdParam = $request->query['child_id'] ?? null;
            $childIds = $this->parseInList($childIdParam);
            if (count($childIds) === 0) {
                Response::error('VALIDATION_ERROR', 'child_id is required.', null, 422);
                return;
            }

            try {
                if (count($childIds) === 1) {
                    $rows = $this->parentLogs->listByChildId($parentUserId, $childIds[0]);
                } else {
                    $rows = $this->parentLogs->listByChildIds($parentUserId, $childIds);
                }
            } catch (AppException $e) {
                Response::error($e->codeName, $e->getMessage(), null, $e->status);
                return;
            }

            $payload = array_map(static function (array $row): array {
                return [
                    'id' => $row['logId'],
                    'child_id' => $row['stSponsorId'],
                    'minutes' => (int) $row['minutes'],
                    'book_title' => $row['book_title'],
                    'logged_at' => $row['dateRead'],
                    'status' => $row['status'],
                ];
            }, $rows);

            Response::ok($payload);
            return;
        }

        Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
    }

    public function create(Request $request): void
    {
        $teacherSession = Session::teacher();
        if ($teacherSession && !empty($teacherSession['teacher_username'])) {
            $childId = $request->body['child_id'] ?? null;
            if (!$childId) {
                Response::error('VALIDATION_ERROR', 'child_id is required.', null, 422);
                return;
            }

            $rosterIds = $this->rosterIds($teacherSession['teacher_username']);
            if (!in_array($childId, $rosterIds, true)) {
                Response::error('FORBIDDEN', 'Teacher cannot log reading for this student.', null, 403);
                return;
            }

            try {
                $created = $this->teacherLogs->create($childId, $request->body);
            } catch (\InvalidArgumentException $e) {
                Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
                return;
            }

            Response::ok([
                'id' => $created['logId'],
                'child_id' => $childId,
                'minutes' => (int) $created['minutes'],
                'book_title' => $created['book_title'],
                'logged_at' => $created['dateRead'],
                'status' => $created['status'],
            ], 201);
            return;
        }

        $studentSession = Session::student();
        if (!$studentSession || empty($studentSession['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            return;
        }

        try {
            $created = $this->studentLogs->create($studentSession['stSponsorId'], $request->body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        }

        Response::ok([
            'id' => $created['logId'],
            'minutes' => (int) $created['minutes'],
            'book_title' => $created['book_title'],
            'logged_at' => $created['dateRead'],
            'status' => $created['status'],
        ], 201);
    }

    public function createParent(Request $request): void
    {
        $parentUserId = Auth::parentUserId($request);
        if (!$parentUserId) {
            Response::error('UNAUTHORIZED', 'Parent session required.', null, 401);
            return;
        }

        try {
            $created = $this->parentLogs->create($parentUserId, $request->body);
        } catch (AppException $e) {
            Response::error($e->codeName, $e->getMessage(), null, $e->status);
            return;
        }

        Response::ok([
            'id' => $created['logId'],
            'child_id' => $created['stSponsorId'],
            'minutes' => (int) $created['minutes'],
            'book_title' => $created['book_title'],
            'logged_at' => $created['dateRead'],
            'status' => $created['status'],
        ], 201);
    }

    public function updateParent(Request $request, string $logId): void
    {
        $parentUserId = Auth::parentUserId($request);
        if (!$parentUserId) {
            Response::error('UNAUTHORIZED', 'Parent session required.', null, 401);
            return;
        }

        try {
            $updated = $this->parentLogs->update($parentUserId, $logId, $request->body);
        } catch (AppException $e) {
            Response::error($e->codeName, $e->getMessage(), null, $e->status);
            return;
        }

        Response::ok([
            'id' => $updated['logId'],
            'child_id' => $updated['stSponsorId'],
            'minutes' => (int) $updated['minutes'],
            'book_title' => $updated['book_title'],
            'logged_at' => $updated['dateRead'],
            'status' => $updated['status'],
        ]);
    }

    public function deleteParent(Request $request, string $logId): void
    {
        $parentUserId = Auth::parentUserId($request);
        if (!$parentUserId) {
            Response::error('UNAUTHORIZED', 'Parent session required.', null, 401);
            return;
        }

        try {
            $this->parentLogs->delete($parentUserId, $logId);
        } catch (AppException $e) {
            Response::error($e->codeName, $e->getMessage(), null, $e->status);
            return;
        }

        Response::ok(['success' => true]);
    }

    public function updateStudent(Request $request, string $logId): void
    {
        $studentSession = Session::student();
        if (!$studentSession || empty($studentSession['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            return;
        }

        try {
            $updated = $this->studentLogs->update($studentSession['stSponsorId'], $logId, $request->body);
        } catch (AppException $e) {
            Response::error($e->codeName, $e->getMessage(), null, $e->status);
            return;
        }

        Response::ok([
            'id' => $updated['logId'],
            'minutes' => (int) $updated['minutes'],
            'book_title' => $updated['book_title'],
            'logged_at' => $updated['dateRead'],
            'status' => $updated['status'],
        ]);
    }

    public function deleteStudent(Request $request, string $logId): void
    {
        $studentSession = Session::student();
        if (!$studentSession || empty($studentSession['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            return;
        }

        try {
            $this->studentLogs->delete($studentSession['stSponsorId'], $logId);
        } catch (AppException $e) {
            Response::error($e->codeName, $e->getMessage(), null, $e->status);
            return;
        }

        Response::ok(['success' => true]);
    }

    private function rosterIds(string $teacherUsername): array
    {
        $roster = $this->roster->listRoster($teacherUsername);
        return array_map(static fn(array $row): string => $row['id'], $roster);
    }

    private function parseInList(?string $value): array
    {
        if ($value === null || $value === '') {
            return [];
        }

        if (str_starts_with($value, 'in.(') && str_ends_with($value, ')')) {
            $inner = substr($value, 4, -1);
            if ($inner === '') {
                return [];
            }
            return array_values(array_filter(array_map('trim', explode(',', $inner))));
        }

        if (str_starts_with($value, 'eq.')) {
            return [substr($value, 3)];
        }

        return [$value];
    }
}
