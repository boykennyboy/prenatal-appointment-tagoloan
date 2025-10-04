<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EngageSparkService
{
    protected $apiToken;
    protected $organizationId;
    protected $baseUrl = 'https://api.engagespark.com/v1';

    public function __construct()
    {
        $this->apiToken = env('ENGAGESPARK_API_TOKEN');
        $this->organizationId = env('ENGAGESPARK_ORGANIZATION_ID');
    }

    public function sendSms($phoneNumber, $message, $senderId)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Token ' . $this->apiToken,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/sms/contact", [
            'orgId' => $this->organizationId,
            'from' => $senderId,
            'message' => $message,
            'to' => $phoneNumber,
        ]);

        return $response->json();
    }
}
