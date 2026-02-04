<?php

require_once __DIR__ . '/../src/Support/Database.php';

use App\Support\Database;

function resolveParentUserId(string $username): ?int
{
    $pdo = Database::connection();
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = :username LIMIT 1');
    $stmt->execute(['username' => $username]);
    $row = $stmt->fetch();
    return $row ? (int) $row['id'] : null;
}

function resolveChildSponsorId(string $studentUsername): ?string
{
    $pdo = Database::connection();
    $stmt = $pdo->prepare('SELECT stSponsorId FROM students WHERE stUserName = :username LIMIT 1');
    $stmt->execute(['username' => $studentUsername]);
    $row = $stmt->fetch();
    return $row ? $row['stSponsorId'] : null;
}

function ensureFixtures(string $parentUsername = 'testparent', string $studentUsername = 'teststudent'): void
{
    $pdo = Database::connection();
    try {
        $pdo->beginTransaction();

        $parentId = resolveParentUserId($parentUsername);
        if ($parentId === null) {
            $stmt = $pdo->prepare(
                'INSERT INTO users (username, email, password, user_type, display_name, phone)
                 VALUES (:username, :email, :password, :user_type, :display_name, :phone)'
            );
            $stmt->execute([
                'username' => $parentUsername,
                'email' => $parentUsername . '@example.com',
                'password' => 'test-password',
                'user_type' => 'parent',
                'display_name' => 'Test Parent',
                'phone' => '555-0100',
            ]);
            $parentId = (int) $pdo->lastInsertId();
        }

        $childId = resolveChildSponsorId($studentUsername);
        if ($childId === null) {
            $sponsorId = '__test__' . $studentUsername;
            $stmt = $pdo->prepare(
                'INSERT INTO students (stUserName, readingGoal, stFirstName, stLastName, schoolId, teacher, grade, stSponsorId, familyUserName, familyUserid, privacy, campaign_id, homeroom_teacher_username, student_public_id, share_public_link)
                 VALUES (:stUserName, :readingGoal, :stFirstName, :stLastName, :schoolId, :teacher, :grade, :stSponsorId, :familyUserName, :familyUserid, :privacy, :campaign_id, :homeroom_teacher_username, :student_public_id, :share_public_link)'
            );
            $stmt->execute([
                'stUserName' => $studentUsername,
                'readingGoal' => 500,
                'stFirstName' => 'Test',
                'stLastName' => 'Student',
                'schoolId' => 1,
                'teacher' => 'Test Teacher',
                'grade' => '3rd',
                'stSponsorId' => $sponsorId,
                'familyUserName' => $parentUsername,
                'familyUserid' => $parentId,
                'privacy' => 0,
                'campaign_id' => null,
                'homeroom_teacher_username' => null,
                'student_public_id' => $sponsorId,
                'share_public_link' => 1,
            ]);
        }

        $pdo->commit();
    } catch (\Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}
