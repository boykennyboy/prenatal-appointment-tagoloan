<?php

namespace App\Http\Requests;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePregnancyTrackingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        $user = Auth::user();

        if (!in_array($user->role->role, ['admin', 'opd'])) {
            throw new AuthorizationException('You are not authorized to perform this action.');
        }

        return true;
    }

    public function rules()
    {
        $patientType = $this->input('patient_type');

        $rules = [
            'barangay_center_id'        => 'required|exists:barangay_centers,id',
            'nurse_id'                  => 'required|exists:nurses,id',
            'midwife_id'                => 'required|exists:midwives,id',
            'gravidity'                 => 'required|max:255',
            'parity'                    => 'required|max:255',
            'abortion'                  => 'required|max:255',
            'lmp'                       => 'required|date',
            'edc'                       => 'required|date',
            'bemoc'                     => 'required|max:255',
            'bemoc_address'             => 'required|max:255',
            'cemoc'                     => 'required|max:255',
            'cemoc_address'             => 'required|max:255',
            'referral_unit'             => 'required|max:255',
            'anc_given'                 => 'nullable',
            'date_delivery'             => 'nullable|date',
            'outcome_sex'               => 'nullable|max:255',
            'outcome_weight'            => 'nullable|max:255',
            'place_of_delivery'         => 'nullable|max:255',
            'attended_by'               => 'nullable|max:255',
            'phic'                      => 'nullable',
        ];

        if ($patientType === 'existing') {
            $rules = array_merge($rules, [
                'patient_id'                => 'required|exists:patients,id',
            ]);
        }

        if ($patientType === 'new') {
            $rules = array_merge($rules, [
                'firstname'                 => 'required|max:255',
                'lastname'                  => 'required|max:255',
                'middlename'                => 'required|max:255',
                'sex'                       => 'required|max:255',
                'status'                    => 'required|max:255',
                'birth_date'                => 'required|date',
                'birth_place'               => 'required|max:255',
                'religion'                  => 'required|max:255',
                'contact'                   => 'required|regex:/^639\d{9}$/|unique:patients',
                'contact_person_name'       => 'required|max:255',
                'contact_person_number'     => 'required|regex:/^639\d{9}$/',
                'contact_person_relationship' => 'required|max:255',
                'zone'                      => 'required|max:255',
                'region'                    => 'required|exists:regions,id',
                'province'                  => 'required|exists:provinces,id',
                'municipality'              => 'required|exists:municipalities,id',
                'barangay'                  => 'required|exists:barangays,id',
            ]);
        }



        return $rules;
    }
}
