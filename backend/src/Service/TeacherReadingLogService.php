<?php

namespace App\Service;

use App\Repository\ReadingLogRepository;
use App\Support\Ids;

class TeacherReadingLogService
{
    private ReadingLogRepository $logs;

    public function __construct(ReadingLogRepository $logs)
    {
        $this->logs = $logs;
    }

    public function create(string $stSponsorId, array $payload): array
    {
        $minutes = (int) ($payload['minutes'] ?? 0);
        if ($minutes <= 0) {
            throw new \InvalidArgumentException('Minutes must be greater than zero.');
        }

        $bookTitle = $payload['book_title'] ?? null;
        if ($bookTitle !== null) {
            $bookTitle = trim((string) $bookTitle);
            if ($bookTitle === '') {
                $bookTitle = null;
            }
        }

        $loggedAt = $payload['logged_at'] ?? null;
        $dateRead = date('Y-m-d');
        if ($loggedAt) {
            $timestamp = strtotime($loggedAt);
            if ($timestamp !== false) {
                $dateRead = date('Y-m-d', $timestamp);
            }
        }

        $data = [
            'logId' => Ids::uuid(),
            'minutes' => $minutes,
            'book_title' => $bookTitle,
            'dateRead' => $dateRead,
            'stSponsorId' => $stSponsorId,
            'enteredBy' => 'teacher',
            'status' => 'submitted',
        ];

        return $this->logs->create($data);
    }

    public function listBySponsorIds(array $sponsorIds): array
    {
        return $this->logs->listBySponsorIds($sponsorIds);
    }
}
