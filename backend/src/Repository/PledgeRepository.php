<?php

namespace App\Repository;

use App\Support\Database;

class PledgeRepository
{
    public function create(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO pledges (pledgeId, spUserName, stSponsorId, amt, unit, pledge_type, rate_per_minute, flat_amount, sponsor_display_name, sponsor_email, sponsor_phone) '
            . 'VALUES (:pledgeId, :spUserName, :stSponsorId, :amt, :unit, :pledgeType, :ratePerMinute, :flatAmount, :displayName, :email, :phone)'
        );
        $stmt->execute([
            'pledgeId' => $data['pledgeId'],
            'spUserName' => $data['spUserName'],
            'stSponsorId' => $data['stSponsorId'],
            'amt' => $data['amt'],
            'unit' => $data['unit'],
            'pledgeType' => $data['pledge_type'],
            'ratePerMinute' => $data['rate_per_minute'],
            'flatAmount' => $data['flat_amount'],
            'displayName' => $data['sponsor_display_name'],
            'email' => $data['sponsor_email'],
            'phone' => $data['sponsor_phone'],
        ]);

        $id = (int) $pdo->lastInsertId();
        return $this->findById($id) ?? [];
    }

    public function findById(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM pledges WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByPledgeId(string $pledgeId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM pledges WHERE pledgeId = :pledgeId LIMIT 1');
        $stmt->execute(['pledgeId' => $pledgeId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByPledgeIds(array $pledgeIds): array
    {
        if (count($pledgeIds) === 0) {
            return [];
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($pledgeIds), '?'));
        $stmt = $pdo->prepare("SELECT * FROM pledges WHERE pledgeId IN ({$placeholders})");
        $stmt->execute(array_values($pledgeIds));
        return $stmt->fetchAll();
    }

    public function updateByPledgeId(string $pledgeId, array $fields): ?array
    {
        $pdo = Database::connection();
        $columns = [];
        $params = ['pledgeId' => $pledgeId];
        foreach ($fields as $key => $value) {
            $columns[] = "{$key} = :{$key}";
            $params[$key] = $value;
        }
        if (empty($columns)) {
            return $this->findByPledgeId($pledgeId);
        }

        $sql = 'UPDATE pledges SET ' . implode(', ', $columns) . ' WHERE pledgeId = :pledgeId';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $this->findByPledgeId($pledgeId);
    }

    public function deleteByPledgeId(string $pledgeId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM pledges WHERE pledgeId = :pledgeId');
        $stmt->execute(['pledgeId' => $pledgeId]);
        return $stmt->rowCount() > 0;
    }

    public function listBySponsor(string $sponsorUsername, ?bool $isPaid = null): array
    {
        $pdo = Database::connection();
        $sql = 'SELECT * FROM pledges WHERE spUserName = :sponsor';
        $params = ['sponsor' => $sponsorUsername];
        if ($isPaid !== null) {
            if ($isPaid) {
                $sql .= ' AND paid >= amt';
            } else {
                $sql .= ' AND paid < amt';
            }
        }
        $sql .= ' ORDER BY dateTime DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function listByChildIds(array $childIds): array
    {
        if (count($childIds) === 0) {
            return [];
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($childIds), '?'));
        $stmt = $pdo->prepare("SELECT * FROM pledges WHERE stSponsorId IN ({$placeholders})");
        $stmt->execute(array_values($childIds));
        return $stmt->fetchAll();
    }

    public function markPaidByIds(array $pledgeIds, float $amount): void
    {
        if (count($pledgeIds) === 0) {
            return;
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($pledgeIds), '?'));
        $sql = "UPDATE pledges SET paid = ?, payment_id = ? WHERE pledgeId IN ({$placeholders})";
        $paymentId = bin2hex(random_bytes(12));
        $params = array_merge([$amount, $paymentId], array_values($pledgeIds));
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }
}
