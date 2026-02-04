<?php

require_once __DIR__ . '/TestClient.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$teacherUsername = getenv('TEST_TEACHER_USERNAME') ?: '';
$studentId = getenv('TEST_TEACHER_STUDENT_ID') ?: '';

if ($teacherUsername === '' || $studentId === '') {
    fwrite(STDERR, "Missing TEST_TEACHER_USERNAME or TEST_TEACHER_STUDENT_ID env vars.\n");
    exit(1);
}

$client = new TestClient($baseUrl);
$headers = [
    'X-Teacher-Username: ' . $teacherUsername,
];

$created = $client->request('POST', '/api/reading_logs', [
    'child_id' => $studentId,
    'minutes' => 25,
    'book_title' => 'Teacher Test Book',
    'logged_at' => date('c'),
], $headers);

if ($created['status'] !== 201 || empty($created['body']['ok'])) {
    fwrite(STDERR, "Expected teacher log create success. Got {$created['status']}\n");
    exit(1);
}

if (($created['body']['data']['child_id'] ?? '') !== $studentId) {
    fwrite(STDERR, "Expected created log to reference child id {$studentId}.\n");
    exit(1);
}

echo "teacher_log_create_test: OK\n";
