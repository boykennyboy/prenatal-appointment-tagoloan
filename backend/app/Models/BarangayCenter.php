<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BarangayCenter extends Model
{
    protected $fillable = [
        'health_station',
        'rural_health_unit',
        'region',
        'province',
        'municipality',
        'barangay',
    ];

    public function midwives(): HasMany
    {
        return $this->hasMany(Midwife::class);
    }

    public function barangay_workers(): HasMany
    {
        return $this->hasMany(BarangayWorker::class);
    }

    public function pregnancy_trackings(): HasMany
    {
        return $this->hasMany(PregnancyTracking::class);
    }

    public function regions(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region');
    }

    public function provinces(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province');
    }

    public function municipalities(): BelongsTo
    {
        return $this->belongsTo(Municipality::class, 'municipality');
    }

    public function barangays(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay');
    }

    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function getAddressAttribute()
    {
        $barangay = $this->barangays?->name ?? '';
        $municipality = $this->municipalities?->name ?? '';
        $province = $this->provinces?->name ?? '';

        return trim("{$barangay} {$municipality}, {$province}");
    }
}
