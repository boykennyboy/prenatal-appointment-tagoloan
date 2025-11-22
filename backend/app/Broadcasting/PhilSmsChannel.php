<?php

namespace App\Broadcasting;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class PhilSmsChannel
{
    public function send($notifiable, $notification)
    {
        if (! method_exists($notification, 'toPhilsms')) {
            return;
        }

        $message = $notification->toPhilsms($notifiable);

        $client = new Client();
        $apiKey = config('services.philsms.key');

        // Normalize recipients
        $recipients = is_array($message['recipient'])
            ? implode(',', $message['recipient']) // join array with comma
            : $message['recipient'];

        try {
            $response = $client->post('https://dashboard.philsms.com/api/v3/sms/send', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept'        => 'application/json',
                ],
                'json' => [
                    'recipient'       => $recipients,
                    'sender_id'       => $message['sender_id'] ?? 'PhilSMS', // max 11 chars
                    'type'            => $message['type'] ?? 'plain',
                    'message'         => $message['message'],
                    // Optional parameters:
                    'schedule_time'   => $message['schedule_time'] ?? null,
                    'dlt_template_id' => $message['dlt_template_id'] ?? null,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            if (($body['status'] ?? null) === 'success') {
                Log::info("PhilSMS sent to {$recipients}: " . json_encode($body));
            } else {
                Log::error("PhilSMS failed for {$recipients}: " . ($body['message'] ?? 'Unknown error'));
            }
        } catch (\Exception $e) {
            Log::error("PhilSMS exception for {$recipients}: " . $e->getMessage());
        }
    }
}
