<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory;

    protected $fillable = [
        'firstname',
        'lastname',
        'middlename',
        'age',
        'sex',
        'status',
        'birth_date',
        'birth_place',
        'zone',
        'address',
        'religion',
        'contact',
        'contact_person_name',
        'contact_person_number',
        'contact_person_relationship',
        'region',
        'province',
        'municipality',
        'barangay',
    ];

    protected static function booted()
    {
        static::saving(function ($student) {
            foreach (['firstname', 'lastname', 'middlename'] as $field) {
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

    public function pregnancy_trackings(): HasMany
    {
        return $this->hasMany(PregnancyTracking::class);
    }

    public function pregnancy_tracking(): HasOne
    {
        return $this->hasOne(PregnancyTracking::class)->where('isDone', false);
    }

    public function out_patients(): HasMany
    {
        return $this->hasMany(OutPatient::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function prenatal_visits(): HasMany
    {
        return $this->hasMany(PrenatalVisit::class);
    }

    public function immuzition_records(): HasMany
    {
        return $this->hasMany(ImmuzitionRecord::class);
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

    public function getAddressAttribute()
    {
        $barangay = $this->barangays?->name ?? '';
        $municipality = $this->municipalities?->name ?? '';
        // $province = $this->provinces?->name ?? '';

        return trim("{$barangay}, {$municipality}");
    }

    public function sms_log(): HasMany
    {
        return $this->hasMany(SmsLog::class);
    }

    public function getShortAddressAttribute()
    {
        $barangay = $this->barangays?->name ?? '';

        return trim("{$this->zone}, {$barangay}");
    }

    public function getFullAddressAttribute()
    {
        $barangay = $this->barangays?->name ?? '';
        $municipality = $this->municipalities?->name ?? '';
        $province = $this->provinces?->name ?? '';

        return trim("{$barangay} {$municipality}, {$province}");
    }
}
