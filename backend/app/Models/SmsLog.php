<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SmsLog extends Model
{
    protected $fillable = [
        'pregancy_tracking_id',
        'patient_id',
        'message',
        'is_read',
        'read_at',
    ];

    public function pregnancy_tracking(): BelongsTo
    {
        return $this->belongsTo(PregnancyTracking::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function sms_log(): HasMany
    {
        return $this->hasMany(SmsLog::class);
    }
}
