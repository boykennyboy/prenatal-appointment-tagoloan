<?php

namespace App\Notifications;

use App\Broadcasting\PhilSmsChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendSmsNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;
    protected $recipients;
    protected $senderId;
    protected $type;
    protected $scheduleTime;

    public function __construct(
        string $message,
        $recipients = null,         // single or array of numbers
        string $senderId = 'PhilSMS', // <= 11 chars
        string $type = 'plain',
        ?string $scheduleTime = null // RFC3339 format
    ) {
        $this->message = $message;
        $this->recipients = $recipients;
        $this->senderId = $senderId;
        $this->type = $type;
        $this->scheduleTime = $scheduleTime;
    }

    public function via($notifiable)
    {
        return [PhilSmsChannel::class];
    }

    public function toPhilsms($notifiable)
    {
        return [
            // if not passed, fallback to notifiable route
            'recipient'       => $this->recipients ?? $notifiable->routeNotificationFor('philsms'),
            'message'         => $this->message,
            'sender_id'       => $this->senderId,
            'type'            => $this->type,
            'schedule_time'   => $this->scheduleTime,
        ];
    }
}
