<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserNotified implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $targetRoles;

    public function __construct($message, $targetRoles = [1, 3])
    {
        $this->message = $message;
        $this->targetRoles = $targetRoles;
    }

    public function broadcastOn()
    {
        return new Channel('notifications');
    }

    public function broadcastAs()
    {
        return 'notify.user';
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'target_roles' => $this->targetRoles,
            'timestamp' => now()->toISOString(),
        ];
    }
}
