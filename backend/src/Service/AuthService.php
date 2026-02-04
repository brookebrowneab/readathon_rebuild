<?php

namespace App\Service;

use App\Repository\UserRepository;

class AuthService
{
    private UserRepository $users;

    public function __construct(UserRepository $users)
    {
        $this->users = $users;
    }

    public function authenticate(string $email, string $password): ?array
    {
        $user = $this->users->findByEmail($email);
        if (!$user) {
            return null;
        }

        $stored = (string) ($user['password'] ?? '');
        $valid = false;
        if (str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2')) {
            $valid = password_verify($password, $stored);
        } else {
            $valid = hash_equals($stored, $password);
        }

        if (!$valid) {
            return null;
        }

        return $user;
    }

    public function authenticateUsername(string $username, string $password): ?array
    {
        $user = $this->users->findByUsername($username);
        if (!$user) {
            return null;
        }

        $stored = (string) ($user['password'] ?? '');
        $valid = false;
        if (str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2')) {
            $valid = password_verify($password, $stored);
        } else {
            $valid = hash_equals($stored, $password);
        }

        if (!$valid) {
            return null;
        }

        return $user;
    }
}
