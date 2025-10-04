<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pregnancy_tracking_id' => $this->pregnancy_tracking_id,
            'fullname' => $this->pregnancy_tracking->fullname,
            'appointment_date' => $this->appointment_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'priority' => $this->priority,
            'status' => $this->status,
            'visit_count' => $this->visit_count,
            'doctor_id' => $this->pregnancy_tracking->attended_by,
            'notes' => $this->notes,
            'contact' => $this->pregnancy_tracking->patient->contact ?? '',
            'pregnancy_status' => $this->pregnancy_status ?? '',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
