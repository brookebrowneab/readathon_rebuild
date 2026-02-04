<?php

require_once __DIR__ . '/TestClient.php';
require_once __DIR__ . '/fixtures.php';

$baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
$parentUserId = getenv('TEST_PARENT_USER_ID') ?: '';
$childId = getenv('TEST_PARENT_CHILD_ID') ?: '';
$parentUsername = getenv('TEST_PARENT_USERNAME') ?: 'testparent';
$childUsername = getenv('TEST_CHILD_STUSERNAME') ?: 'teststudent';

ensureFixtures($parentUsername, $childUsername);

if ($parentUserId === '') {
    $resolved = resolveParentUserId($parentUsername);
    if ($resolved) {
        $parentUserId = (string) $resolved;
    }
}

if ($childId === '') {
    $resolvedChild = resolveChildSponsorId($childUsername);
    if ($resolvedChild) {
        $childId = $resolvedChild;
    }
}

if ($parentUserId === '' || $childId === '') {
    fwrite(STDERR, "Missing parent/child fixtures. Set TEST_PARENT_USERNAME=testparent and TEST_CHILD_STUSERNAME=teststudent or provide TEST_PARENT_USER_ID/TEST_PARENT_CHILD_ID.\n");
    exit(1);
}

$client = new TestClient($baseUrl);
$authHeader = ['X-Test-User: ' . $parentUsername];

$unauthChildren = $client->request('GET', '/api/me/children');
if ($unauthChildren['status'] !== 401) {
    fwrite(STDERR, "Expected 401 for unauthorized children list. Got {$unauthChildren['status']}\n");
    exit(1);
}

$children = $client->request('GET', '/api/me/children', null, $authHeader);
if ($children['status'] !== 200 || empty($children['body']['ok'])) {
    fwrite(STDERR, "Expected children list success. Got {$children['status']}\n");
    exit(1);
}

$listLogs = $client->request('GET', '/api/me/reading-logs?child_id=eq.' . $childId, null, $authHeader);
if ($listLogs['status'] !== 200 || empty($listLogs['body']['ok'])) {
    fwrite(STDERR, "Expected reading log list success. Got {$listLogs['status']}\n");
    exit(1);
}

$created = $client->request('POST', '/api/me/reading-logs', [
    'child_id' => $childId,
    'minutes' => 25,
    'book_title' => 'Parent Test Book',
], $authHeader);

if ($created['status'] !== 201 || empty($created['body']['ok'])) {
    fwrite(STDERR, "Expected parent create success. Got {$created['status']}\n");
    exit(1);
}

$logId = $created['body']['data']['id'] ?? null;
if (!$logId) {
    fwrite(STDERR, "Expected created log id.\n");
    exit(1);
}

$updated = $client->request('PATCH', '/api/me/reading-logs/' . $logId, [
    'minutes' => 30,
    'book_title' => 'Updated Parent Book',
], $authHeader);

if ($updated['status'] !== 200 || empty($updated['body']['ok'])) {
    fwrite(STDERR, "Expected parent update success. Got {$updated['status']}\n");
    exit(1);
}

$deleted = $client->request('DELETE', '/api/me/reading-logs/' . $logId, null, $authHeader);
if ($deleted['status'] !== 200 || empty($deleted['body']['ok'])) {
    fwrite(STDERR, "Expected parent delete success. Got {$deleted['status']}\n");
    exit(1);
}

echo "parent_reading_log_test: OK\n";
