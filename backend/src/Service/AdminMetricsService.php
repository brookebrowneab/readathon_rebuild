<?php

namespace App\Service;

use App\Repository\AdminMetricsRepository;

class AdminMetricsService
{
    private AdminMetricsRepository $metrics;

    public function __construct(AdminMetricsRepository $metrics)
    {
        $this->metrics = $metrics;
    }

    public function getMetrics(): array
    {
        return [
            'studentsEnrolled' => $this->metrics->countStudents(),
            'totalMinutes' => $this->metrics->sumMinutes(),
            'totalPledged' => $this->metrics->sumPledged(),
            'totalCollected' => $this->metrics->sumCollected(),
        ];
    }
}
