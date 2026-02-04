<?php

namespace App\Service;

use App\Repository\AdminReportsRepository;

class AdminReportsService
{
    private AdminReportsRepository $reports;

    public function __construct(AdminReportsRepository $reports)
    {
        $this->reports = $reports;
    }

    public function getOutstanding(int $limit = 5): array
    {
        $rows = $this->reports->listOutstandingPledges($limit);
        return array_map(function (array $row) {
            return [
                'id' => (string) $row['pledgeId'],
                'sponsor' => ['name' => $row['spUserName']],
                'student' => ['id' => $row['stSponsorId']],
                'amount' => (float) $row['amt'],
                'unit' => $row['unit'],
                'is_paid' => ((float) $row['paid']) > 0,
                'created_at' => $row['dateTime'],
            ];
        }, $rows);
    }

    public function getRecentActivity(int $limit = 10): array
    {
        $rows = $this->reports->listRecentPledges($limit);
        return array_map(function (array $row) {
            return [
                'type' => 'pledge',
                'message' => sprintf('%s pledged $%s', $row['spUserName'], $row['amt']),
                'time' => $row['dateTime'],
            ];
        }, $rows);
    }

    public function exportStudents(): array
    {
        return $this->reports->listStudentsForReport();
    }

    public function exportPledges(): array
    {
        return $this->reports->listPledgesForReport();
    }

    public function exportPayments(): array
    {
        return $this->reports->listPaymentsForReport();
    }

    public function exportFinance(?string $from, ?string $to): array
    {
        return $this->reports->listFinanceForReport($from, $to);
    }

    public function exportChecks(): array
    {
        return $this->reports->listChecksForReport();
    }
}
