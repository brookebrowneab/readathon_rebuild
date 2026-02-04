<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\TeacherRepository;
use App\Support\Auth;
use App\Support\Response;

class TeachersAdminController
{
    private TeacherRepository $teachers;

    public function __construct(TeacherRepository $teachers)
    {
        $this->teachers = $teachers;
    }

    public function list(): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $rows = $this->teachers->listAll();
        $payload = array_map([$this, 'mapTeacher'], $rows);
        Response::ok($payload);
    }

    public function create(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $name = trim((string) ($request->body['name'] ?? ''));
        $email = trim((string) ($request->body['email'] ?? ''));
        $teacherType = trim((string) ($request->body['teacher_type'] ?? 'homeroom'));
        $gradeLevel = trim((string) ($request->body['grade_level'] ?? ''));

        $errors = [];
        if ($name === '') {
            $errors['name'] = 'Name required.';
        }
        if ($email === '') {
            $errors['email'] = 'Email required.';
        }
        if ($gradeLevel === '') {
            $errors['grade_level'] = 'Grade level required.';
        }
        if ($errors) {
            Response::error('VALIDATION_ERROR', 'Invalid teacher payload.', $errors, 422);
            return;
        }

        $row = $this->teachers->create([
            'name' => $name,
            'email' => $email,
            'grade' => $gradeLevel,
            'homeroom' => $teacherType === 'homeroom' ? 1 : 0,
        ]);

        Response::ok($this->mapTeacher($row), 201);
    }

    public function update(Request $request, int $id): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $fields = [];
        if (isset($request->body['name'])) {
            $fields['teacherUserName'] = trim((string) $request->body['name']);
        }
        if (isset($request->body['email'])) {
            $fields['defaultVal'] = trim((string) $request->body['email']);
        }
        if (isset($request->body['grade_level'])) {
            $fields['grade'] = trim((string) $request->body['grade_level']);
        }
        if (isset($request->body['teacher_type'])) {
            $fields['homeroom'] = $request->body['teacher_type'] === 'homeroom' ? 1 : 0;
        }

        $row = $this->teachers->update($id, $fields);
        if (!$row) {
            Response::error('NOT_FOUND', 'Teacher not found.', null, 404);
            return;
        }

        Response::ok($this->mapTeacher($row));
    }

    public function delete(int $id): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $deleted = $this->teachers->delete($id);
        if (!$deleted) {
            Response::error('NOT_FOUND', 'Teacher not found.', null, 404);
            return;
        }

        Response::ok(['success' => true]);
    }

    private function mapTeacher(array $row): array
    {
        return [
            'id' => (int) $row['id_table'],
            'name' => $row['teacherUserName'],
            'email' => $row['defaultVal'],
            'teacher_type' => ((int) $row['homeroom']) === 1 ? 'homeroom' : 'staff',
            'grade_level' => $row['grade'],
            'is_active' => true,
        ];
    }
}
