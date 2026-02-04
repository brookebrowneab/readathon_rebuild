<?php

namespace App\Repository;

use App\Support\Database;

class GuestPayTokenRepository
{
    public function createToken(int $pledgeId, string $token, ?string $expiresAt): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO guest_pay_tokens (pledge_id, token, expires_at) VALUES (:pledgeId, :token, :expiresAt)'
        );
        $stmt->execute([
            'pledgeId' => $pledgeId,
            'token' => $token,
            'expiresAt' => $expiresAt,
        ]);

        $id = (int) $pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM guest_pay_tokens WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: [];
    }

    public function findValidToken(string $token): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT * FROM guest_pay_tokens '
            . 'WHERE token = :token '
            . 'AND (expires_at IS NULL OR expires_at > NOW()) '
            . 'AND used_at IS NULL '
            . 'LIMIT 1'
        );
        $stmt->execute(['token' => $token]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function markUsed(int $id): void
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE guest_pay_tokens SET used_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }
}
