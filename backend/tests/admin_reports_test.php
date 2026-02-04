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

$login = $client->request('POST', '/api/admin/auth/login', [
    'email' => $email,
    'password' => $password,
]);

if ($login['status'] !== 200 || empty($login['body']['ok'])) {
    fwrite(STDERR, "Expected admin login success.\n");
    exit(1);
}

$reports = [
    '/api/admin/reports/students?format=csv' => 'stSponsorId,stFirstName,stLastName,grade,teacher,readingGoal',
    '/api/admin/reports/pledges?format=csv' => 'pledgeId,spUserName,stSponsorId,amt,unit,paid,dateTime',
    '/api/admin/reports/payments?format=csv' => 'id,sponsor_id,email_cust,paid_amt,paid_date,pymt_status,receipt_link',
    '/api/admin/reports/finance?format=csv' => 'pledgeId,spUserName,stSponsorId,amt,unit,paid,dateTime',
    '/api/admin/reports/checks?format=csv' => 'id,sponsor_id,email_cust,paid_amt,paid_date,pymt_status',
];

foreach ($reports as $path => $expectedHeader) {
    $response = $client->request('GET', $path);
    if ($response['status'] !== 200) {
        fwrite(STDERR, "Expected 200 for {$path}. Got {$response['status']}.\n");
        exit(1);
    }
    $raw = trim((string) $response['raw']);
    if ($raw === '' || strpos($raw, $expectedHeader) !== 0) {
        fwrite(STDERR, "CSV header mismatch for {$path}.\n");
        exit(1);
    }
}

echo "admin_reports_test: OK\n";
