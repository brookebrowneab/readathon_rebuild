<?php

namespace App\Service;

use App\Repository\PledgeRepository;
use App\Repository\StudentRepository;
use App\Support\Ids;

class PledgeService
{
    private PledgeRepository $pledges;
    private StudentRepository $students;

    public function __construct(PledgeRepository $pledges, StudentRepository $students)
    {
        $this->pledges = $pledges;
        $this->students = $students;
    }

    public function createPledges(array $sponsor, array $payloads): array
    {
        if (count($payloads) === 0) {
            throw new \InvalidArgumentException('At least one pledge is required.');
        }

        $created = [];
        foreach ($payloads as $payload) {
            $childId = isset($payload['child_id']) ? trim((string) $payload['child_id']) : '';
            $amount = $payload['amount'] ?? null;
            $pledgeType = isset($payload['pledge_type']) ? (string) $payload['pledge_type'] : 'flat';

            if ($childId === '' || !is_numeric($amount)) {
                throw new \InvalidArgumentException('child_id and amount are required.');
            }

            $amount = (float) $amount;
            if ($amount <= 0) {
                throw new \InvalidArgumentException('Amount must be greater than zero.');
            }

            $normalizedType = $this->normalizePledgeType($pledgeType);
            if ($normalizedType === null) {
                throw new \InvalidArgumentException('Invalid pledge_type.');
            }

            $student = $this->students->findPublicBySponsorId($childId);
            if (!$student) {
                throw new \InvalidArgumentException('Child not found or not shareable.');
            }

            $pledgeId = Ids::uuid();
            $data = [
                'pledgeId' => $pledgeId,
                'spUserName' => $sponsor['username'],
                'stSponsorId' => $childId,
                'amt' => $amount,
                'unit' => $normalizedType === 'per_minute' ? 'by-the-minute' : 'flat',
                'pledge_type' => $normalizedType,
                'rate_per_minute' => $normalizedType === 'per_minute' ? $amount : null,
                'flat_amount' => $normalizedType === 'flat' ? $amount : null,
                'sponsor_display_name' => $sponsor['display_name'],
                'sponsor_email' => $sponsor['email'],
                'sponsor_phone' => $sponsor['phone'],
            ];

            $row = $this->pledges->create($data);
            $created[] = $row;
        }

        return $created;
    }

    public function normalizePledgeType(string $pledgeType): ?string
    {
        $value = strtolower(trim($pledgeType));
        if (in_array($value, ['per_minute', 'per-minute', 'perminute'], true)) {
            return 'per_minute';
        }
        if ($value === 'flat') {
            return 'flat';
        }
        return null;
    }

    public function updatePledge(string $pledgeId, array $payload): array
    {
        $amount = $payload['amount'] ?? null;
        $pledgeType = $payload['pledge_type'] ?? null;

        if ($amount === null || !is_numeric($amount)) {
            throw new \InvalidArgumentException('amount is required.');
        }
        $amount = (float) $amount;
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be greater than zero.');
        }

        $normalizedType = $pledgeType ? $this->normalizePledgeType((string) $pledgeType) : null;
        if ($normalizedType === null) {
            throw new \InvalidArgumentException('Invalid pledge_type.');
        }

        $fields = [
            'amt' => $amount,
            'pledge_type' => $normalizedType,
            'unit' => $normalizedType === 'per_minute' ? 'by-the-minute' : 'flat',
            'rate_per_minute' => $normalizedType === 'per_minute' ? $amount : null,
            'flat_amount' => $normalizedType === 'flat' ? $amount : null,
        ];

        $updated = $this->pledges->updateByPledgeId($pledgeId, $fields);
        if (!$updated) {
            throw new \RuntimeException('Pledge not found.');
        }

        return $updated;
    }

    public function deletePledge(string $pledgeId): bool
    {
        return $this->pledges->deleteByPledgeId($pledgeId);
    }
}
