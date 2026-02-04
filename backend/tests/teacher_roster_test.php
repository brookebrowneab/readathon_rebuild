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

$response = $client->request(
    'GET',
    '/api/children?homeroom_teacher_id=eq.' . urlencode($teacherUsername),
    null,
    $headers
);

if ($response['status'] !== 200 || empty($response['body']['ok'])) {
    fwrite(STDERR, "Expected roster lookup success. Got {$response['status']}\n");
    exit(1);
}

$found = false;
foreach ($response['body']['data'] as $row) {
    if (($row['id'] ?? '') === $studentId) {
        $found = true;
        break;
    }
}

if (!$found) {
    fwrite(STDERR, "Expected roster to include student id {$studentId}.\n");
    exit(1);
}

echo "teacher_roster_test: OK\n";
