<?php

namespace App\Service;

use App\Repository\ReadingLogRepository;
use App\Support\AppException;
use App\Support\Ids;

class StudentReadingLogService
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
            'enteredBy' => 'student',
            'status' => 'submitted',
        ];

        return $this->logs->create($data);
    }

    public function list(string $stSponsorId): array
    {
        return $this->logs->listBySponsorId($stSponsorId);
    }

    public function update(string $stSponsorId, string $logId, array $payload): array
    {
        $log = $this->logs->findById($logId);
        if (!$log) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }
        if ($log['stSponsorId'] !== $stSponsorId) {
            throw new AppException('FORBIDDEN', 'Not allowed to edit this reading log.', 403);
        }

        $fields = $this->buildUpdateFields($payload);
        if (!$fields) {
            throw new AppException('VALIDATION_ERROR', 'No valid fields to update.', 422);
        }

        $updated = $this->logs->update($logId, $fields);
        if (!$updated) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }

        return $updated;
    }

    public function delete(string $stSponsorId, string $logId): void
    {
        $log = $this->logs->findById($logId);
        if (!$log) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }
        if ($log['stSponsorId'] !== $stSponsorId) {
            throw new AppException('FORBIDDEN', 'Not allowed to delete this reading log.', 403);
        }

        $deleted = $this->logs->delete($logId);
        if (!$deleted) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }
    }

    private function buildUpdateFields(array $payload): array
    {
        $fields = [];

        if (array_key_exists('minutes', $payload)) {
            $minutes = (int) $payload['minutes'];
            if ($minutes <= 0) {
                throw new AppException('VALIDATION_ERROR', 'Minutes must be greater than zero.', 422);
            }
            $fields['minutes'] = $minutes;
        }

        if (array_key_exists('book_title', $payload)) {
            $bookTitle = $payload['book_title'];
            if ($bookTitle !== null) {
                $bookTitle = trim((string) $bookTitle);
                if ($bookTitle === '') {
                    $bookTitle = null;
                }
                if ($bookTitle !== null && strlen($bookTitle) > 200) {
                    throw new AppException('VALIDATION_ERROR', 'Book title must be 200 characters or less.', 422);
                }
            }
            $fields['book_title'] = $bookTitle;
        }

        if (array_key_exists('logged_at', $payload)) {
            $fields['dateRead'] = $this->normalizeLoggedAt($payload['logged_at']);
        }

        return $fields;
    }

    private function normalizeLoggedAt($value): string
    {
        if ($value === null || $value === '') {
            return date('Y-m-d');
        }

        $timestamp = strtotime((string) $value);
        if ($timestamp === false) {
            throw new AppException('VALIDATION_ERROR', 'Invalid logged_at date.', 422);
        }

        return date('Y-m-d', $timestamp);
    }
}
