<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\StudentRepository;
use App\Service\TeacherRosterService;
use App\Support\Response;
use App\Support\Session;

class ChildrenController
{
    private TeacherRosterService $roster;
    private StudentRepository $students;

    public function __construct(TeacherRosterService $roster, StudentRepository $students)
    {
        $this->roster = $roster;
        $this->students = $students;
    }

    public function list(Request $request): void
    {
        $parentUserId = $this->parseEq($request->query['user_id'] ?? null);
        if ($parentUserId !== null) {
            $user = Session::user();
            if (!$user) {
                Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
                return;
            }
            if (($user['user_type'] ?? null) !== 'parent' || (string) $user['id'] !== (string) $parentUserId) {
                Response::error('FORBIDDEN', 'Parent access required.', null, 403);
                return;
            }

            $rows = $this->students->listByFamilyUserId((int) $parentUserId);
            $payload = array_map(static function (array $row): array {
                return [
                    'id' => $row['stSponsorId'],
                    'name' => trim($row['stFirstName'] . ' ' . $row['stLastName']),
                    'total_minutes' => (int) ($row['total_minutes'] ?? 0),
                    'goal_minutes' => (int) $row['readingGoal'],
                    'grade_info' => $row['grade'],
                    'class_name' => $row['teacher'],
                ];
            }, $rows);

            Response::ok($payload);
            return;
        }

        $session = Session::teacher();
        if (!$session || empty($session['teacher_username'])) {
            Response::error('UNAUTHORIZED', 'Teacher session required.', null, 401);
            return;
        }

        $teacherId = $this->parseEq($request->query['homeroom_teacher_id'] ?? null);
        if ($teacherId === null) {
            Response::error('VALIDATION_ERROR', 'homeroom_teacher_id is required.', null, 422);
            return;
        }

        if ($teacherId !== $session['teacher_username']) {
            Response::error('FORBIDDEN', 'Teacher cannot access this roster.', null, 403);
            return;
        }

        $payload = $this->roster->listRoster($session['teacher_username']);
        Response::ok($payload);
    }

    private function parseEq(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }
        if (str_starts_with($value, 'eq.')) {
            return substr($value, 3);
        }
        return $value;
    }
}
