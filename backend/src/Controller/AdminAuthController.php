<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\AdminAuthService;
use App\Support\Response;
use App\Support\Session;

class AdminAuthController
{
    private AdminAuthService $service;

    public function __construct(AdminAuthService $service)
    {
        $this->service = $service;
    }

    public function login(Request $request): void
    {
        $email = trim((string) ($request->body['email'] ?? ''));
        $password = (string) ($request->body['password'] ?? '');

        $errors = [];
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Valid email required.';
        }
        if ($password === '' || strlen($password) < 4) {
            $errors['password'] = 'Password must be at least 4 characters.';
        }

        if ($errors) {
            Response::error('VALIDATION_ERROR', 'Invalid login payload.', $errors, 422);
            return;
        }

        $admin = $this->service->login($email, $password);
        if (!$admin) {
            Response::error('UNAUTHORIZED', 'Invalid login credentials.', null, 401);
            return;
        }

        Session::setAdmin([
            'id' => (int) $admin['id'],
            'email' => $admin['email'],
            'username' => $admin['username'],
        ]);

        Response::ok([
            'success' => true,
            'admin' => [
                'id' => (int) $admin['id'],
                'email' => $admin['email'],
                'username' => $admin['username'],
            ],
        ]);
    }
}
