<?php

namespace App\Controller;

use App\Support\Response;

class SiteContentController
{
    private string $path;

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function list(): void
    {
        if (!file_exists($this->path)) {
            Response::ok([]);
            return;
        }

        $raw = file_get_contents($this->path);
        if ($raw === false) {
            Response::error('INTERNAL', 'Unable to read site content.', null, 500);
            return;
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            Response::ok([]);
            return;
        }

        Response::ok($decoded);
    }
}
