<?php

require_once __DIR__ . '/fixtures.php';

$parentUsername = getenv('TEST_PARENT_USERNAME') ?: 'testparent';
$childUsername = getenv('TEST_CHILD_STUSERNAME') ?: 'teststudent';

ensureFixtures($parentUsername, $childUsername);

$parentUserId = resolveParentUserId($parentUsername);
$childId = resolveChildSponsorId($childUsername);

if (!$parentUserId || !$childId) {
    fwrite(STDERR, "Unable to resolve fixture IDs for {$parentUsername} / {$childUsername}.\n");
    exit(1);
}

echo "TEST_PARENT_USER_ID={$parentUserId}\n";
echo "TEST_PARENT_CHILD_ID={$childId}\n";
echo "E2E_PARENT_USER_ID={$parentUserId}\n";
echo "E2E_PARENT_CHILD_ID={$childId}\n";
