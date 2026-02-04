<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\GuestPayTokenRepository;
use App\Repository\PledgeRepository;
use App\Support\Auth;
use App\Support\Response;

class AdminGuestPayTokensController
{
    private GuestPayTokenRepository $tokens;
    private PledgeRepository $pledges;

    public function __construct(GuestPayTokenRepository $tokens, PledgeRepository $pledges)
    {
        $this->tokens = $tokens;
        $this->pledges = $pledges;
    }

    public function create(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $pledgeId = isset($request->body['pledge_id']) ? (string) $request->body['pledge_id'] : '';
        $expiresAt = isset($request->body['expires_at']) ? (string) $request->body['expires_at'] : null;
        if ($pledgeId === '') {
            Response::error('VALIDATION_ERROR', 'pledge_id is required.', null, 422);
            return;
        }

        $pledge = $this->pledges->findByPledgeId($pledgeId);
        if (!$pledge) {
            Response::error('NOT_FOUND', 'Pledge not found.', null, 404);
            return;
        }

        if (((float) $pledge['paid']) >= (float) $pledge['amt']) {
            Response::error('CONFLICT', 'Pledge already paid.', null, 409);
            return;
        }

        if ($expiresAt === null || $expiresAt === '') {
            $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        }

        $token = bin2hex(random_bytes(32));
        $row = $this->tokens->createToken((int) $pledge['id'], $token, $expiresAt);

        $url = '/sponsor/guest-pay?token=' . $token;

        Response::ok([
            'token' => $row['token'],
            'pledge_id' => $pledge['pledgeId'],
            'expires_at' => $row['expires_at'],
            'url' => $url,
        ], 201);
    }
}
