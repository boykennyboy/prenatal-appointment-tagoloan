<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Events\NotificationFailed;
use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });

        // Notification::sent(function (NotificationSent $event) {
        //     if (method_exists($event->notifiable, 'update')) {
        //         $event->notifiable->update(['sms_status' => 'sent']);
        //     }
        // });

        // Notification::failed(function (NotificationFailed $event) {
        //     if (method_exists($event->notifiable, 'update')) {
        //         $event->notifiable->update(['sms_status' => 'not_sent']);
        //     }
        // });
    }
}
