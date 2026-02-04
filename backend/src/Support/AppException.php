<?php

namespace App\Support;

class AppException extends \RuntimeException
{
    public string $codeName;
    public int $status;
    public $details;

    public function __construct(string $codeName, string $message, int $status, $details = null)
    {
        parent::__construct($message);
        $this->codeName = $codeName;
        $this->status = $status;
        $this->details = $details;
    }
}
