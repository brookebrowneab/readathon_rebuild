<?php

namespace App\Support;

use App\Http\Request;

class Auth
{
    public static function requireAdmin(): ?array
    {
        $admin = Session::admin();
        if (!$admin || empty($admin['id'])) {
            $hasSession = Session::user() || Session::student() || Session::teacher() || Session::parent();
            if ($hasSession) {
                Response::error('FORBIDDEN', 'Admin access required.', null, 403);
                return null;
            }
            Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
            return null;
        }

        return $admin;
    }

    public static function parentUserId(Request $request): ?int
    {
        $session = Session::parent();
        if ($session && isset($session['user_id'])) {
            return (int) $session['user_id'];
        }

        return null;
    }
}
