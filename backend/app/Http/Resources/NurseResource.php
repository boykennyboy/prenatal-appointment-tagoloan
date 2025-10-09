<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NurseResource extends JsonResource
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
            'fullname' => $this->fullname,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'barangay_center_id' => $this->barangay_center_id,
            'health_station' => $this->barangay_center->health_station,
            'address' => $this->barangay_center->address,
            'license_number' => $this->license_number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
