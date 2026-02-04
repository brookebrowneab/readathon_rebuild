<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$email = getenv('TEST_ADMIN_EMAIL') ?: '';
$password = getenv('TEST_ADMIN_PASSWORD') ?: '';

if ($email === '' || $password === '') {
    fwrite(STDERR, "Missing TEST_ADMIN_EMAIL or TEST_ADMIN_PASSWORD env vars.\n");
    exit(1);
}

$client = new TestClient($baseUrl);

$forbidden = $client->request('GET', '/api/admin/metrics');
if ($forbidden['status'] !== 401) {
    fwrite(STDERR, "Expected 401 for unauthenticated admin metrics.\n");
    exit(1);
}

$login = $client->request('POST', '/api/admin/auth/login', [
    'email' => $email,
    'password' => $password,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Expected admin login success.\n");
    exit(1);
}

$authorized = $client->request('GET', '/api/admin/metrics');
if ($authorized['status'] !== 200 || empty($authorized['body']['ok'])) {
    fwrite(STDERR, "Expected admin metrics success.\n");
    exit(1);
}

echo "admin_auth_test: OK\n";
