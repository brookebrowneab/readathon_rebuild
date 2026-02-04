<?php

namespace App\Support;

class Session
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function setStudent(array $data): void
    {
        $_SESSION['student'] = $data;
    }

    public static function student(): ?array
    {
        return $_SESSION['student'] ?? null;
    }

    public static function setParent(array $data): void
    {
        $_SESSION['parent'] = $data;
    }

    public static function parent(): ?array
    {
        return $_SESSION['parent'] ?? null;
    }

    public static function setTeacher(array $data): void
    {
        $_SESSION['teacher'] = $data;
    }

    public static function teacher(): ?array
    {
        return $_SESSION['teacher'] ?? null;
    }

    public static function setUser(array $data): void
    {
        $_SESSION['user'] = $data;
    }

    public static function user(): ?array
    {
        return $_SESSION['user'] ?? null;
    }

    public static function clear(): void
    {
        $_SESSION = [];
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
    }

    public static function setAdmin(array $data): void
    {
        $_SESSION['admin'] = $data;
    }

    public static function admin(): ?array
    {
        return $_SESSION['admin'] ?? null;
    }
}
