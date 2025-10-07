<?php

namespace App\Http\Resources;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrenatalVisitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
            $appoinment = Appointment::where('pregnancy_tracking_id', $this->pregnancy_tracking_id)
            ->whereDate('appointment_date', $this->created_at)
            ->first();

        return [
            'id' => $this->id,
            'pregnancy_tracking_id' => $this->pregnancy_tracking_id,
            'fullname' => $this->pregnancy_tracking->fullname,
            'firstname' => $this->pregnancy_tracking->patient->firstname,
            'lastname' => $this->pregnancy_tracking->patient->lastname,
            'middlename' => $this->pregnancy_tracking->patient->middlename,
            'patient_address' => $this->pregnancy_tracking->patient->address,
            'age' => $this->pregnancy_tracking->patient->age,
            'birth_date' => $this->pregnancy_tracking->patient->birth_date,
            'barangay' => $this->pregnancy_tracking->patient->barangays->name,
            'zone' => $this->pregnancy_tracking->patient->zone,
            'municipality' => $this->pregnancy_tracking->patient->municipalities->name,
            'province' => $this->pregnancy_tracking->patient->provinces->name,
            'contact' => $this->pregnancy_tracking->patient->contact,
            'contact_person_name' => $this->pregnancy_tracking->patient->contact_person_name,
            'contact_person_number' => $this->pregnancy_tracking->patient->contact_person_number,
            'contact_person_relationship' => $this->pregnancy_tracking->patient->contact_person_relationship,
            'attending_physician' => $this->attending_physician,
            'date' => $this->date,
            'temp' => $this->temp,
            'weight' => $this->weight,
            'rr' => $this->rr,
            'pr' => $this->pr,
            'two_sat' => $this->two_sat,
            'bp' => $this->bp,
            'fht' => $this->fht,
            'fh' => $this->fh,
            'aog' => $this->aog,
            'term' => $this->term,
            'preterm' => $this->preterm,
            'post_term' => $this->post_term,
            'living_children' => $this->living_children,
            'lmp' => $this->pregnancy_tracking->lmp,
            'edc' => $this->pregnancy_tracking->edc,
            'gravidity' => $this->pregnancy_tracking->gravidity,
            'abortion' => $this->pregnancy_tracking->abortion,
            'attended_by' => $this->pregnancy_tracking->attended_by,
            'doctor_name' => $this->pregnancy_tracking->doctor->fullname,
            'pregnancy_status' => $appoinment->pregnancy_status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
