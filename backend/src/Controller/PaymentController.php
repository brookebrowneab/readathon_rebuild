<?php

namespace App\Controller;

use App\Http\Request;
use App\Service\PaymentService;
use App\Support\Response;
use App\Support\Session;

class PaymentController
{
    private PaymentService $service;

    public function __construct(PaymentService $service)
    {
        $this->service = $service;
    }

    private function requireSponsor(): ?array
    {
        $user = Session::user();
        if (!$user) {
            Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
            return null;
        }
        if (($user['user_type'] ?? null) !== 'sponsor') {
            Response::error('FORBIDDEN', 'Sponsor access required.', null, 403);
            return null;
        }
        return $user;
    }

    public function processSquarePayment(Request $request): void
    {
        $body = $request->body;

        try {
            $user = $this->requireSponsor();
            if (!$user) {
                return;
            }
            $payload = $this->service->processSponsorCardPayment($user, $body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        } catch (\Throwable $e) {
            Response::error('INTERNAL', 'Payment failed.', null, 500);
            return;
        }

        Response::ok($payload);
    }

    public function notifyCheckPayment(Request $request): void
    {
        $body = $request->body;

        try {
            $user = $this->requireSponsor();
            if (!$user) {
                return;
            }
            $payload = $this->service->recordCheckPayment($user, $body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        } catch (\Throwable $e) {
            Response::error('INTERNAL', 'Payment failed.', null, 500);
            return;
        }

        Response::ok($payload);
    }
}
