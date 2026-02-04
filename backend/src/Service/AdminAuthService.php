<?php

namespace App\Service;

use App\Repository\AdminRepository;

class AdminAuthService
{
    private AdminRepository $admins;

    public function __construct(AdminRepository $admins)
    {
        $this->admins = $admins;
    }

    public function login(string $email, string $password): ?array
    {
        $admin = $this->admins->findByEmail($email);
        if (!$admin) {
            return null;
        }

        $stored = (string) ($admin['password'] ?? '');
        if ($stored === '') {
            return null;
        }

        $matches = $stored === $password || password_verify($password, $stored);
        if (!$matches) {
            return null;
        }

        return $admin;
    }
}
