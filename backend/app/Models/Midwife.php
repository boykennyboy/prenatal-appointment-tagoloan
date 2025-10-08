<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Midwife extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'barangay_center_id',
        'license_number'

    ];

    protected static function booted()
    {
        static::saving(function ($student) {
            foreach (['firstname', 'lastname'] as $field) {
                if (!empty($student->$field)) {
                    // Trim, collapse multiple spaces, normalize spacing, standard capitalization
                    $student->$field = ucwords(strtolower(
                        preg_replace('/\s+/', ' ', trim($student->$field))
                    ));
                }
            }
        });
    }

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
