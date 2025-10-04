<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'assigned_day',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->firstname} {$this->lastname}";
    }

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
}
