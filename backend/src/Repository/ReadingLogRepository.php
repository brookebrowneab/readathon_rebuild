<?php

namespace App\Repository;

use App\Support\Database;

class ReadingLogRepository
{
    public function create(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO readingLog (logId, minutes, book_title, dateRead, stSponsorId, enteredBy, status)
             VALUES (:logId, :minutes, :book_title, :dateRead, :stSponsorId, :enteredBy, :status)'
        );

        $stmt->execute([
            'logId' => $data['logId'],
            'minutes' => $data['minutes'],
            'book_title' => $data['book_title'],
            'dateRead' => $data['dateRead'],
            'stSponsorId' => $data['stSponsorId'],
            'enteredBy' => $data['enteredBy'],
            'status' => $data['status'],
        ]);

        return $data;
    }

    public function listBySponsorId(string $stSponsorId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT logId, minutes, book_title, dateRead, status
             FROM readingLog
             WHERE stSponsorId = :id
             ORDER BY dateRead DESC, dateEntered DESC'
        );
        $stmt->execute(['id' => $stSponsorId]);
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
            "SELECT logId, minutes, book_title, dateRead, status, stSponsorId
             FROM readingLog
             WHERE stSponsorId IN ({$placeholders})
             ORDER BY dateRead DESC, dateEntered DESC"
        );
        $stmt->execute(array_values($sponsorIds));
        return $stmt->fetchAll();
    }

    public function findById(string $logId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT logId, minutes, book_title, dateRead, status, stSponsorId
             FROM readingLog
             WHERE logId = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $logId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function update(string $logId, array $fields): ?array
    {
        if (!$fields) {
            return $this->findById($logId);
        }

        $pdo = Database::connection();
        $setParts = [];
        $params = [];

        foreach ($fields as $key => $value) {
            $setParts[] = "{$key} = :{$key}";
            $params[$key] = $value;
        }
        $params['logId'] = $logId;

        $setClause = implode(', ', $setParts);
        $stmt = $pdo->prepare("UPDATE readingLog SET {$setClause} WHERE logId = :logId");
        $stmt->execute($params);

        return $this->findById($logId);
    }

    public function delete(string $logId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM readingLog WHERE logId = :id');
        $stmt->execute(['id' => $logId]);
        return $stmt->rowCount() > 0;
    }
}
