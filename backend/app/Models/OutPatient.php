<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutPatient extends Model
{
    protected $fillable = [
        'pregnancy_tracking_id',
        'file_number',
        'date',
        'time',
        'temp',
        'height',
        'weight',
        'rr',
        'pr',
        'two_sat',
        'bp',
        'phic',
        'chief_complaint',
    ];

    public function pregnancy_tracking(): BelongsTo
    {
        return $this->belongsTo(PregnancyTracking::class);
    }
}
