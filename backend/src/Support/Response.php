<?php

namespace App\Support;

class Response
{
    public static function json(int $status, array $payload): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
    }

    public static function ok($data, int $status = 200): void
    {
        self::json($status, [
            'ok' => true,
            'data' => $data,
        ]);
    }

    public static function error(string $code, string $message, $details = null, int $status = 400): void
    {
        $error = [
            'code' => $code,
            'message' => $message,
        ];
        if ($details !== null) {
            $error['details'] = $details;
        }

        self::json($status, [
            'ok' => false,
            'error' => $error,
        ]);
    }
}
