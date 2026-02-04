<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\PledgeRepository;
use App\Repository\PaymentRepository;
use App\Support\Auth;
use App\Support\Response;

class PaymentsAdminController
{
    private PaymentRepository $payments;
    private PledgeRepository $pledges;

    public function __construct(PaymentRepository $payments, PledgeRepository $pledges)
    {
        $this->payments = $payments;
        $this->pledges = $pledges;
    }

    public function list(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $limit = isset($request->query['limit']) ? (int) $request->query['limit'] : 100;
        $rows = $this->payments->listPayments($limit);
        $data = array_map(function (array $row) {
            return [
                'id' => (int) $row['id'],
                'amount' => (float) $row['paid_amt'],
                'payer_name' => $row['email_cust'],
                'status' => $row['pymt_status'],
                'paid_date' => $row['paid_date'],
                'receipt_link' => $row['receipt_link'],
            ];
        }, $rows);

        Response::ok($data);
    }

    public function create(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $pledgeId = trim((string) ($request->body['pledge_id'] ?? ''));
        $amount = (float) ($request->body['amount'] ?? 0);
        $payerName = trim((string) ($request->body['payer_name'] ?? ''));
        $paymentMethod = trim((string) ($request->body['payment_method'] ?? 'manual'));

        $errors = [];
        if ($pledgeId === '') {
            $errors['pledge_id'] = 'Pledge id required.';
        }
        if ($amount <= 0) {
            $errors['amount'] = 'Amount must be greater than 0.';
        }
        if ($errors) {
            Response::error('VALIDATION_ERROR', 'Invalid payment payload.', $errors, 422);
            return;
        }

        $pledge = $this->pledges->findByPledgeId($pledgeId);
        if (!$pledge && ctype_digit($pledgeId)) {
            $pledge = $this->pledges->findById((int) $pledgeId);
        }
        if (!$pledge) {
            Response::error('NOT_FOUND', 'Pledge not found.', null, 404);
            return;
        }

        $now = date('Y-m-d H:i:s');
        $paymentId = 'manual_' . bin2hex(random_bytes(6));

        $paymentRowId = $this->payments->createPayment([
            'sponsor_id' => $pledge['spUserName'] ?? null,
            'payment_id' => $paymentId,
            'order_id' => $paymentId,
            'order_date' => $now,
            'pledge_json' => json_encode([$pledge['pledgeId'] ?? $pledgeId]),
            'customer_id' => null,
            'email' => $payerName !== '' ? $payerName : ($pledge['sponsor_email'] ?? null),
            'paid_amt' => $amount,
            'paid_date' => $now,
            'status' => 'manual_' . $paymentMethod,
            'receipt_link' => null,
        ]);

        $this->payments->linkPaymentPledges($paymentRowId, [(int) $pledge['id']]);
        $this->pledges->updateByPledgeId($pledge['pledgeId'], [
            'paid' => $amount,
            'payment_id' => $paymentId,
        ]);

        Response::ok([
            'id' => $paymentRowId,
            'payment_id' => $paymentId,
        ], 201);
    }
}
