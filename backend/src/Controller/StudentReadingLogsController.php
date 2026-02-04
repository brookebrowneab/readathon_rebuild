<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\StudentReadingLogService;
use App\Support\Response;
use App\Support\Session;

class StudentReadingLogsController
{
    private StudentReadingLogService $service;

    public function __construct(StudentReadingLogService $service)
    {
        $this->service = $service;
    }

    private function requireStudentSession(): ?string
    {
        $session = Session::student();
        if (!$session || empty($session['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            return null;
        }

        return $session['stSponsorId'];
    }

    public function list(Request $request): void
    {
        $stSponsorId = $this->requireStudentSession();
        if (!$stSponsorId) {
            return;
        }

        $rows = $this->service->list($stSponsorId);
        $payload = array_map(function (array $row): array {
            return [
                'id' => $row['logId'],
                'minutes' => (int) $row['minutes'],
                'book_title' => $row['book_title'],
                'logged_at' => $row['dateRead'],
                'status' => $row['status'],
            ];
        }, $rows);

        Response::ok($payload);
    }

    public function create(Request $request): void
    {
        $stSponsorId = $this->requireStudentSession();
        if (!$stSponsorId) {
            return;
        }

        $payloadChildId = $request->body['child_id'] ?? null;
        if ($payloadChildId !== null) {
            $payloadChildId = trim((string) $payloadChildId);
            if ($payloadChildId !== '' && $payloadChildId !== $stSponsorId) {
                Response::error('FORBIDDEN', 'Cannot log reading for another student.', null, 403);
                return;
            }
        }

        try {
            $created = $this->service->create($stSponsorId, $request->body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        }

        $payload = [
            'id' => $created['logId'],
            'minutes' => (int) $created['minutes'],
            'book_title' => $created['book_title'],
            'logged_at' => $created['dateRead'],
            'status' => $created['status'],
        ];

        Response::ok($payload, 201);
    }
}
