<?php

namespace App\Support;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection) {
            return self::$connection;
        }

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $name = getenv('DB_NAME') ?: '';
        $user = getenv('DB_USER') ?: '';
        $pass = getenv('DB_PASS') ?: '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host={$host};dbname={$name};charset={$charset}";

        try {
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            throw $e;
        }

        self::$connection = $pdo;
        return $pdo;
    }
}
