<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PregnancyTrackingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $user = $request->user();

        // Check if patient has an appointment
        $hasAppointment = $this->appointments()->exists();
        $high_risk = $this->risk_codes()->exists();

        $pregnancy_status = ($user && $user->id === 2)
            ? (!$high_risk ? 'normal' : ($hasAppointment ? 'accepted' : 'pending'))
            : $this->pregnancy_status;

        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'nurse_id' => $this->nurse_id,
            'midwife_id' => $this->midwife_id,
            'barangay_center_id' => $this->barangay_center_id,
            'barangay_id' => $this->patient->barangay,
            'municipality_id' => $this->patient->municipality,
            'province_id' => $this->patient->province,
            'region_id' => $this->patient->region,
            'fullname' => $this->fullname,
            'firstname' => $this->patient->firstname,
            'lastname' => $this->patient->lastname,
            'middlename' => $this->patient->middlename,
            'contact' => $this->patient->contact,
            'sex' => $this->patient->sex,
            'status' => $this->patient->status,
            'birth_date' => $this->patient->birth_date,
            'birth_place' => $this->patient->birth_place,
            'religion' => $this->patient->religion,
            'contact_person_name' => $this->patient->contact_person_name,
            'contact_person_number' => $this->patient->contact_person_number,
            'contact_person_relationship' => $this->patient->contact_person_relationship,
            'age' => $this->age,
            'year' => $this->created_at->format('Y'),
            'zone' => $this->patient->zone,
            'region' => $this->patient->regions->id,
            'province' => $this->patient->provinces->id,
            'municipality' => $this->patient->municipalities->id,
            'barangay' => $this->patient->barangays->id,
            'region_name' => $this->patient->regions->name,
            'province_name' => $this->patient->provinces->name,
            'municipality_name' => $this->patient->municipalities->name,
            'barangay_name' => $this->patient->barangays->name,
            'center_province' => $this->barangay_center->provinces->name,
            'center_municipality' => $this->barangay_center->municipalities->name,
            'center_barangay' => $this->barangay_center->barangays->name,
            'gravidity' => $this->gravidity,
            'parity' => $this->parity,
            'abortion' => $this->abortion,
            'lmp' => $this->lmp,
            'edc' => $this->edc,
            'pregnancy_status' => $pregnancy_status,
            'bemoc' => $this->bemoc,
            'bemoc_address' => $this->bemoc_address,
            'cemoc' => $this->cemoc,
            'cemoc_address' => $this->cemoc_address,
            'anc_given'  => $this->anc_given,
            'date_delivery' => $this->date_delivery,
            'outcome_sex'  => $this->outcome_sex,
            'outcome_weight'  => $this->outcome_weight,
            'place_of_delivery'  => $this->place_of_delivery,
            'attended_by'  => $this->attended_by,
            'phic'  => $this->phic,
            'patient_address' => $this->patient->address,
            'patient_short_address' => $this->patient->shortaddress,
            'nurse_name' => $this->nurse->fullname,
            'midwife_name' => $this->midwife->fullname,
            'doctor_name' => $this->doctor->fullname ?? '',
            'health_station' => $this->barangay_health_station ?? $this->barangay_center->health_station,
            'referral_unit' => $this->referral_unit ?? $this->barangay_center->rural_health_unit,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'risk_codes' => $this->whenLoaded('risk_codes', function () {
                return $this->risk_codes->map(function ($risk) {
                    return [
                        'risk_code'     => $risk->risk_code,
                        'date_detected' => $risk->date_detected ?? '',
                        'risk_status'   => $risk->risk_status,
                    ];
                });
            }),
        ];
    }
}
