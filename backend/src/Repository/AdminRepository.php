<?php

namespace App\Repository;

use App\Support\Database;

class AdminRepository
{
    public function findByEmail(string $email): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM admin WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
