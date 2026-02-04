<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$sponsorEmail = getenv('TEST_SPONSOR_EMAIL') ?: '';
$sponsorPassword = getenv('TEST_SPONSOR_PASSWORD') ?: '';
$sponsorEmail2 = getenv('TEST_SPONSOR_EMAIL_2') ?: '';
$sponsorPassword2 = getenv('TEST_SPONSOR_PASSWORD_2') ?: '';
$childId = getenv('TEST_SPONSOR_CHILD_ID') ?: '';

if ($sponsorEmail === '' || $sponsorPassword === '' || $sponsorEmail2 === '' || $sponsorPassword2 === '' || $childId === '') {
    fwrite(STDERR, "Missing sponsor env vars for pledge_crud_test.\n");
    exit(1);
}

$client = new TestClient($baseUrl);

$unauth = $client->request('POST', '/api/pledges', [
    ['child_id' => $childId, 'amount' => 25, 'pledge_type' => 'flat'],
]);

if ($unauth['status'] !== 401) {
    fwrite(STDERR, "Expected 401 for unauthorized pledge create. Got {$unauth['status']}\n");
    exit(1);
}

$login = $client->request('POST', '/api/auth/token', [
    'email' => $sponsorEmail,
    'password' => $sponsorPassword,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Sponsor login failed.\n");
    exit(1);
}

$create = $client->request('POST', '/api/pledges', [
    ['child_id' => $childId, 'amount' => 25, 'pledge_type' => 'flat'],
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

$client2 = new TestClient($baseUrl);
$login2 = $client2->request('POST', '/api/auth/token', [
    'email' => $sponsorEmail2,
    'password' => $sponsorPassword2,
]);

if ($login2['status'] !== 200 || empty($login2['body']['ok'])) {
    fwrite(STDERR, "Second sponsor login failed.\n");
    exit(1);
}

$forbiddenUpdate = $client2->request('PATCH', '/api/pledges/' . $pledgeId, [
    'amount' => 30,
    'pledge_type' => 'flat',
]);

if ($forbiddenUpdate['status'] !== 403) {
    fwrite(STDERR, "Expected 403 for unauthorized pledge update. Got {$forbiddenUpdate['status']}\n");
    exit(1);
}

$update = $client->request('PATCH', '/api/pledges/' . $pledgeId, [
    'amount' => 30,
    'pledge_type' => 'flat',
]);

if ($update['status'] !== 200 || empty($update['body']['ok'])) {
    fwrite(STDERR, "Expected pledge update success. Got {$update['status']}\n");
    exit(1);
}

$delete = $client->request('DELETE', '/api/pledges/' . $pledgeId);
if ($delete['status'] !== 200 || empty($delete['body']['ok'])) {
    fwrite(STDERR, "Expected pledge delete success. Got {$delete['status']}\n");
    exit(1);
}

echo "pledge_crud_test: OK\n";
