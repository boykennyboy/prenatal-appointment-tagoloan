<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BarangayCenterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'health_station' => $this->health_station,
            'rural_health_unit' => $this->rural_health_unit,
            'address' => $this->address,
            'region' => $this->region,
            'province' => $this->province,
            'municipality' => $this->municipality,
            'barangay' => $this->barangay,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
