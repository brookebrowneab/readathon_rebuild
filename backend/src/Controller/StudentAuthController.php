<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\StudentAuthService;
use App\Support\Response;
use App\Support\Session;

class StudentAuthController
{
    private StudentAuthService $service;

    public function __construct(StudentAuthService $service)
    {
        $this->service = $service;
    }

    public function login(Request $request): void
    {
        $username = trim((string) ($request->body['username'] ?? ''));
        $password = (string) ($request->body['password'] ?? '');

        $errors = [];
        if ($username === '' || strlen($username) < 3) {
            $errors['username'] = 'Username must be at least 3 characters.';
        }
        if ($password === '' || strlen($password) < 4) {
            $errors['password'] = 'Password must be at least 4 characters.';
        }

        if ($errors) {
            Response::error('VALIDATION_ERROR', 'Invalid login payload.', $errors, 422);
            return;
        }

        $result = $this->service->login($username, $password);
        if (!$result) {
            Response::error('UNAUTHORIZED', 'Login failed.', null, 401);
            return;
        }

        $student = $result['student'];
        Session::setStudent([
            'stSponsorId' => $student['stSponsorId'],
            'student_public_id' => $student['student_public_id'] ?? null,
            'stUserName' => $student['stUserName'],
        ]);

        $payload = [
            'success' => true,
            'child' => [
                'id' => $student['stSponsorId'],
                'name' => trim($student['stFirstName'] . ' ' . $student['stLastName']),
                'total_minutes' => $result['total_minutes'],
                'goal_minutes' => (int) $student['readingGoal'],
                'grade_info' => $student['grade'],
                'class_name' => $student['teacher'],
            ],
        ];

        Response::ok($payload);
    }

    public function me(Request $request): void
    {
        $session = Session::student();
        if (!$session || empty($session['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            return;
        }

        $result = $this->service->getStudentSummary($session['stSponsorId']);
        if (!$result) {
            Response::error('NOT_FOUND', 'Student not found.', null, 404);
            return;
        }

        $student = $result['student'];
        $payload = [
            'id' => $student['stSponsorId'],
            'name' => trim($student['stFirstName'] . ' ' . $student['stLastName']),
            'total_minutes' => $result['total_minutes'],
            'goal_minutes' => (int) $student['readingGoal'],
        ];

        Response::ok($payload);
    }
}
