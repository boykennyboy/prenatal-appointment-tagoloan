<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications', function () {
    // Public channel - anyone can listen
    return true;
});

Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId
        && in_array($user->role_id, [1, 3]);
});
