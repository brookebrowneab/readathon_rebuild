<?php

namespace App\Controller;

use App\Http\Request;
use App\Repository\StudentRepository;
use App\Support\Auth;
use App\Support\Response;

class ParentChildrenController
{
    private StudentRepository $students;

    public function __construct(StudentRepository $students)
    {
        $this->students = $students;
    }

    public function list(Request $request): void
    {
        $familyUserId = Auth::parentUserId($request);
        if (!$familyUserId) {
            Response::error('UNAUTHORIZED', 'Parent session required.', null, 401);
            return;
        }

        $rows = $this->students->listByFamilyUserId($familyUserId);
        $payload = array_map(function (array $row): array {
            return [
                'id' => $row['stSponsorId'],
                'name' => trim($row['stFirstName'] . ' ' . $row['stLastName']),
                'total_minutes' => (int) $row['total_minutes'],
                'goal_minutes' => (int) $row['readingGoal'],
                'grade_info' => $row['grade'],
                'class_name' => $row['teacher'],
            ];
        }, $rows);

        Response::ok($payload);
    }
}
