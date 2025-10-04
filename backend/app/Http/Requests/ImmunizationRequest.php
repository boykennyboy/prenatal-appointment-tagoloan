<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ImmunizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'pregnancy_tracking_id'  => 'required|exists:pregnancy_trackings,id',

            // Tetanus vaccine validation rules
            'tetanus_first_given' => 'nullable|date|before_or_equal:today',
            'tetanus_second_given' => [
                'nullable',
                'date',
                'after_or_equal:tetanus_first_given'
            ],
            'tetanus_third_given' => [
                'nullable',
                'date',
                'after_or_equal:tetanus_second_given'
            ],
            'tetanus_fourth_given' => [
                'nullable',
                'date',
                'after_or_equal:tetanus_third_given'
            ],
            'tetanus_fifth_given' => [
                'nullable',
                'date',
                'after_or_equal:tetanus_fourth_given'
            ],
            'tetanus_first_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:tetanus_first_given'
            ],
            'tetanus_second_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:tetanus_second_given'
            ],
            'tetanus_third_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:tetanus_third_given'
            ],
            'tetanus_fourth_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:tetanus_fourth_given'
            ],
            'tetanus_fifth_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:tetanus_fifth_given'
            ],

            // COVID vaccine validation rules
            'covid_first_given' => 'nullable|date|before_or_equal:today',
            'covid_second_given' => [
                'nullable',
                'date',
                'after_or_equal:covid_first_given'
            ],
            'covid_booster_given' => [
                'nullable',
                'date',
                'after_or_equal:covid_second_given'
            ],
            'covid_first_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:covid_first_given'
            ],
            'covid_second_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:covid_second_given'
            ],
            'covid_booster_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:covid_booster_given'
            ],

            // Other vaccine validation rules
            'other_vaccine_name' => 'nullable|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
            'other_first_given' => [
                'nullable',
                'date',
                'required_with:other_vaccine_name'
            ],
            'other_second_given' => [
                'nullable',
                'date',
                'after_or_equal:other_first_given'
            ],
            'other_third_given' => [
                'nullable',
                'date',
                'after_or_equal:other_second_given'
            ],
            'other_fourth_given' => [
                'nullable',
                'date',
                'after_or_equal:other_third_given'
            ],
            'other_fifth_given' => [
                'nullable',
                'date',
                'after_or_equal:other_fourth_given'
            ],
            'other_first_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:other_first_given'
            ],
            'other_second_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:other_second_given'
            ],
            'other_third_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:other_third_given'
            ],
            'other_fourth_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:other_fourth_given'
            ],
            'other_fifth_comeback' => [
                'nullable',
                'date',
                'after:today',
                'required_with:other_fifth_given'
            ],
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'pregnancy_tracking_id.required' => 'Patient ID is required.',
            'pregnancy_tracking_id.exists' => 'Selected patient does not exist.',

            // Tetanus messages
            'tetanus_second_given.after_or_equal' => 'Second tetanus dose must be given after or on the same date as the first dose.',
            'tetanus_third_given.after_or_equal' => 'Third tetanus dose must be given after or on the same date as the second dose.',
            'tetanus_fourth_given.after_or_equal' => 'Fourth tetanus dose must be given after or on the same date as the third dose.',
            'tetanus_fifth_given.after_or_equal' => 'Fifth tetanus dose must be given after or on the same date as the fourth dose.',

            // COVID messages
            'covid_second_given.after_or_equal' => 'Second COVID dose must be given after or on the same date as the first dose.',
            'covid_booster_given.after_or_equal' => 'COVID booster must be given after or on the same date as the second dose.',

            // Other vaccine messages
            'other_vaccine_name.regex' => 'Vaccine name can only contain letters, spaces, and hyphens.',
            'other_first_given.required_with' => 'First dose date is required when vaccine name is provided.',

            // Follow-up messages
            '*.after' => 'Follow-up dates must be in the future.',
            '*.before_or_equal' => 'Vaccination dates cannot be in the future.',
            '*.required_with' => 'Follow-up date is required when vaccination date is provided.',
        ];
    }

    /**
     * Configure the validator instance
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $this->validateAtLeastOneVaccine($validator);
            $this->validateVaccinationSequence($validator);
        });
    }

    /**
     * Validate that at least one vaccine type has data
     */
    protected function validateAtLeastOneVaccine($validator)
    {
        $hasTetanus = $this->hasTetanusData();
        $hasCovid = $this->hasCovidData();
        $hasOther = $this->hasOtherVaccineData();

        if (!$hasTetanus && !$hasCovid && !$hasOther) {
            $validator->errors()->add('vaccine', 'At least one vaccine type must be provided.');
        }
    }

    /**
     * Validate vaccination sequence logic
     */
    protected function validateVaccinationSequence($validator)
    {
        // Validate tetanus sequence
        $this->validateTetanusSequence($validator);

        // Validate COVID sequence
        $this->validateCovidSequence($validator);

        // Validate other vaccine sequence
        $this->validateOtherVaccineSequence($validator);
    }

    /**
     * Validate tetanus vaccination sequence
     */
    protected function validateTetanusSequence($validator)
    {
        $doses = [
            'tetanus_first_given',
            'tetanus_second_given',
            'tetanus_third_given',
            'tetanus_fourth_given',
            'tetanus_fifth_given'
        ];

        // Check that doses are given in sequence (no skipping)
        $lastGivenIndex = -1;
        foreach ($doses as $index => $dose) {
            if ($this->filled($dose)) {
                if ($index > $lastGivenIndex + 1) {
                    $previousDose = $doses[$index - 1];
                    $validator->errors()->add($dose, "You must provide {$previousDose} before {$dose}.");
                }
                $lastGivenIndex = $index;
            }
        }

        // Validate minimum intervals between doses (example: 4 weeks)
        $this->validateDoseInterval($validator, 'tetanus_first_given', 'tetanus_second_given', 30);
        $this->validateDoseInterval($validator, 'tetanus_second_given', 'tetanus_third_given', 30);
    }

    /**
     * Validate COVID vaccination sequence
     */
    protected function validateCovidSequence($validator)
    {
        // COVID second dose should be at least 3 weeks after first dose
        $this->validateDoseInterval($validator, 'covid_first_given', 'covid_second_given', 21);

        // Booster should be at least 5 months after second dose
        $this->validateDoseInterval($validator, 'covid_second_given', 'covid_booster_given', 150);

        // Cannot have second dose without first dose
        if ($this->filled('covid_second_given') && !$this->filled('covid_first_given')) {
            $validator->errors()->add('covid_second_given', 'First COVID dose must be provided before second dose.');
        }

        // Cannot have booster without second dose
        if ($this->filled('covid_booster_given') && !$this->filled('covid_second_given')) {
            $validator->errors()->add('covid_booster_given', 'Second COVID dose must be provided before booster.');
        }
    }

    /**
     * Validate other vaccine sequence
     */
    protected function validateOtherVaccineSequence($validator)
    {
        if (!$this->filled('other_vaccine_name')) {
            return; // No other vaccine data to validate
        }

        $doses = [
            'other_first_given',
            'other_second_given',
            'other_third_given',
            'other_fourth_given',
            'other_fifth_given'
        ];

        // Must have at least first dose if vaccine name is provided
        if (!$this->filled('other_first_given')) {
            $validator->errors()->add('other_first_given', 'First dose date is required when vaccine name is provided.');
        }

        // Check sequence
        $lastGivenIndex = -1;
        foreach ($doses as $index => $dose) {
            if ($this->filled($dose)) {
                if ($index > $lastGivenIndex + 1) {
                    $previousDose = $doses[$index - 1];
                    $validator->errors()->add($dose, "You must provide {$previousDose} before {$dose}.");
                }
                $lastGivenIndex = $index;
            }
        }
    }

    /**
     * Validate minimum interval between doses
     */
    protected function validateDoseInterval($validator, $firstDose, $secondDose, $minDays)
    {
        if ($this->filled($firstDose) && $this->filled($secondDose)) {
            $firstDate = \Carbon\Carbon::parse($this->input($firstDose));
            $secondDate = \Carbon\Carbon::parse($this->input($secondDose));

            if ($secondDate->diffInDays($firstDate) < $minDays) {
                $validator->errors()->add(
                    $secondDose,
                    "There must be at least {$minDays} days between {$firstDose} and {$secondDose}."
                );
            }
        }
    }

    /**
     * Check if tetanus vaccine data exists
     */
    protected function hasTetanusData(): bool
    {
        $tetanusFields = [
            'tetanus_first_given',
            'tetanus_second_given',
            'tetanus_third_given',
            'tetanus_fourth_given',
            'tetanus_fifth_given'
        ];

        return collect($tetanusFields)->some(fn($field) => $this->filled($field));
    }

    /**
     * Check if COVID vaccine data exists
     */
    protected function hasCovidData(): bool
    {
        $covidFields = [
            'covid_first_given',
            'covid_second_given',
            'covid_booster_given'
        ];

        return collect($covidFields)->some(fn($field) => $this->filled($field));
    }

    /**
     * Check if other vaccine data exists
     */
    protected function hasOtherVaccineData(): bool
    {
        return $this->filled('other_vaccine_name') || $this->filled('other_first_given');
    }

    /**
     * Get validated data organized by vaccine type
     */
    public function getVaccineData(): array
    {
        $validated = $this->validated();

        return [
            'pregnancy_tracking_id' => $validated['pregnancy_tracking_id'],
            'tetanus' => $this->extractVaccineData($validated, 'tetanus'),
            'covid' => $this->extractVaccineData($validated, 'covid'),
            'other' => $this->extractVaccineData($validated, 'other'),
        ];
    }

    /**
     * Extract vaccine-specific data from validated input
     */
    protected function extractVaccineData(array $validated, string $type): array
    {
        $data = [];
        $prefix = $type . '_';

        foreach ($validated as $key => $value) {
            if (str_starts_with($key, $prefix) && !is_null($value)) {
                // Remove prefix and convert to snake_case for database
                $cleanKey = str_replace($prefix, '', $key);
                $data[$cleanKey] = $value;
            }
        }

        return $data;
    }

    /**
     * Custom attributes for validation messages
     */
    public function attributes(): array
    {
        return [
            'pregnancy_tracking_id' => 'pregnancy tracking',
            'tetanus_first_given' => 'tetanus first dose',
            'tetanus_second_given' => 'tetanus second dose',
            'tetanus_third_given' => 'tetanus third dose',
            'tetanus_fourth_given' => 'tetanus fourth dose',
            'tetanus_fifth_given' => 'tetanus fifth dose',
            'covid_first_given' => 'COVID first dose',
            'covid_second_given' => 'COVID second dose',
            'covid_booster_given' => 'COVID booster',
            'other_vaccine_name' => 'vaccine name',
            'other_first_given' => 'other vaccine first dose',
        ];
    }
}
