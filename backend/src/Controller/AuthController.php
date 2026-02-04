<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\AuthService;
use App\Support\Response;
use App\Support\Session;

class AuthController
{
    private AuthService $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    public function login(Request $request): void
    {
        $email = isset($request->body['email']) ? trim((string) $request->body['email']) : '';
        $password = isset($request->body['password']) ? (string) $request->body['password'] : '';

        if ($email === '' || $password === '') {
            Response::error('VALIDATION_ERROR', 'Email and password are required.', null, 422);
            return;
        }

        $user = $this->service->authenticate($email, $password);
        if (!$user) {
            Response::error('UNAUTHORIZED', 'Invalid login credentials.', null, 401);
            return;
        }

        Session::setUser([
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'user_type' => $user['user_type'],
            'display_name' => $user['display_name'],
            'phone' => $user['phone'],
        ]);

        if (($user['user_type'] ?? null) === 'teacher') {
            Session::setTeacher([
                'teacher_username' => $user['username'],
            ]);
        }

        Response::ok([
            'user' => [
                'id' => (string) $user['id'],
                'email' => $user['email'],
                'display_name' => $user['display_name'],
                'user_type' => $user['user_type'],
                'username' => $user['username'],
            ],
        ]);
    }

    public function parentLogin(Request $request): void
    {
        $username = isset($request->body['username']) ? trim((string) $request->body['username']) : '';
        $password = isset($request->body['password']) ? (string) $request->body['password'] : '';

        if ($username === '' || $password === '') {
            Response::error('VALIDATION_ERROR', 'Username and password are required.', null, 422);
            return;
        }

        $user = $this->service->authenticateUsername($username, $password);
        if (!$user) {
            Response::error('UNAUTHORIZED', 'Invalid login credentials.', null, 401);
            return;
        }

        if (($user['user_type'] ?? null) !== 'parent') {
            Response::error('FORBIDDEN', 'Parent access required.', null, 403);
            return;
        }

        Session::setParent([
            'user_id' => (int) $user['id'],
            'username' => $user['username'],
        ]);

        Session::setUser([
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'user_type' => $user['user_type'],
            'display_name' => $user['display_name'],
            'phone' => $user['phone'],
        ]);

        Response::ok([
            'user' => [
                'id' => (string) $user['id'],
                'email' => $user['email'],
                'display_name' => $user['display_name'],
                'user_type' => $user['user_type'],
                'username' => $user['username'],
            ],
        ]);
    }

    public function logout(): void
    {
        Session::clear();
        Response::ok(['success' => true]);
    }
}
