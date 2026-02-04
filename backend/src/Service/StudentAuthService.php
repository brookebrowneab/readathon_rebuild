<?php

namespace App\Service;

use App\Repository\StudentRepository;
use App\Repository\UserRepository;

class StudentAuthService
{
    private StudentRepository $students;
    private UserRepository $users;

    public function __construct(StudentRepository $students, UserRepository $users)
    {
        $this->students = $students;
        $this->users = $users;
    }

    public function login(string $username, string $password): ?array
    {
        $user = $this->users->findByUsername($username);
        if (!$user) {
            return null;
        }

        $stored = (string) ($user['password'] ?? '');
        if (!$this->verifyPassword($stored, $password)) {
            return null;
        }

        $student = $this->students->findByUsername($username);
        if (!$student) {
            return null;
        }

        $totalMinutes = $this->students->getTotalMinutes($student['stSponsorId']);

        return [
            'student' => $student,
            'total_minutes' => $totalMinutes,
        ];
    }

    public function getStudentSummary(string $stSponsorId): ?array
    {
        $student = $this->students->findBySponsorId($stSponsorId);
        if (!$student) {
            return null;
        }

        $totalMinutes = $this->students->getTotalMinutes($stSponsorId);

        return [
            'student' => $student,
            'total_minutes' => $totalMinutes,
        ];
    }

    private function verifyPassword(string $stored, string $password): bool
    {
        if ($stored === '') {
            return false;
        }

        if (str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2')) {
            return password_verify($password, $stored);
        }

        return hash_equals($stored, $password);
    }
}
