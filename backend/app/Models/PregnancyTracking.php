<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PregnancyTracking extends Model
{
    protected $fillable = [
        'patient_id',
        'pregnancy_tracking_number',
        'barangay_center_id',
        'barangay_worker_id',
        'nurse_id',
        'midwife_id',
        'fullname',
        'age',
        'gravidity',
        'parity',
        'abortion',
        'lmp',
        'edc',
        'bemoc',
        'bemoc_address',
        'cemoc',
        'cemoc_address',
        'anc_given',
        'date_delivery',
        'outcome_sex',
        'outcome_weight',
        'place_of_delivery',
        'attended_by',
        'phic',
        'barangay_health_station',
        'referral_unit',
        'pregnancy_status',
        'isDone',
    ];

    public function latestAppointment()
    {
        return $this->hasOne(Appointment::class)->latestOfMany();
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'attended_by');
    }

    public function barangay_center(): BelongsTo
    {
        return $this->belongsTo(BarangayCenter::class);
    }

    public function midwife(): BelongsTo
    {
        return $this->belongsTo(Midwife::class);
    }

    public function nurse(): BelongsTo
    {
        return $this->belongsTo(Nurse::class);
    }

    public function barangay_worker(): BelongsTo
    {
        return $this->belongsTo(BarangayWorker::class);
    }

    public function risk_codes(): HasMany
    {
        return $this->hasMany(RiskCode::class);
    }

    public function sms_log(): HasMany
    {
        return $this->hasMany(SmsLog::class);
    }
}
