<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class UpdateMissedAppointments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-missed-appointments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update appointments scheduled for today as missed if they are still scheduled';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        $appointment_count = Appointment::whereDate('appointment_date', $today)->count();

        $appointments = Appointment::with(['pregnancy_tracking'])
            ->where('status', 'scheduled')
            ->whereDate('appointment_date', $today)
            ->get();

        if ($appointments->isEmpty()) {
            $this->info("No scheduled appointments found for today ({$today->toDateString()}) to mark as missed.");
            return;
        }

        $successCount = $appointments->count();
        $successfulPatients = $appointments->pluck('pregnancy_tracking.fullname')->filter()->toArray();
        $appointmentIds = $appointments->pluck('id')->toArray();

        // Bulk update all appointments to missed status
        Appointment::whereIn('id', $appointmentIds)
            ->update([
                'status' => 'missed',
                'updated_at' => now()
            ]);

        $message = "Out of {$appointment_count} scheduled appointments today, {$successCount} were marked as missed.";

        if ($successCount > 0) {
            $message .= "\n\nMissed Patients:\n• " . implode("\n• ", $successfulPatients);
        }

        $notifMessage = "Out of {$appointment_count} scheduled appointments today, {$successCount} were marked as missed.";

        // Trigger user notification event
        if (User::whereIn('role_id', [1, 3])->exists()) {
            event(new UserNotified($notifMessage));
        }

        $systemUserId = User::where('email', 'system@gmail.com')->value('id');

        // Create a single batch activity log instead of individual logs
        ActivityLogs::create([
            'user_id' => $systemUserId,
            'action' => 'scheduler_batch',
            'title' => 'Automated Missed Appointments Update',
            'info' => [
                'new' => [
                    'success_count' => $successCount,
                    'total_appointments_today' => $appointment_count,
                    'message' => $message,
                    'date' => $today->toDateString(),
                    'processed_appointment_ids' => $appointmentIds,
                    'missed_patients' => $successfulPatients,
                    'batch_operation' => true,
                ]
            ],
            'loggable_type' => Appointment::class,
            'loggable_id' => $appointmentIds[0], // Use first appointment ID for the batch
            'ip_address' => 'system',
            'user_agent' => 'scheduler',
        ]);

        // Bulk create notifications instead of looping
        $users = User::select('id')->where('role_id', '!=', 2)->get();

        $notificationData = $users->map(function ($user) use ($message) {
            return [
                'user_id' => $user->id,
                'title' => 'Missed Appointment Updates',
                'message' => $message,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        // Bulk insert all notifications at once
        if (!empty($notificationData)) {
            Notification::insert($notificationData);
        }

        $this->info($notifMessage);
    }
}
