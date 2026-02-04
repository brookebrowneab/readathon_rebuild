<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\PledgeRepository;
use App\Repository\StudentRepository;
use App\Service\PledgeService;
use App\Support\Response;
use App\Support\Session;

class PledgeController
{
    private PledgeService $service;
    private PledgeRepository $pledges;
    private StudentRepository $students;

    public function __construct(PledgeService $service, PledgeRepository $pledges, StudentRepository $students)
    {
        $this->service = $service;
        $this->pledges = $pledges;
        $this->students = $students;
    }

    private function requireUser(): ?array
    {
        $user = Session::user();
        if (!$user) {
            Response::error('UNAUTHORIZED', 'Authentication required.', null, 401);
            return null;
        }
        return $user;
    }

    private function requireSponsor(): ?array
    {
        $user = $this->requireUser();
        if (!$user) {
            return null;
        }
        if (($user['user_type'] ?? null) !== 'sponsor') {
            Response::error('FORBIDDEN', 'Sponsor access required.', null, 403);
            return null;
        }
        return $user;
    }

    private function ensureCanManagePledge(array $user, array $pledge): bool
    {
        if (($user['user_type'] ?? null) === 'sponsor' && $pledge['spUserName'] === $user['username']) {
            return true;
        }

        if (($user['user_type'] ?? null) === 'parent') {
            $student = $this->students->findBySponsorId($pledge['stSponsorId']);
            if ($student && (int) $student['familyUserid'] === (int) $user['id']) {
                return true;
            }
        }

        return false;
    }

    public function create(Request $request): void
    {
        $user = $this->requireSponsor();
        if (!$user) {
            return;
        }

        $payloads = $request->body;
        if (isset($payloads['child_id'])) {
            $payloads = [$payloads];
        }

        if (!is_array($payloads)) {
            Response::error('VALIDATION_ERROR', 'Invalid pledge payload.', null, 422);
            return;
        }

        try {
            $created = $this->service->createPledges($user, $payloads);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        }

        $result = array_map(fn($row) => ['id' => $row['pledgeId']], $created);
        Response::ok($result, 201);
    }

    public function list(Request $request): void
    {
        $query = $request->query;
        $childFilter = $this->parseInFilter($query['child_id'] ?? null);
        $sponsorFilter = $this->parseEqFilter($query['sponsor_id'] ?? null);
        $isPaidFilter = $this->parseBoolFilter($query['is_paid'] ?? null);

        if ($childFilter !== null) {
            $user = $this->requireUser();
            if (!$user) {
                return;
            }
            if (($user['user_type'] ?? null) !== 'parent') {
                Response::error('FORBIDDEN', 'Parent access required.', null, 403);
                return;
            }

            $pledges = $this->pledges->listByChildIds($childFilter);
            $payload = array_map(fn($row) => $this->mapPledge($row), $pledges);
            Response::ok($payload);
            return;
        }

        $user = $this->requireSponsor();
        if (!$user) {
            return;
        }

        if ($sponsorFilter !== null && $sponsorFilter !== $user['username']) {
            Response::error('FORBIDDEN', 'Cannot access other sponsor pledges.', null, 403);
            return;
        }

        $pledges = $this->pledges->listBySponsor($user['username'], $isPaidFilter);
        $payload = array_map(function (array $row): array {
            $child = $this->students->findBySponsorId($row['stSponsorId']);
            $result = $this->mapPledge($row);
            $result['child'] = $child ? ['name' => trim($child['stFirstName'] . ' ' . $child['stLastName'])] : null;
            return $result;
        }, $pledges);

        Response::ok($payload);
    }

    public function update(Request $request, string $pledgeId): void
    {
        $user = $this->requireUser();
        if (!$user) {
            return;
        }

        $pledge = $this->pledges->findByPledgeId($pledgeId);
        if (!$pledge) {
            Response::error('NOT_FOUND', 'Pledge not found.', null, 404);
            return;
        }

        if (!$this->ensureCanManagePledge($user, $pledge)) {
            Response::error('FORBIDDEN', 'Not allowed to update this pledge.', null, 403);
            return;
        }

        try {
            $updated = $this->service->updatePledge($pledgeId, $request->body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            return;
        } catch (\RuntimeException $e) {
            Response::error('NOT_FOUND', $e->getMessage(), null, 404);
            return;
        }

        Response::ok([
            'id' => $updated['pledgeId'],
            'amount' => (float) $updated['amt'],
            'pledge_type' => $updated['pledge_type'],
        ]);
    }

    public function delete(Request $request, string $pledgeId): void
    {
        $user = $this->requireUser();
        if (!$user) {
            return;
        }

        $pledge = $this->pledges->findByPledgeId($pledgeId);
        if (!$pledge) {
            Response::error('NOT_FOUND', 'Pledge not found.', null, 404);
            return;
        }

        if (!$this->ensureCanManagePledge($user, $pledge)) {
            Response::error('FORBIDDEN', 'Not allowed to delete this pledge.', null, 403);
            return;
        }

        $deleted = $this->service->deletePledge($pledgeId);
        if (!$deleted) {
            Response::error('NOT_FOUND', 'Pledge not found.', null, 404);
            return;
        }

        Response::ok(['id' => $pledgeId]);
    }

    private function mapPledge(array $row): array
    {
        return [
            'id' => $row['pledgeId'],
            'child_id' => $row['stSponsorId'],
            'amount' => (float) $row['amt'],
            'pledge_type' => $row['pledge_type'],
            'is_paid' => ((float) $row['paid']) >= (float) $row['amt'],
        ];
    }

    private function parseEqFilter(?string $value): ?string
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'eq.')) {
            return substr($value, 3);
        }
        return null;
    }

    private function parseInFilter(?string $value): ?array
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'in.(') && str_ends_with($value, ')')) {
            $list = substr($value, 4, -1);
            $parts = array_filter(array_map('trim', explode(',', $list)));
            return $parts;
        }
        return null;
    }

    private function parseBoolFilter(?string $value): ?bool
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'eq.')) {
            $raw = strtolower(substr($value, 3));
            if ($raw === 'true') {
                return true;
            }
            if ($raw === 'false') {
                return false;
            }
        }
        return null;
    }
}
