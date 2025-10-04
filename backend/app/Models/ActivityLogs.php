<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLogs extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'title',
        'info',
        'loggable_type',
        'loggable_id',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'info' => 'array',
    ];

    public function loggable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
