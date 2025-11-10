<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrenatalOutPatientImmunizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            // Required prenatal visit fields
            'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
            'date' => 'required|date',
            'time' => 'required',
            'height' => 'required|numeric|min:0',
            'weight' => 'required|numeric|min:0',
            'bp' => 'required|string',
            'temp' => 'required|numeric|min:0',
            'rr' => 'required|integer|min:0',
            'pr' => 'required|integer|min:0',
            'two_sat' => 'required|integer|min:0|max:100',
            'fht' => 'required|string',
            'fh' => 'required|numeric|min:0',
            'aog' => 'required|string',
            'term' => 'required|integer|min:0',
            'preterm' => 'nullable|integer|min:0',
            'post_term' => 'nullable|integer|min:0',
            'living_children' => 'required|integer|min:0',
        ];

        // Check if patient is in third trimester
        if ($this->isThirdTrimester()) {
            $rules = array_merge($rules, [
                // Tetanus vaccine fields
                'tetanus_first_given' => 'nullable|date',
                'tetanus_second_given' => 'nullable|date',
                'tetanus_third_given' => 'nullable|date',
                'tetanus_fourth_given' => 'nullable|date',
                'tetanus_fifth_given' => 'nullable|date',
                'tetanus_first_comeback' => 'nullable|date',
                'tetanus_second_comeback' => 'nullable|date',
                'tetanus_third_comeback' => 'nullable|date',
                'tetanus_fourth_comeback' => 'nullable|date',
                'tetanus_fifth_comeback' => 'nullable|date',

                // COVID vaccine fields
                'covid_first_given' => 'nullable|date',
                'covid_second_given' => 'nullable|date',
                'covid_booster_given' => 'nullable|date',
                'covid_first_comeback' => 'nullable|date',
                'covid_second_comeback' => 'nullable|date',
                'covid_booster_comeback' => 'nullable|date',

                // Other vaccine fields
                'other_vaccine_name' => 'nullable|string|max:255',
                'other_first_given' => 'nullable|date',
                'other_second_given' => 'nullable|date',
                'other_third_given' => 'nullable|date',
                'other_fourth_given' => 'nullable|date',
                'other_fifth_given' => 'nullable|date',
                'other_first_comeback' => 'nullable|date',
                'other_second_comeback' => 'nullable|date',
                'other_third_comeback' => 'nullable|date',
                'other_fourth_comeback' => 'nullable|date',
                'other_fifth_comeback' => 'nullable|date',
            ]);
        }

        return $rules;
    }

    /**
     * Get prenatal visit data (without vaccine fields)
     */
    public function getPrenatalData(): array
    {
        return $this->only([
            'pregnancy_tracking_id',
            'date',
            'time',
            'height',
            'weight',
            'bp',
            'temp',
            'rr',
            'pr',
            'two_sat',
            'fht',
            'fh',
            'aog',
            'term',
            'preterm',
            'post_term',
            'living_children',
        ]);
    }

    /**
     * Get vaccine data organized by vaccine type
     */
    public function getVaccineData(): array
    {
        if (!$this->isThirdTrimester()) {
            return [];
        }

        $data = [
            'pregnancy_tracking_id' => $this->pregnancy_tracking_id,
        ];

        // Get Tetanus vaccine data
        $tetanusData = $this->only([
            'tetanus_first_given',
            'tetanus_second_given',
            'tetanus_third_given',
            'tetanus_fourth_given',
            'tetanus_fifth_given',
            'tetanus_first_comeback',
            'tetanus_second_comeback',
            'tetanus_third_comeback',
            'tetanus_fourth_comeback',
            'tetanus_fifth_comeback',
        ]);

        // Remove 'tetanus_' prefix and filter out empty values
        $tetanusFiltered = [];
        foreach ($tetanusData as $key => $value) {
            if (!empty($value)) {
                $newKey = str_replace('tetanus_', '', $key);
                $tetanusFiltered[$newKey] = $value;
            }
        }

        if (!empty($tetanusFiltered)) {
            $data['tetanus'] = $tetanusFiltered;
        }

        // Get COVID vaccine data
        $covidData = $this->only([
            'covid_first_given',
            'covid_second_given',
            'covid_booster_given',
            'covid_first_comeback',
            'covid_second_comeback',
            'covid_booster_comeback',
        ]);

        // Remove 'covid_' prefix and filter out empty values
        $covidFiltered = [];
        foreach ($covidData as $key => $value) {
            if (!empty($value)) {
                $newKey = str_replace('covid_', '', $key);
                $covidFiltered[$newKey] = $value;
            }
        }

        if (!empty($covidFiltered)) {
            $data['covid'] = $covidFiltered;
        }

        // Get Other vaccine data
        $otherData = $this->only([
            'other_vaccine_name',
            'other_first_given',
            'other_second_given',
            'other_third_given',
            'other_fourth_given',
            'other_fifth_given',
            'other_first_comeback',
            'other_second_comeback',
            'other_third_comeback',
            'other_fourth_comeback',
            'other_fifth_comeback',
        ]);

        // Remove 'other_' prefix and filter out empty values
        $otherFiltered = [];
        foreach ($otherData as $key => $value) {
            if (!empty($value)) {
                $newKey = str_replace('other_', '', $key);
                $otherFiltered[$newKey] = $value;
            }
        }

        // Only include other vaccine if vaccine_name is provided
        if (!empty($otherFiltered['vaccine_name'])) {
            $data['other'] = $otherFiltered;
        }

        return $data;
    }

    /**
     * Check if the patient is in third trimester
     */
    protected function isThirdTrimester(): bool
    {
        if (!$this->pregnancy_tracking_id) {
            return false;
        }

        $pregnancyTracking = \App\Models\PregnancyTracking::find($this->pregnancy_tracking_id);

        return $pregnancyTracking && $pregnancyTracking->pregnancy_status === 'third_trimester';
    }

    /**
     * Check if vaccine data exists
     */
    public function hasVaccineData(): bool
    {
        $vaccineData = $this->getVaccineData();
        return !empty($vaccineData) && (
            isset($vaccineData['tetanus']) ||
            isset($vaccineData['covid']) ||
            isset($vaccineData['other'])
        );
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'pregnancy_tracking_id.required' => 'Please select a patient.',
            'pregnancy_tracking_id.exists' => 'Selected patient does not exist.',
            'date.required' => 'Visit date is required.',
            'date.date' => 'Invalid date format.',
            'time.required' => 'Visit time is required.',
            'weight.numeric' => 'Weight must be a number.',
            'height.numeric' => 'Height must be a number.',
            'two_sat.max' => 'O2 Saturation cannot exceed 100%.',
        ];
    }

    /**
     * Get custom attribute names
     */
    public function attributes(): array
    {
        return [
            'pregnancy_tracking_id' => 'patient',
            'two_sat' => 'O2 saturation',
            'bp' => 'blood pressure',
            'temp' => 'temperature',
            'rr' => 'respiratory rate',
            'pr' => 'pulse rate',
            'fht' => 'fetal heart tone',
            'fh' => 'fundal height',
            'aog' => 'age of gestation',
        ];
    }
}
