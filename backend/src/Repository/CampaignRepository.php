<?php

namespace App\Repository;

use App\Support\Database;

class CampaignRepository
{
    public function findActive(): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM campaigns WHERE is_active = 1 ORDER BY start_date DESC LIMIT 1');
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
