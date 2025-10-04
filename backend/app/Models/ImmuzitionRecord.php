<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImmuzitionRecord extends Model
{
    protected $fillable = [
        'pregnancy_tracking_id',
        'tetanus_vaccine_id',
        'covid_vaccine_id',
        'other_vaccine_id',
    ];

    public function pregnancy_tracking(): BelongsTo
    {
        return $this->belongsTo(PregnancyTracking::class);
    }

    public function tetanus_vaccine(): BelongsTo
    {
        return $this->belongsTo(TetanusVaccine::class);
    }

    public function covid_vaccine(): BelongsTo
    {
        return $this->belongsTo(CovidVaccine::class);
    }

    public function other_vaccine(): BelongsTo
    {
        return $this->belongsTo(OtherVaccine::class);
    }
}
