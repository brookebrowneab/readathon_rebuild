<?php

namespace App\Controller;

use App\Service\AdminReportsService;
use App\Support\Auth;
use App\Support\Response;
use App\Http\Request;

class AdminReportsController
{
    private AdminReportsService $service;

    public function __construct(AdminReportsService $service)
    {
        $this->service = $service;
    }

    public function outstanding(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $limit = (int) ($request->query['limit'] ?? 5);
        Response::ok($this->service->getOutstanding($limit));
    }

    public function activity(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $limit = (int) ($request->query['limit'] ?? 10);
        Response::ok($this->service->getRecentActivity($limit));
    }

    public function exportStudents(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $this->sendCsv(
            $this->service->exportStudents(),
            'students-report.csv',
            ['stSponsorId', 'stFirstName', 'stLastName', 'grade', 'teacher', 'readingGoal']
        );
    }

    public function exportPledges(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $this->sendCsv(
            $this->service->exportPledges(),
            'pledges-report.csv',
            ['pledgeId', 'spUserName', 'stSponsorId', 'amt', 'unit', 'paid', 'dateTime']
        );
    }

    public function exportPayments(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $this->sendCsv(
            $this->service->exportPayments(),
            'payments-report.csv',
            ['id', 'sponsor_id', 'email_cust', 'paid_amt', 'paid_date', 'pymt_status', 'receipt_link']
        );
    }

    public function exportFinance(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $from = isset($request->query['from']) ? (string) $request->query['from'] : null;
        $to = isset($request->query['to']) ? (string) $request->query['to'] : null;

        $this->sendCsv(
            $this->service->exportFinance($from, $to),
            'finance-report.csv',
            ['pledgeId', 'spUserName', 'stSponsorId', 'amt', 'unit', 'paid', 'dateTime']
        );
    }

    public function exportChecks(Request $request): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $this->sendCsv(
            $this->service->exportChecks(),
            'checks-report.csv',
            ['id', 'sponsor_id', 'email_cust', 'paid_amt', 'paid_date', 'pymt_status']
        );
    }

    private function sendCsv(array $rows, string $filename, array $headers): void
    {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        $out = fopen('php://output', 'w');
        if ($out === false) {
            Response::error('INTERNAL', 'Unable to export report.', null, 500);
            return;
        }

        fputcsv($out, $headers);
        foreach ($rows as $row) {
            $line = [];
            foreach ($headers as $header) {
                $line[] = $row[$header] ?? '';
            }
            fputcsv($out, $line);
        }

        fclose($out);
    }
}
