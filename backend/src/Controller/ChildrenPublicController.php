<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\StudentRepository;
use App\Support\Response;

class ChildrenPublicController
{
    private StudentRepository $students;

    public function __construct(StudentRepository $students)
    {
        $this->students = $students;
    }

    public function list(Request $request): void
    {
        $query = $request->query;
        $userId = $this->parseEqFilter($query['user_id'] ?? null);
        $sharePublic = $this->parseBoolFilter($query['share_public_link'] ?? null);
        $childId = $this->parseEqFilter($query['id'] ?? null);

        if ($childId !== null) {
            $student = $this->students->findPublicBySponsorId($childId);
            if (!$student) {
                Response::error('NOT_FOUND', 'Child not found.', null, 404);
                return;
            }
            $payload = $this->mapStudent($student, true);
            Response::ok($payload);
            return;
        }

        if ($userId === null || !is_numeric($userId)) {
            Response::error('VALIDATION_ERROR', 'user_id filter required.', null, 422);
            return;
        }

        $rows = $this->students->listPublicByFamilyUserId((int) $userId, $sharePublic);
        $sponsorIds = array_map(fn($row) => $row['stSponsorId'], $rows);
        $totals = $this->students->listTotalsBySponsorIds($sponsorIds);

        $payload = array_map(function (array $row) use ($totals): array {
            return $this->mapStudent($row, false, $totals[$row['stSponsorId']] ?? 0);
        }, $rows);

        Response::ok($payload);
    }

    private function mapStudent(array $row, bool $includeGoal, ?int $totalMinutes = null): array
    {
        $displayName = trim($row['stFirstName'] . ' ' . ($row['stLastName'] ? strtoupper(substr($row['stLastName'], 0, 1)) . '.' : ''));
        $total = $totalMinutes ?? $this->students->getTotalMinutes($row['stSponsorId']);
        $payload = [
            'id' => $row['stSponsorId'],
            'display_name' => $displayName,
            'grade_info' => $row['grade'],
            'total_minutes' => $total,
        ];
        if ($includeGoal) {
            $payload['goal_minutes'] = (int) $row['readingGoal'];
        }
        return $payload;
    }

    private function parseEqFilter(?string $value): ?string
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'eq.')) {
            return substr($value, 3);
        }
        return null;
    }

    private function parseBoolFilter(?string $value): ?bool
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'eq.')) {
            $raw = strtolower(substr($value, 3));
            if ($raw === 'true') {
                return true;
            }
            if ($raw === 'false') {
                return false;
            }
        }
        return null;
    }
}
