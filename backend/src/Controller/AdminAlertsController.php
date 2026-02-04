<?php

namespace App\Controller;

use App\Repository\AdminReportsRepository;
use App\Support\Auth;
use App\Support\Response;

class AdminAlertsController
{
    private AdminReportsRepository $reports;

    public function __construct(AdminReportsRepository $reports)
    {
        $this->reports = $reports;
    }

    public function list(): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        $outstanding = $this->reports->countOutstandingPledges();

        Response::ok([
            [
                'id' => 'outstanding',
                'count' => $outstanding,
                'label' => 'Outstanding payments',
                'link' => '/admin/outstanding',
            ],
        ]);
    }
}
