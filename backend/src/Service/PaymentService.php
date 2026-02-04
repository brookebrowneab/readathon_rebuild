<?php

namespace App\Service;

use App\Repository\PaymentRepository;
use App\Repository\PledgeRepository;
use App\Support\Database;
use App\Support\Ids;

class PaymentService
{
    private PaymentRepository $payments;
    private PledgeRepository $pledges;

    public function __construct(PaymentRepository $payments, PledgeRepository $pledges)
    {
        $this->payments = $payments;
        $this->pledges = $pledges;
    }

    public function processSponsorCardPayment(array $sponsor, array $payload): array
    {
        $pledgeIds = $payload['pledgeIds'] ?? [];
        $amount = $payload['amount'] ?? null;
        $payerName = $payload['payerName'] ?? $sponsor['display_name'] ?? 'Sponsor';
        $payerEmail = $payload['payerEmail'] ?? $sponsor['email'] ?? null;
        $sourceId = $payload['sourceId'] ?? null;

        $this->validatePaymentPayload($pledgeIds, $amount, $payerName, $payerEmail, $sourceId);

        $pledges = $this->pledges->findByPledgeIds($pledgeIds);
        $this->ensureSponsorOwnsPledges($sponsor['username'], $pledges, $pledgeIds);

        $total = $this->sumPledgeAmounts($pledges);
        $this->ensureAmountMatches($amount, $total);

        $receipt = 'https://receipts.example/' . Ids::uuid();
        $paymentId = Ids::uuid();

        $this->recordPayment($sponsor['username'], $payerEmail, $pledges, (float) $amount, 'paid', $receipt, $paymentId);

        return [
            'success' => true,
            'receiptUrl' => $receipt,
        ];
    }

    public function recordCheckPayment(array $sponsor, array $payload): array
    {
        $pledgeIds = $payload['pledgeIds'] ?? [];
        $amount = $payload['amount'] ?? null;
        $payerName = $payload['payerName'] ?? null;

        $payerEmail = $payload['payerEmail'] ?? null;
        if (!is_array($pledgeIds) || count($pledgeIds) === 0 || !is_numeric($amount) || !$payerName) {
            throw new \InvalidArgumentException('pledgeIds, amount, and payerName are required.');
        }

        $pledges = $this->pledges->findByPledgeIds($pledgeIds);
        $this->ensureSponsorOwnsPledges($sponsor['username'], $pledges, $pledgeIds);

        $total = $this->sumPledgeAmounts($pledges);
        $this->ensureAmountMatches($amount, $total);

        $paymentId = Ids::uuid();
        $this->recordPayment($sponsor['username'], $payerEmail ?? $sponsor['email'], $pledges, (float) $amount, 'check_pending', null, $paymentId);

        return [
            'success' => true,
        ];
    }

    public function createGuestCheckout(array $pledge, array $payload): array
    {
        $amount = $payload['amount'] ?? null;
        $payerName = $payload['payerName'] ?? null;
        $payerEmail = $payload['payerEmail'] ?? null;
        $sourceId = $payload['sourceId'] ?? null;

        if (!is_numeric($amount) || !$payerName || !$payerEmail || !$sourceId) {
            throw new \InvalidArgumentException('amount, payerName, payerEmail, and sourceId are required.');
        }

        $this->ensureAmountMatches($amount, (float) $pledge['amt']);

        $checkoutUrl = 'https://checkout.example/' . Ids::uuid();

        return [
            'success' => true,
            'checkoutUrl' => $checkoutUrl,
        ];
    }

    private function validatePaymentPayload($pledgeIds, $amount, $payerName, $payerEmail, $sourceId): void
    {
        if (!is_array($pledgeIds) || count($pledgeIds) === 0) {
            throw new \InvalidArgumentException('pledgeIds are required.');
        }
        if (!is_numeric($amount)) {
            throw new \InvalidArgumentException('amount is required.');
        }
        if (!$payerName || !$payerEmail) {
            throw new \InvalidArgumentException('payerName and payerEmail are required.');
        }
        if (!$sourceId) {
            throw new \InvalidArgumentException('sourceId is required.');
        }
    }

    private function ensureSponsorOwnsPledges(string $sponsorUsername, array $pledges, array $pledgeIds): void
    {
        if (count($pledges) !== count($pledgeIds)) {
            throw new \InvalidArgumentException('Pledge not found.');
        }
        foreach ($pledges as $pledge) {
            if ($pledge['spUserName'] !== $sponsorUsername) {
                throw new \InvalidArgumentException('Not authorized to pay this pledge.');
            }
        }
    }

    private function sumPledgeAmounts(array $pledges): float
    {
        $sum = 0.0;
        foreach ($pledges as $pledge) {
            $sum += (float) $pledge['amt'];
        }
        return $sum;
    }

    private function ensureAmountMatches($amount, float $expected): void
    {
        $amount = (float) $amount;
        if (abs($amount - $expected) > 0.01) {
            throw new \InvalidArgumentException('Amount does not match pledge total.');
        }
    }

    private function recordPayment(
        string $sponsorId,
        ?string $email,
        array $pledges,
        float $amount,
        string $status,
        ?string $receipt,
        string $paymentId
    ): void {
        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $paymentRowId = $this->payments->createPayment([
                'sponsor_id' => $sponsorId,
                'payment_id' => $paymentId,
                'order_id' => null,
                'order_date' => date('Y-m-d H:i:s'),
                'pledge_json' => json_encode(array_map(fn($p) => $p['pledgeId'], $pledges)),
                'customer_id' => null,
                'email' => $email,
                'paid_amt' => $amount,
                'paid_date' => date('Y-m-d H:i:s'),
                'status' => $status,
                'receipt_link' => $receipt,
            ]);

            $pledgeRowIds = array_map(fn($p) => (int) $p['id'], $pledges);
            $this->payments->linkPaymentPledges($paymentRowId, $pledgeRowIds);

            $stmt = $pdo->prepare('UPDATE pledges SET paid = :paid, payment_id = :paymentId WHERE pledgeId = :pledgeId');
            foreach ($pledges as $pledge) {
                $stmt->execute([
                    'paid' => $pledge['amt'],
                    'paymentId' => $paymentId,
                    'pledgeId' => $pledge['pledgeId'],
                ]);
            }

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
