<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users or create test user if none exist
        $users = User::all();

        if ($users->isEmpty()) {
            // Create a test user if none exist
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $users = collect([$user]);
        }

        $notificationTypes = [
            [
                'title' => 'Welcome to the Platform!',
                'message' => 'Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile.',
                'is_read' => true,
                'days_ago' => 7
            ],
            [
                'title' => 'Security Alert: New Login Detected',
                'message' => 'We detected a new login to your account from a new device or location. If this was you, you can ignore this message. If not, please secure your account immediately by changing your password.',
                'is_read' => false,
                'days_ago' => 2
            ],
            [
                'title' => 'System Maintenance Scheduled',
                'message' => 'Our platform will undergo scheduled maintenance this Sunday from 2:00 AM to 6:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Monthly Report Available',
                'message' => 'Your monthly activity report is now ready for review. This report includes your usage statistics, achievements, and recommendations for the upcoming month. Click here to view your detailed report.',
                'is_read' => true,
                'days_ago' => 5
            ],
            [
                'title' => 'New Feature: Dark Mode',
                'message' => 'We\'ve just released a new dark mode feature! You can now switch between light and dark themes in your account settings. This feature is designed to reduce eye strain during extended use.',
                'is_read' => false,
                'days_ago' => 3
            ],
            [
                'title' => 'Payment Confirmation',
                'message' => 'Your payment of $29.99 for the Premium Plan has been successfully processed. Your subscription is now active and you have access to all premium features. Transaction ID: TXN-123456789',
                'is_read' => true,
                'days_ago' => 10
            ],
            [
                'title' => 'Password Expiry Warning',
                'message' => 'Your password will expire in 7 days. For security reasons, we require password updates every 90 days. Please update your password to maintain uninterrupted access to your account.',
                'is_read' => false,
                'days_ago' => 0
            ],
            [
                'title' => 'Team Invitation Received',
                'message' => 'You\'ve been invited to join the "Project Alpha" team by John Doe. Accept this invitation to collaborate on shared projects and access team resources. The invitation will expire in 48 hours.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Data Export Completed',
                'message' => 'Your requested data export has been completed successfully. The export file contains all your account data from the last 12 months. You can download it from your account settings page.',
                'is_read' => true,
                'days_ago' => 4
            ],
            [
                'title' => 'Important: Terms of Service Update',
                'message' => 'We\'ve updated our Terms of Service to better serve you and comply with new regulations. The changes will take effect on March 1st, 2024. Please review the updated terms in your account settings.',
                'is_read' => false,
                'days_ago' => 0
            ],
            [
                'title' => 'Welcome to the Platform!',
                'message' => 'Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile.',
                'is_read' => true,
                'days_ago' => 7
            ],
            [
                'title' => 'Security Alert: New Login Detected',
                'message' => 'We detected a new login to your account from a new device or location. If this was you, you can ignore this message. If not, please secure your account immediately by changing your password.',
                'is_read' => false,
                'days_ago' => 2
            ],
            [
                'title' => 'System Maintenance Scheduled',
                'message' => 'Our platform will undergo scheduled maintenance this Sunday from 2:00 AM to 6:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Monthly Report Available',
                'message' => 'Your monthly activity report is now ready for review. This report includes your usage statistics, achievements, and recommendations for the upcoming month. Click here to view your detailed report.',
                'is_read' => true,
                'days_ago' => 5
            ],
            [
                'title' => 'New Feature: Dark Mode',
                'message' => 'We\'ve just released a new dark mode feature! You can now switch between light and dark themes in your account settings. This feature is designed to reduce eye strain during extended use.',
                'is_read' => false,
                'days_ago' => 3
            ],
            [
                'title' => 'Payment Confirmation',
                'message' => 'Your payment of $29.99 for the Premium Plan has been successfully processed. Your subscription is now active and you have access to all premium features. Transaction ID: TXN-123456789',
                'is_read' => true,
                'days_ago' => 10
            ],
            [
                'title' => 'Password Expiry Warning',
                'message' => 'Your password will expire in 7 days. For security reasons, we require password updates every 90 days. Please update your password to maintain uninterrupted access to your account.',
                'is_read' => false,
                'days_ago' => 0
            ],
            [
                'title' => 'Team Invitation Received',
                'message' => 'You\'ve been invited to join the "Project Alpha" team by John Doe. Accept this invitation to collaborate on shared projects and access team resources. The invitation will expire in 48 hours.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Data Export Completed',
                'message' => 'Your requested data export has been completed successfully. The export file contains all your account data from the last 12 months. You can download it from your account settings page.',
                'is_read' => true,
                'days_ago' => 4
            ],
            [
                'title' => 'Important: Terms of Service Update',
                'message' => 'We\'ve updated our Terms of Service to better serve you and comply with new regulations. The changes will take effect on March 1st, 2024. Please review the updated terms in your account settings.',
                'is_read' => false,
                'days_ago' => 0
            ],
            [
                'title' => 'Welcome to the Platform!',
                'message' => 'Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile. Thank you for joining our platform. We\'re excited to have you on board! Get started by exploring your dashboard and setting up your profile.',
                'is_read' => true,
                'days_ago' => 7
            ],
            [
                'title' => 'Security Alert: New Login Detected',
                'message' => 'We detected a new login to your account from a new device or location. If this was you, you can ignore this message. If not, please secure your account immediately by changing your password.',
                'is_read' => false,
                'days_ago' => 2
            ],
            [
                'title' => 'System Maintenance Scheduled',
                'message' => 'Our platform will undergo scheduled maintenance this Sunday from 2:00 AM to 6:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Monthly Report Available',
                'message' => 'Your monthly activity report is now ready for review. This report includes your usage statistics, achievements, and recommendations for the upcoming month. Click here to view your detailed report.',
                'is_read' => true,
                'days_ago' => 5
            ],
            [
                'title' => 'New Feature: Dark Mode',
                'message' => 'We\'ve just released a new dark mode feature! You can now switch between light and dark themes in your account settings. This feature is designed to reduce eye strain during extended use.',
                'is_read' => false,
                'days_ago' => 3
            ],
            [
                'title' => 'Payment Confirmation',
                'message' => 'Your payment of $29.99 for the Premium Plan has been successfully processed. Your subscription is now active and you have access to all premium features. Transaction ID: TXN-123456789',
                'is_read' => true,
                'days_ago' => 10
            ],
            [
                'title' => 'Password Expiry Warning',
                'message' => 'Your password will expire in 7 days. For security reasons, we require password updates every 90 days. Please update your password to maintain uninterrupted access to your account.',
                'is_read' => false,
                'days_ago' => 0
            ],
            [
                'title' => 'Team Invitation Received',
                'message' => 'You\'ve been invited to join the "Project Alpha" team by John Doe. Accept this invitation to collaborate on shared projects and access team resources. The invitation will expire in 48 hours.',
                'is_read' => false,
                'days_ago' => 1
            ],
            [
                'title' => 'Data Export Completed',
                'message' => 'Your requested data export has been completed successfully. The export file contains all your account data from the last 12 months. You can download it from your account settings page.',
                'is_read' => true,
                'days_ago' => 4
            ],
            [
                'title' => 'Important: Terms of Service Update',
                'message' => 'We\'ve updated our Terms of Service to better serve you and comply with new regulations. The changes will take effect on March 1st, 2024. Please review the updated terms in your account settings.',
                'is_read' => false,
                'days_ago' => 0
            ]
        ];

        foreach ($users as $user) {
            foreach ($notificationTypes as $notificationType) {
                $createdAt = Carbon::now()->subDays($notificationType['days_ago']);
                $readAt = null;

                // If notification is read, set read_at to a random time after creation
                if ($notificationType['is_read']) {
                    $readAt = $createdAt->copy()->addHours(rand(1, 48));
                }

                Notification::create([
                    'user_id' => $user->id,
                    'title' => $notificationType['title'],
                    'message' => $notificationType['message'],
                    'is_read' => $notificationType['is_read'],
                    'read_at' => $readAt,
                    'created_at' => $createdAt,
                    'updated_at' => $readAt ?? $createdAt,
                ]);
            }
        }

        $this->command->info('Notifications seeded successfully!');
    }
}
