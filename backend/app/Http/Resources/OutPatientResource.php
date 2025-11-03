<?php

namespace App\Http\Resources;

use App\Models\PrenatalVisit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutPatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {

        $prenatal_visit = PrenatalVisit::where('pregnancy_tracking_id', $this->pregnancy_tracking_id)
            ->latest()
            ->first();

        return [
            'id' => $this->id,
            'pregnancy_tracking_id' => $this->pregnancy_tracking_id,
            'file_number' => $this->file_number,
            'fullname' => $this->pregnancy_tracking->fullname,
            'firstname' => $this->pregnancy_tracking->patient->firstname,
            'lastname' => $this->pregnancy_tracking->patient->lastname,
            'middlename' => $this->pregnancy_tracking->patient->middlename,
            'zone' => $this->pregnancy_tracking->patient->zone,
            'patient_address' => $this->pregnancy_tracking->patient->address,
            'full_address' => $this->pregnancy_tracking->patient->full_address,
            'age' => $this->pregnancy_tracking->patient->age,
            'sex' => $this->pregnancy_tracking->patient->sex,
            'status' => $this->pregnancy_tracking->patient->status,
            'religion' => $this->pregnancy_tracking->patient->religion,
            'birth_date' => $this->pregnancy_tracking->patient->birth_date,
            'birth_place' => $this->pregnancy_tracking->patient->birth_place,
            'contact' => $this->pregnancy_tracking->patient->contact,
            'contact_person_name' => $this->pregnancy_tracking->patient->contact_person_name,
            'contact_person_number' => $this->pregnancy_tracking->patient->contact_person_number,
            'contact_person_relationship' => $this->pregnancy_tracking->patient->contact_person_relationship,
            'attending_physician' => $this->pregnancy_tracking->doctor->fullname,
            'doctor_name' => $this->pregnancy_tracking->doctor->fullname,
            'phic' => $this->pregnancy_tracking->phic ? 'Yes' : 'No',
            'date' => $this->date,
            'time' => $this->time,
            'temp' => $this->temp,
            'weight' => $this->weight,
            'height' => $this->height,
            'rr' => $this->rr,
            'pr' => $this->pr,
            'two_sat' => $this->two_sat,
            'bp' => $this->bp,
            'fht' => $prenatal_visit->fht,
            'fh' => $prenatal_visit->fh,
            'aog' => $prenatal_visit->aog,
            'term' => $prenatal_visit->term,
            'preterm' => $prenatal_visit->preterm,
            'post_term' => $prenatal_visit->post_term,
            'living_children' => $prenatal_visit->living_children,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
