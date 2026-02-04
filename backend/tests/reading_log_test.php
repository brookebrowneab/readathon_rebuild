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

$unauth = $client->request('POST', '/api/student/reading-logs', [
    'minutes' => 15,
    'book_title' => 'Test Book',
]);

if ($unauth['status'] !== 401) {
    fwrite(STDERR, "Expected 401 for unauthorized create. Got {$unauth['status']}\n");
    exit(1);
}

$login = $client->request('POST', '/api/functions/student-login', [
    'username' => $username,
    'password' => $password,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Login failed for reading_log_test.\n");
    exit(1);
}

$me = $client->request('GET', '/api/student/me');
if ($me['status'] !== 200 || empty($me['body']['ok'])) {
    fwrite(STDERR, "Expected /api/me/student success. Got {$me['status']}\n");
    exit(1);
}

$listBefore = $client->request('GET', '/api/student/reading-logs');
if ($listBefore['status'] !== 200 || empty($listBefore['body']['ok'])) {
    fwrite(STDERR, "Expected list reading logs success. Got {$listBefore['status']}\n");
    exit(1);
}

$created = $client->request('POST', '/api/student/reading-logs', [
    'minutes' => 20,
    'book_title' => 'Test Book',
]);

if ($created['status'] !== 201 || empty($created['body']['ok'])) {
    fwrite(STDERR, "Expected create success. Got {$created['status']}\n");
    exit(1);
}

echo "reading_log_test: OK\n";
