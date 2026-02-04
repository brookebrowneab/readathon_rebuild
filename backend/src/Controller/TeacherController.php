<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\TeacherRepository;
use App\Support\Response;
use App\Support\Session;

class TeacherController
{
    private TeacherRepository $teachers;

    public function __construct(TeacherRepository $teachers)
    {
        $this->teachers = $teachers;
    }

    public function list(Request $request): void
    {
        $userId = $this->parseEq($request->query['user_id'] ?? null);
        $teacherType = $this->parseEq($request->query['teacher_type'] ?? null);

        if ($userId !== null) {
            $session = Session::teacher();
            if (!$session || empty($session['teacher_username'])) {
                Response::error('UNAUTHORIZED', 'Teacher session required.', null, 401);
                return;
            }
            if ($userId !== $session['teacher_username']) {
                Response::error('FORBIDDEN', 'Teacher cannot access this profile.', null, 403);
                return;
            }
            $teacher = $this->teachers->findByUsername($userId);
            if (!$teacher) {
                Response::error('NOT_FOUND', 'Teacher not found.', null, 404);
                return;
            }

            Response::ok([
                'id' => (string) $teacher['id_table'],
                'name' => $teacher['teacherUserName'],
                'teacher_type' => ((int) $teacher['homeroom'] === 1) ? 'homeroom' : 'staff',
                'grade_level' => $teacher['grade'],
                'has_full_access' => false,
            ]);
            return;
        }

        if ($teacherType === 'homeroom') {
            $user = Session::user();
            if (!$user) {
                Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
                return;
            }
            if (($user['user_type'] ?? null) !== 'parent') {
                Response::error('FORBIDDEN', 'Parent access required.', null, 403);
                return;
            }
            $rows = $this->teachers->listHomeroomTeachers();
            $payload = array_map(static function (array $teacher): array {
                return [
                    'id' => (string) $teacher['id_table'],
                    'name' => $teacher['teacherUserName'],
                    'grade_level' => $teacher['grade'],
                ];
            }, $rows);
            Response::ok($payload);
            return;
        }

        Response::error('VALIDATION_ERROR', 'Unsupported teacher query.', null, 422);
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
