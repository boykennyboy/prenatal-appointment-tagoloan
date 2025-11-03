<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetAddressesNameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'barangay_name' => $this->barangay_name,
            'municipality_name' => $this->municipality_name,
            'province_name' => $this->province_name,
            'region_name' => $this->region_name,
            'barangay_center_id' => $this->barangay_center_id,
            'barangay_health_station' => $this->barangay_health_station,
        ];
    }
}
