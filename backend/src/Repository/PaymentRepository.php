<?php

namespace App\Repository;

use App\Support\Database;

class PaymentRepository
{
    public function createPayment(array $data): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO payments (sponsor_id, payment_id, order_id, order_date, pledgeId_json, customerId, email_cust, paid_amt, paid_date, pymt_status, receipt_link) '
            . 'VALUES (:sponsorId, :paymentId, :orderId, :orderDate, :pledgeJson, :customerId, :email, :paidAmt, :paidDate, :status, :receiptLink)'
        );
        $stmt->execute([
            'sponsorId' => $data['sponsor_id'],
            'paymentId' => $data['payment_id'],
            'orderId' => $data['order_id'],
            'orderDate' => $data['order_date'],
            'pledgeJson' => $data['pledge_json'],
            'customerId' => $data['customer_id'],
            'email' => $data['email'],
            'paidAmt' => $data['paid_amt'],
            'paidDate' => $data['paid_date'],
            'status' => $data['status'],
            'receiptLink' => $data['receipt_link'],
        ]);

        return (int) $pdo->lastInsertId();
    }

    public function linkPaymentPledges(int $paymentId, array $pledgeRowIds): void
    {
        if (count($pledgeRowIds) === 0) {
            return;
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare('INSERT INTO payment_pledges (payment_id, pledge_id) VALUES (:paymentId, :pledgeId)');
        foreach ($pledgeRowIds as $pledgeRowId) {
            $stmt->execute([
                'paymentId' => $paymentId,
                'pledgeId' => $pledgeRowId,
            ]);
        }
    }

    public function listPayments(int $limit = 100): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, sponsor_id, email_cust, paid_amt, paid_date, pymt_status, receipt_link\n'
            . 'FROM payments\n'
            . 'ORDER BY paid_date DESC\n'
            . 'LIMIT :limit'
        );
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
