<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrenatalOutPatientValueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $referenceDate = Carbon::now();
        $lmp = Carbon::parse($this->pregnancy_tracking->lmp) ?? '';
        $days = (int) $lmp->diffInDays($referenceDate) % 7 ?? '';
        $weeks = (int) $lmp->diffInWeeks($referenceDate) ?? '';
        $aog = $days > 0 ? "{$weeks}w/{$days}d" : "{$weeks}w/0d";

        return [
            'temp' => $this->temp ?? '',
            'weight' => $this->weight ?? '',
            'rr' => $this->rr ?? '',
            'pr' => $this->pr ?? '',
            'two_sat' => $this->two_sat ?? '',
            'bp' => $this->bp ?? '',
            'aog' => $aog ?? '',
        ];
    }
}
