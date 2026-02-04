<?php

namespace App\Repository;

use App\Support\Database;

class StudentRepository
{
    public function findByUsername(string $username): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM students WHERE stUserName = :username LIMIT 1');
        $stmt->execute(['username' => $username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findBySponsorId(string $stSponsorId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM students WHERE stSponsorId = :id LIMIT 1');
        $stmt->execute(['id' => $stSponsorId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findPublicBySponsorId(string $stSponsorId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM students WHERE stSponsorId = :id AND share_public_link = 1 LIMIT 1');
        $stmt->execute(['id' => $stSponsorId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listPublicByFamilyUserId(int $familyUserId, ?bool $sharePublicLink = null): array
    {
        $pdo = Database::connection();
        $sql = 'SELECT * FROM students WHERE familyUserid = :familyUserId';
        $params = ['familyUserId' => $familyUserId];
        if ($sharePublicLink !== null) {
            $sql .= ' AND share_public_link = :sharePublicLink';
            $params['sharePublicLink'] = $sharePublicLink ? 1 : 0;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function listTotalsBySponsorIds(array $sponsorIds): array
    {
        if (count($sponsorIds) === 0) {
            return [];
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($sponsorIds), '?'));
        $stmt = $pdo->prepare(
            "SELECT stSponsorId, COALESCE(SUM(minutes), 0) AS total\n"
            . "FROM readingLog WHERE stSponsorId IN ({$placeholders}) GROUP BY stSponsorId"
        );
        $stmt->execute(array_values($sponsorIds));
        $rows = $stmt->fetchAll();
        $totals = [];
        foreach ($rows as $row) {
            $totals[$row['stSponsorId']] = (int) $row['total'];
        }
        return $totals;
    }

    public function getTotalMinutes(string $stSponsorId): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COALESCE(SUM(minutes), 0) AS total FROM readingLog WHERE stSponsorId = :id');
        $stmt->execute(['id' => $stSponsorId]);
        $row = $stmt->fetch();
        if (!$row) {
            return 0;
        }
        return (int) $row['total'];
    }

    public function listByFamilyUserId(int $familyUserId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT s.stSponsorId, s.stFirstName, s.stLastName, s.readingGoal, s.grade, s.teacher,
                    COALESCE(SUM(r.minutes), 0) AS total_minutes
             FROM students s
             LEFT JOIN readingLog r ON r.stSponsorId = s.stSponsorId
             WHERE s.familyUserid = :familyUserId
             GROUP BY s.stSponsorId, s.stFirstName, s.stLastName, s.readingGoal, s.grade, s.teacher
             ORDER BY s.stLastName ASC, s.stFirstName ASC'
        );
        $stmt->execute(['familyUserId' => $familyUserId]);
        return $stmt->fetchAll();
    }

    public function listSponsorIdsByFamilyUserId(int $familyUserId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT stSponsorId FROM students WHERE familyUserid = :familyUserId');
        $stmt->execute(['familyUserId' => $familyUserId]);
        $rows = $stmt->fetchAll();
        return array_map(static fn(array $row): string => $row['stSponsorId'], $rows);
    }

    public function findBySponsorIdAndFamilyUserId(string $stSponsorId, int $familyUserId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT * FROM students WHERE stSponsorId = :id AND familyUserid = :familyUserId LIMIT 1'
        );
        $stmt->execute([
            'id' => $stSponsorId,
            'familyUserId' => $familyUserId,
        ]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listByHomeroomTeacherUsername(string $teacherUsername): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT stSponsorId, stUserName, stFirstName, stLastName, readingGoal, grade, teacher
             FROM students
             WHERE homeroom_teacher_username = :username
             ORDER BY stLastName ASC, stFirstName ASC'
        );
        $stmt->execute(['username' => $teacherUsername]);
        return $stmt->fetchAll();
    }

    public function listBySponsorIds(array $sponsorIds): array
    {
        if (count($sponsorIds) === 0) {
            return [];
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($sponsorIds), '?'));
        $stmt = $pdo->prepare(
            "SELECT stSponsorId, stUserName, stFirstName, stLastName, readingGoal, grade, teacher
             FROM students
             WHERE stSponsorId IN ($placeholders)"
        );
        $stmt->execute(array_values($sponsorIds));
        return $stmt->fetchAll();
    }
}
