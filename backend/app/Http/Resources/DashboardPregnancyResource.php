<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardPregnancyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        // Check if patient has an appointment
        $hasAppointment = $this->appointments()->exists();
        // assuming PregnancyTracking has relation ->appointments()

        return [
            'id' => $this->id,
            'patient_name' => $this->fullname,
            'referral_unit' => $this->referral_unit,
            'health_station' => $this->barangay_center->health_station,
            'created_at' => Carbon::parse($this->appointment_date)->format('m/d/Y'),

            'status' => $user && $user->id === 2
                ? ($hasAppointment ? 'accepted' : 'pending')
                : $this->pregnancy_status,
        ];
    }
}
