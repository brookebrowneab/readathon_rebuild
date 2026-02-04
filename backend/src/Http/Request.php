<?php

namespace App\Http;

class Request
{
    public string $method;
    public string $path;
    public array $query;
    public array $headers;
    public array $body;

    public function __construct(string $method, string $path, array $query, array $headers, array $body)
    {
        $this->method = $method;
        $this->path = $path;
        $this->query = $query;
        $this->headers = $headers;
        $this->body = $body;
    }

    public static function fromGlobals(): self
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $query = $_GET ?? [];
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $raw = file_get_contents('php://input') ?: '';
        $body = [];
        if (strlen($raw) > 0) {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $body = $decoded;
            }
        }

        return new self($method, $path, $query, $headers, $body);
    }
}
