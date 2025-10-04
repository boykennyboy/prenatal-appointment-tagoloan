<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskCode extends Model
{
    protected $fillable = [
        "risk_code",
        "date_detected",
        "risk_status",
        "pregnancy_tracking_id"
    ];

    public function pregnancy_tracking(): BelongsTo
    {
        return $this->belongsTo(PregnancyTracking::class);
    }
}
