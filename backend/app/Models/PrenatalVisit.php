<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrenatalVisit extends Model
{
    protected $fillable = [
        'pregnancy_tracking_id',
        'attending_physician',
        'date',
        'temp',
        'weight',
        'rr',
        'pr',
        'two_sat',
        'bp',
        'fht',
        'fh',
        'aog',
        'term',
        'preterm',
        'post_term',
        'living_children',
    ];

    public function pregnancy_tracking(): BelongsTo
    {
        return $this->belongsTo(PregnancyTracking::class);
    }
}
