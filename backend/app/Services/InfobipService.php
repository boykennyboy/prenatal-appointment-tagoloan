<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InfobipService
{
    protected $apiKey;
    protected $baseUrl;
    protected $sender;

    public function __construct()
    {
        $this->apiKey = env('INFOBIP_API_KEY');
        $this->baseUrl = env('INFOBIP_BASE_URL');
        $this->sender = env('INFOBIP_SENDER', 'LaravelApp');
    }

    public function sendSms($to, $message)
    {
        $payload = [
            "messages" => [
                [
                    "from" => $this->sender,
                    "destinations" => [
                        ["to" => $to]  // Example: "+639171234567"
                    ],
                    "text" => $message
                ]
            ]
        ];

        $response = Http::withHeaders([
            'Authorization' => "App {$this->apiKey}",
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/sms/2/text/advanced", $payload);

        return $response->json();
    }
}
