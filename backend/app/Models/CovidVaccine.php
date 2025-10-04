<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CovidVaccine extends Model
{
    protected $fillable = [
        'first_given',
        'second_given',
        'booster_given',
        'first_comeback',
        'second_comeback',
        'booster_comeback',
    ];

    public function immuzition(): HasMany
    {
        return $this->hasMany(ImmuzitionRecord::class);
    }
}
