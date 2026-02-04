<?php

namespace App\Controller;

use App\Service\AdminMetricsService;
use App\Support\Auth;
use App\Support\Response;

class AdminMetricsController
{
    private AdminMetricsService $service;

    public function __construct(AdminMetricsService $service)
    {
        $this->service = $service;
    }

    public function show(): void
    {
        if (!Auth::requireAdmin()) {
            return;
        }

        Response::ok($this->service->getMetrics());
    }
}
