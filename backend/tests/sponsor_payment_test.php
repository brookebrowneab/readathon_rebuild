<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$sponsorEmail = getenv('TEST_SPONSOR_EMAIL') ?: '';
$sponsorPassword = getenv('TEST_SPONSOR_PASSWORD') ?: '';
$childId = getenv('TEST_SPONSOR_CHILD_ID') ?: '';

if ($sponsorEmail === '' || $sponsorPassword === '' || $childId === '') {
    fwrite(STDERR, "Missing sponsor env vars for sponsor_payment_test.\n");
    exit(1);
}

$client = new TestClient($baseUrl);

$login = $client->request('POST', '/api/auth/token', [
    'email' => $sponsorEmail,
    'password' => $sponsorPassword,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Sponsor login failed.\n");
    exit(1);
}

$create = $client->request('POST', '/api/pledges', [
    ['child_id' => $childId, 'amount' => 10, 'pledge_type' => 'flat'],
]);

if ($create['status'] !== 201 || empty($create['body']['ok'])) {
    fwrite(STDERR, "Expected pledge create success. Got {$create['status']}\n");
    exit(1);
}

$pledgeId = $create['body']['data'][0]['id'] ?? null;
if (!$pledgeId) {
    fwrite(STDERR, "Missing pledge id in create response.\n");
    exit(1);
}

$pay = $client->request('POST', '/api/functions/process-square-payment', [
    'amount' => 10,
    'pledgeIds' => [$pledgeId],
    'sourceId' => 'test-source',
    'payerName' => 'Test Sponsor',
    'payerEmail' => $sponsorEmail,
]);

if ($pay['status'] !== 200 || empty($pay['body']['ok'])) {
    fwrite(STDERR, "Expected card payment success. Got {$pay['status']}\n");
    exit(1);
}

$create2 = $client->request('POST', '/api/pledges', [
    ['child_id' => $childId, 'amount' => 15, 'pledge_type' => 'flat'],
]);

if ($create2['status'] !== 201 || empty($create2['body']['ok'])) {
    fwrite(STDERR, "Expected pledge create success for check. Got {$create2['status']}\n");
    exit(1);
}

$pledgeId2 = $create2['body']['data'][0]['id'] ?? null;
if (!$pledgeId2) {
    fwrite(STDERR, "Missing pledge id in create response.\n");
    exit(1);
}

$check = $client->request('POST', '/api/functions/notify-check-payment', [
    'amount' => 15,
    'pledgeIds' => [$pledgeId2],
    'payerName' => 'Test Sponsor',
]);

if ($check['status'] !== 200 || empty($check['body']['ok'])) {
    fwrite(STDERR, "Expected check payment success. Got {$check['status']}\n");
    exit(1);
}

echo "sponsor_payment_test: OK\n";
