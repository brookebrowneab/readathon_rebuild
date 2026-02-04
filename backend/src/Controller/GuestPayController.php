<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\PledgeRepository;
use App\Repository\StudentRepository;
use App\Repository\GuestPayTokenRepository;
use App\Service\PaymentService;
use App\Support\Response;

class GuestPayController
{
    private PledgeRepository $pledges;
    private StudentRepository $students;
    private GuestPayTokenRepository $tokens;
    private PaymentService $payments;

    public function __construct(
        PledgeRepository $pledges,
        StudentRepository $students,
        GuestPayTokenRepository $tokens,
        PaymentService $payments
    )
    {
        $this->pledges = $pledges;
        $this->students = $students;
        $this->tokens = $tokens;
        $this->payments = $payments;
    }

    public function show(Request $request, string $token): void
    {
        $tokenRow = $this->tokens->findValidToken($token);
        if (!$tokenRow) {
            Response::error('NOT_FOUND', 'Payment link not available.', null, 404);
            return;
        }
        $pledge = $this->pledges->findById((int) $tokenRow['pledge_id']);
        if (!$pledge || ((float) $pledge['paid']) >= (float) $pledge['amt']) {
            Response::error('NOT_FOUND', 'Payment link not available.', null, 404);
            return;
        }

        $student = $this->students->findBySponsorId($pledge['stSponsorId']);
        $payload = [
            'amount' => (float) $pledge['amt'],
            'student_name' => $student ? trim($student['stFirstName'] . ' ' . $student['stLastName']) : null,
        ];

        Response::ok($payload);
    }

    public function checkout(Request $request, string $token): void
    {
        $method = isset($request->body['payment_method']) ? (string) $request->body['payment_method'] : 'card';
        if ($method !== 'card') {
            Response::error('VALIDATION_ERROR', 'Card payments only.', null, 422);
            return;
        }

        $tokenRow = $this->tokens->findValidToken($token);
        if (!$tokenRow) {
            Response::error('NOT_FOUND', 'Payment link not available.', null, 404);
            return;
        }

        $pledge = $this->pledges->findById((int) $tokenRow['pledge_id']);
        if (!$pledge || ((float) $pledge['paid']) >= (float) $pledge['amt']) {
            Response::error('NOT_FOUND', 'Payment link not available.', null, 404);
            return;
        }

        try {
            $payload = $this->payments->createGuestCheckout($pledge, $request->body);
            $this->tokens->markUsed((int) $tokenRow['id']);
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
