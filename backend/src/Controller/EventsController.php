<?php

namespace App\Controller;

use App\Repository\CampaignRepository;
use App\Support\Response;

class EventsController
{
    private CampaignRepository $campaigns;

    public function __construct(CampaignRepository $campaigns)
    {
        $this->campaigns = $campaigns;
    }

    public function active(): void
    {
        $event = $this->campaigns->findActive();
        if (!$event) {
            Response::ok(null);
            return;
        }

        Response::ok([
            'id' => (int) $event['id'],
            'name' => $event['name'],
            'start_date' => $event['start_date'],
            'end_date' => $event['end_date'],
            'goal_minutes' => $event['max_minutes_per_campaign'] ?? null,
        ]);
    }
}
