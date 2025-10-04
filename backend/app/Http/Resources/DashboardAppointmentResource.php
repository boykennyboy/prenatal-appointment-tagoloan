<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardAppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $appointmentDate = Carbon::parse($this->appointment_date);

        if ($appointmentDate->isToday()) {
            $displayDate = 'Today';
        } elseif ($appointmentDate->isTomorrow()) {
            $displayDate = 'Tomorrow';
        } else {
            $displayDate = $appointmentDate->format('M j'); // e.g. Sep 25
        }

        return [
            'id' => $this->id,
            'patient_name' => $this->pregnancy_tracking->fullname,
            'appointment_date' => $displayDate,
            'status' => $this->pregnancy_status,
        ];
    }
}
