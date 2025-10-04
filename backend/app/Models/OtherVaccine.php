<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OtherVaccine extends Model
{
    protected $fillable = [
        'vaccine_name',
        'first_given',
        'second_given',
        'third_given',
        'fourth_given',
        'fifth_given',
        'first_comeback',
        'second_comeback',
        'third_comeback',
        'fourth_comeback',
        'fifth_comeback',
    ];

    public function immuzition(): HasMany
    {
        return $this->hasMany(ImmuzitionRecord::class);
    }
}
