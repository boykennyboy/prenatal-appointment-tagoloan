<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\User;
use Illuminate\Console\Command;

class NotifyUsers extends Command
{
    protected $signature = 'app:notify-users';
    protected $description = 'Send notification to users with role_id 1 and 3 via broadcasting';

    public function handle()
    {
        $message = "Hello! This is a scheduled notification.";

        // Get users that should receive notifications
        $targetUsers = User::whereIn('role_id', [1, 3])->get();

        if ($targetUsers->isNotEmpty()) {
            // Pass the target roles to the event
            event(new UserNotified($message, [1, 3]));

            $this->info("Notification sent to " . $targetUsers->count() . " users (roles 1 and 3).");
        } else {
            $this->info("No users with role_id 1 or 3 found.");
        }
    }
}
