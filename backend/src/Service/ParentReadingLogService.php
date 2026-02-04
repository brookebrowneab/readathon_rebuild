<?php

namespace App\Service;

use App\Repository\ReadingLogRepository;
use App\Repository\StudentRepository;
use App\Support\AppException;
use App\Support\Ids;

class ParentReadingLogService
{
    private ReadingLogRepository $logs;
    private StudentRepository $students;

    public function __construct(ReadingLogRepository $logs, StudentRepository $students)
    {
        $this->logs = $logs;
        $this->students = $students;
    }

    public function listByChildIds(int $familyUserId, array $childIds): array
    {
        if (count($childIds) === 0) {
            return [];
        }

        $allowedIds = $this->students->listSponsorIdsByFamilyUserId($familyUserId);
        $missing = array_diff($childIds, $allowedIds);
        if ($missing) {
            throw new AppException('FORBIDDEN', 'Not allowed to view one or more children.', 403);
        }

        return $this->logs->listBySponsorIds($childIds);
    }

    public function listByChildId(int $familyUserId, string $childId): array
    {
        $child = $this->students->findBySponsorIdAndFamilyUserId($childId, $familyUserId);
        if (!$child) {
            throw new AppException('FORBIDDEN', 'Not allowed to view this child.', 403);
        }

        return $this->logs->listBySponsorId($childId);
    }

    public function create(int $familyUserId, array $payload): array
    {
        $childId = trim((string) ($payload['child_id'] ?? ''));
        if ($childId === '') {
            throw new AppException('VALIDATION_ERROR', 'child_id is required.', 422);
        }

        $child = $this->students->findBySponsorIdAndFamilyUserId($childId, $familyUserId);
        if (!$child) {
            throw new AppException('FORBIDDEN', 'Not allowed to log reading for this child.', 403);
        }

        $minutes = (int) ($payload['minutes'] ?? 0);
        if ($minutes <= 0) {
            throw new AppException('VALIDATION_ERROR', 'Minutes must be greater than zero.', 422);
        }

        $bookTitle = $payload['book_title'] ?? null;
        if ($bookTitle !== null) {
            $bookTitle = trim((string) $bookTitle);
            if ($bookTitle === '') {
                $bookTitle = null;
            }
            if ($bookTitle !== null && strlen($bookTitle) > 200) {
                throw new AppException('VALIDATION_ERROR', 'Book title must be 200 characters or less.', 422);
            }
        }

        $dateRead = $this->normalizeLoggedAt($payload['logged_at'] ?? null);
        $enteredBy = (string) ($child['familyUserName'] ?? '');
        if ($enteredBy === '') {
            $enteredBy = 'parent';
        }

        $data = [
            'logId' => Ids::uuid(),
            'minutes' => $minutes,
            'book_title' => $bookTitle,
            'dateRead' => $dateRead,
            'stSponsorId' => $childId,
            'enteredBy' => $enteredBy,
            'status' => 'submitted',
        ];

        return $this->logs->create($data);
    }

    public function update(int $familyUserId, string $logId, array $payload): array
    {
        $log = $this->logs->findById($logId);
        if (!$log) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }

        $child = $this->students->findBySponsorIdAndFamilyUserId($log['stSponsorId'], $familyUserId);
        if (!$child) {
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

    public function delete(int $familyUserId, string $logId): void
    {
        $log = $this->logs->findById($logId);
        if (!$log) {
            throw new AppException('NOT_FOUND', 'Reading log not found.', 404);
        }

        $child = $this->students->findBySponsorIdAndFamilyUserId($log['stSponsorId'], $familyUserId);
        if (!$child) {
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
