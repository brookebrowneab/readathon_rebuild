<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$username = getenv('TEST_STUDENT_USERNAME') ?: '';
$password = getenv('TEST_STUDENT_PASSWORD') ?: '';

if ($username === '' || $password === '') {
    fwrite(STDERR, "Missing TEST_STUDENT_USERNAME or TEST_STUDENT_PASSWORD env vars.\n");
    exit(1);
}

$client = new TestClient($baseUrl);

$success = $client->request('POST', '/api/functions/student-login', [
    'username' => $username,
    'password' => $password,
]);

if ($success['status'] !== 200 || empty($success['body']['ok'])) {
    fwrite(STDERR, "Expected login success. Got status {$success['status']}\n");
    exit(1);
}

$failure = $client->request('POST', '/api/functions/student-login', [
    'username' => $username,
    'password' => 'wrong-password',
]);

if ($failure['status'] !== 401 || ($failure['body']['ok'] ?? true) !== false) {
    fwrite(STDERR, "Expected login failure with 401. Got status {$failure['status']}\n");
    exit(1);
}

echo "student_login_test: OK\n";
