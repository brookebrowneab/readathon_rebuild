<?php

namespace App\Repository;

use App\Support\Database;

class AdminMetricsRepository
{
    public function countStudents(): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COUNT(*) AS total FROM students');
        $stmt->execute();
        $row = $stmt->fetch();
        return (int) ($row['total'] ?? 0);
    }

    public function sumMinutes(): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COALESCE(SUM(minutes), 0) AS total FROM readingLog');
        $stmt->execute();
        $row = $stmt->fetch();
        return (int) ($row['total'] ?? 0);
    }

    public function sumPledged(): float
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COALESCE(SUM(amt), 0) AS total FROM pledges');
        $stmt->execute();
        $row = $stmt->fetch();
        return (float) ($row['total'] ?? 0);
    }

    public function sumCollected(): float
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COALESCE(SUM(paid_amt), 0) AS total FROM payments');
        $stmt->execute();
        $row = $stmt->fetch();
        return (float) ($row['total'] ?? 0);
    }
}
