<?php

namespace App\Repository;

use App\Support\Database;

class AdminReportsRepository
{
    public function listOutstandingPledges(int $limit = 5): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, pledgeId, spUserName, stSponsorId, amt, unit, paid, dateTime\n'
            . 'FROM pledges\n'
            . 'WHERE paid = 0\n'
            . 'ORDER BY dateTime DESC\n'
            . 'LIMIT :limit'
        );
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countOutstandingPledges(): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT COUNT(*) AS total FROM pledges WHERE paid = 0');
        $stmt->execute();
        $row = $stmt->fetch();
        return (int) ($row['total'] ?? 0);
    }

    public function listRecentPledges(int $limit = 10): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT spUserName, stSponsorId, amt, unit, dateTime\n'
            . 'FROM pledges\n'
            . 'ORDER BY dateTime DESC\n'
            . 'LIMIT :limit'
        );
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listStudentsForReport(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT stSponsorId, stFirstName, stLastName, grade, teacher, readingGoal\n'
            . 'FROM students\n'
            . 'ORDER BY stLastName, stFirstName'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listPledgesForReport(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT pledgeId, spUserName, stSponsorId, amt, unit, paid, dateTime\n'
            . 'FROM pledges\n'
            . 'ORDER BY dateTime DESC'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listPaymentsForReport(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, sponsor_id, email_cust, paid_amt, paid_date, pymt_status, receipt_link\n'
            . 'FROM payments\n'
            . 'ORDER BY paid_date DESC'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listFinanceForReport(?string $from, ?string $to): array
    {
        $pdo = Database::connection();
        $conditions = [];
        $params = [];

        if ($from) {
            $conditions[] = 'dateTime >= :from';
            $params['from'] = $from;
        }
        if ($to) {
            $conditions[] = 'dateTime <= :to';
            $params['to'] = $to;
        }

        $sql = 'SELECT pledgeId, spUserName, stSponsorId, amt, unit, paid, dateTime FROM pledges';
        if ($conditions) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        $sql .= ' ORDER BY dateTime DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function listChecksForReport(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, sponsor_id, email_cust, paid_amt, paid_date, pymt_status\n'
            . 'FROM payments\n'
            . 'ORDER BY paid_date DESC'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
