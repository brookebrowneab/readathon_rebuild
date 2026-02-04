<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$adminEmail = getenv('TEST_ADMIN_EMAIL') ?: '';
$adminPassword = getenv('TEST_ADMIN_PASSWORD') ?: '';
$pledgeId = getenv('TEST_PLEDGE_ID') ?: '';

if ($adminEmail === '' || $adminPassword === '' || $pledgeId === '') {
    fwrite(STDERR, "Missing admin env vars for guest_pay_token_test.\n");
    exit(1);
}

$client = new TestClient($baseUrl);

$login = $client->request('POST', '/api/admin/auth/login', [
    'email' => $adminEmail,
    'password' => $adminPassword,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Admin login failed.\n");
    exit(1);
}

$create = $client->request('POST', '/api/admin/guest-pay-tokens', [
    'pledge_id' => $pledgeId,
]);

if ($create['status'] !== 201 || empty($create['body']['ok'])) {
    fwrite(STDERR, "Expected token creation success. Got {$create['status']}\n");
    exit(1);
}

$token = $create['body']['data']['token'] ?? null;
if (!$token) {
    fwrite(STDERR, "Missing token in response.\n");
    exit(1);
}

$public = $client->request('GET', '/api/guest/pay/' . $token);
if ($public['status'] !== 200 || empty($public['body']['ok'])) {
    fwrite(STDERR, "Expected guest pay GET success. Got {$public['status']}\n");
    exit(1);
}

echo "guest_pay_token_test: OK\n";
