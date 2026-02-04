<?php

class TestClient
{
    private string $baseUrl;
    private string $cookieJar = '';

    public function __construct(string $baseUrl)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function request(string $method, string $path, ?array $body = null, array $headers = []): array
    {
        $url = $this->baseUrl . $path;
        $ch = curl_init($url);
        $finalHeaders = [
            'Content-Type: application/json',
        ];

        if ($this->cookieJar !== '') {
            $finalHeaders[] = 'Cookie: ' . $this->cookieJar;
        }

        foreach ($headers as $header) {
            $finalHeaders[] = $header;
        }

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $finalHeaders);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('Curl error: ' . $error);
        }

        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $rawHeaders = substr($response, 0, $headerSize);
        $rawBody = substr($response, $headerSize);
        curl_close($ch);

        $this->captureCookies($rawHeaders);

        $decoded = json_decode($rawBody, true);
        return [
            'status' => $status,
            'body' => $decoded,
            'raw' => $rawBody,
        ];
    }

    private function captureCookies(string $rawHeaders): void
    {
        $lines = explode("\r\n", $rawHeaders);
        foreach ($lines as $line) {
            if (stripos($line, 'Set-Cookie:') === 0) {
                $cookie = trim(substr($line, strlen('Set-Cookie:')));
                $parts = explode(';', $cookie);
                if (!empty($parts[0])) {
                    $this->cookieJar = $parts[0];
                }
            }
        }
    }
}
