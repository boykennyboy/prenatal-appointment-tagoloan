<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\SmsLog;
use App\Models\User;
use App\Notifications\SendSmsNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification as FacadesNotification;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-appointment-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send SMS reminders for appointments scheduled tomorrow';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        $appointments = Appointment::with(['pregnancy_tracking', 'pregnancy_tracking.patient'])
            ->whereDate('appointment_date', $tomorrow)
            ->get();

        if ($appointments->isEmpty()) {
            $this->info("No appointments scheduled for {$tomorrow}.");
            return;
        }

        $successCount = 0;
        $failedCount = 0;
        $successfulPatients = [];
        $failedPatients = [];
        $processedAppointmentIds = [];

        foreach ($appointments as $appointment) {
            try {
                $date = Carbon::parse($appointment->appointment_date)->format('F j, Y');
                $phoneNumber = $appointment->pregnancy_tracking?->patient->contact;
                $patientName = $appointment->pregnancy_tracking?->fullname ?? 'Unknown Patient';

                $message = "Hello {$patientName}, reminder: you have a prenatal appointment on "
                    . $date
                    . ".\nFrom: St. Paul Tagoloan.";

                FacadesNotification::route('philsms', $phoneNumber)
                    ->notify(new SendSmsNotification($message));

                $appointment->update(['sms_status' => 'sent']);

                $successCount++;
                $successfulPatients[] = $patientName;
                $processedAppointmentIds[] = $appointment->id;
            } catch (\Exception $e) {
                $appointment->update(['sms_status' => 'not_sent']);
                $failedCount++;
                $failedPatients[] = $appointment->pregnancy_tracking?->fullname ?? 'Unknown Patient';
                $processedAppointmentIds[] = $appointment->id;
            }
        }

        // Build the message with patient names
        $message = "Reminders successfully sent to {$successCount} out of {$appointments->count()} appointment(s).";

        if ($successCount > 0) {
            $message .= "\n\nSuccessfully sent to:\n• " . implode("\n• ", $successfulPatients);
        }

        if ($failedCount > 0) {
            $message .= "\n\nFailed to send to:\n• " . implode("\n• ", $failedPatients);
        }

        $notifMessage = "Reminders successfully sent {$successCount} out of {$appointments->count()} appointment(s).";

        if (User::whereIn('role_id', [1, 3])->exists()) {
            event(new UserNotified($notifMessage));
        }

        $systemUserId = User::where('email', 'system@gmail.com')->value('id');

        // SOLUTION 1: Use the first appointment ID as the loggable_id
        // This represents the batch operation with one of the processed appointments
        $firstAppointmentId = $processedAppointmentIds[0] ?? $appointments->first()->id;

        ActivityLogs::create([
            'user_id' => $systemUserId,
            'action' => 'sms_batch',
            'title' => 'Automated Appointment Reminders',
            'info' => [
                'new' => [
                    'success_count' => $successCount,
                    'failed_count' => $failedCount,
                    'message' => $message,
                    'date' => $tomorrow,
                    'processed_appointment_ids' => $processedAppointmentIds, // Store all IDs in info
                    'batch_operation' => true,
                ]
            ],
            'loggable_type' => Appointment::class,
            'loggable_id' => $firstAppointmentId,
            'ip_address' => 'system',
            'user_agent' => 'scheduler',
        ]);

        // Bulk create notifications without looping - SOLUTION 2
        $users = User::select('id')->where('role_id', '!=', 2)->get();

        $notificationData = $users->map(function ($user) use ($message) {
            return [
                'user_id' => $user->id,
                'title' => 'Appointment Reminders',
                'message' => $message,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        // Bulk insert notifications
        Notification::insert($notificationData);

        $this->info($notifMessage);
    }
}
