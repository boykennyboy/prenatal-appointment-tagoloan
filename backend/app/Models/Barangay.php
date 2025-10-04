<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barangay extends Model
{
    protected $fillable = [
        'municipality_id',
        'name',
    ];

    public function barangay_center(): HasMany
    {
        return $this->hasMany(BarangayCenter::class);
    }

    public function patient(): HasMany
    {
        return $this->hasMany(Patient::class);
    }
}
