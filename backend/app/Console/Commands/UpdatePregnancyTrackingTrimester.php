<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\ActivityLogs;
use App\Models\Notification;
use App\Models\PregnancyTracking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class UpdatePregnancyTrackingTrimester extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-trimester';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update pregnancy_status field based on LMP weeks and log results';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        // Count pregnancies before update
        $totalPregnancies = PregnancyTracking::count();

        if ($totalPregnancies === 0) {
            $this->info("No pregnancy tracking records found to update.");
            return;
        }

        // Bulk updates with better performance
        $first = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) <= 12')
            ->where('pregnancy_status', '!=', 'first_trimester') // Only update if different
            ->update([
                'pregnancy_status' => 'first_trimester',
                'updated_at' => now()
            ]);

        $second = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) BETWEEN 13 AND 27')
            ->where('pregnancy_status', '!=', 'second_trimester')
            ->update([
                'pregnancy_status' => 'second_trimester',
                'updated_at' => now()
            ]);

        $third = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) BETWEEN 28 AND 40')
            ->where('pregnancy_status', '!=', 'third_trimester')
            ->update([
                'pregnancy_status' => 'third_trimester',
                'updated_at' => now()
            ]);

        $completed = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) > 40')
            ->where('pregnancy_status', '!=', 'completed')
            ->update([
                'pregnancy_status' => 'completed',
                'updated_at' => now()
            ]);

        $totalUpdated = $first + $second + $third + $completed;

        // Build message
        $message = "Pregnancy statuses updated successfully today ({$today->toDateString()}).\n\n";
        $message .= "Out of {$totalPregnancies} pregnancies, {$totalUpdated} were updated:\n";
        $message .= "• {$first} set to First Trimester\n";
        $message .= "• {$second} set to Second Trimester\n";
        $message .= "• {$third} set to Third Trimester\n";
        $message .= "• {$completed} set to Completed\n";

        $notifMessage = "Pregnancy statuses updated: {$totalUpdated} records changed ({$first} first, {$second} second, {$third} third, {$completed} completed).";

        // Trigger user notification event
        if (User::whereIn('role_id', [1, 3])->exists()) {
            event(new UserNotified($notifMessage));
        }

        $systemUserId = User::where('email', 'system@gmail.com')->value('id');

        // Fix: Handle loggable_id cannot be null
        // Get a sample pregnancy tracking ID for the batch operation
        $samplePregnancyId = PregnancyTracking::value('id');

        ActivityLogs::create([
            'user_id' => $systemUserId,
            'action' => 'scheduler_batch',
            'title' => 'Automated Pregnancy Trimester Update',
            'info' => [
                'new' => [
                    'first_trimester_updated' => $first,
                    'second_trimester_updated' => $second,
                    'third_trimester_updated' => $third,
                    'completed_updated' => $completed,
                    'total_pregnancies' => $totalPregnancies,
                    'total_updated' => $totalUpdated,
                    'message' => $message,
                    'date' => $today->toDateString(),
                ]
            ],
            'loggable_type' => PregnancyTracking::class,
            'loggable_id' => $samplePregnancyId, // Use sample ID for batch operation
            'ip_address' => 'system',
            'user_agent' => 'scheduler',
        ]);

        // Bulk create notifications instead of looping
        $users = User::select('id')->where('role_id', '!=', 2)->get();

        if ($users->isNotEmpty()) {
            $notificationData = $users->map(function ($user) use ($message) {
                return [
                    'user_id' => $user->id,
                    'title' => 'Pregnancy Trimester Update',
                    'message' => $message,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            // Bulk insert notifications
            Notification::insert($notificationData);
        }

        $this->info($notifMessage);
    }
}
