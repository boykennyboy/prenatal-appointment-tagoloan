<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        $isRead = $this->faker->boolean(70); // 70% chance of being read
        $createdAt = $this->faker->dateTimeBetween('-30 days', 'now');
        $readAt = $isRead ? $this->faker->dateTimeBetween($createdAt, 'now') : null;

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->randomElement([
                'New message received',
                'Payment confirmation',
                'System maintenance notice',
                'Security alert',
                'Welcome to our platform',
                'Monthly report available',
                'Password expiry warning',
                'Feature update available',
                'Team invitation received',
                'Account verification required',
                'Subscription renewed',
                'Data backup completed',
                'New login detected',
                'Profile updated successfully',
                'Terms of service updated'
            ]),
            'message' => $this->faker->paragraph(rand(2, 5)),
            'is_read' => $isRead,
            'read_at' => $readAt,
            'created_at' => $createdAt,
            'updated_at' => $readAt ?? $createdAt,
        ];
    }

    public function unread(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function read(): static
    {
        return $this->state(function (array $attributes) {
            $readAt = $this->faker->dateTimeBetween($attributes['created_at'], 'now');

            return [
                'is_read' => true,
                'read_at' => $readAt,
                'updated_at' => $readAt,
            ];
        });
    }

    public function recent(): static
    {
        return $this->state(fn(array $attributes) => [
            'created_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}
