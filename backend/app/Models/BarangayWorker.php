<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BarangayWorker extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'barangay_center_id',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->firstname} {$this->lastname}";
    }

    public function barangay_center(): BelongsTo
    {
        return $this->belongsTo(BarangayCenter::class);
    }

    public function pregnancy_tracking(): HasMany
    {
        return $this->hasMany(PregnancyTracking::class);
    }
}
