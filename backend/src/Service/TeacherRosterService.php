<?php

namespace App\Service;

use App\Repository\StudentRepository;

class TeacherRosterService
{
    private StudentRepository $students;

    public function __construct(StudentRepository $students)
    {
        $this->students = $students;
    }

    public function listRoster(string $teacherUsername): array
    {
        $rows = $this->students->listByHomeroomTeacherUsername($teacherUsername);
        $sponsorIds = array_map(static fn(array $row): string => $row['stSponsorId'], $rows);
        $totals = $this->students->listTotalsBySponsorIds($sponsorIds);

        return array_map(function (array $row) use ($totals): array {
            $sponsorId = $row['stSponsorId'];
            $fullName = trim($row['stFirstName'] . ' ' . $row['stLastName']);
            return [
                'id' => $sponsorId,
                'name' => $fullName,
                'student_username' => $row['stUserName'],
                'grade_info' => $row['grade'],
                'class_name' => $row['teacher'],
                'goal_minutes' => (int) $row['readingGoal'],
                'total_minutes' => $totals[$sponsorId] ?? 0,
            ];
        }, $rows);
    }
}
