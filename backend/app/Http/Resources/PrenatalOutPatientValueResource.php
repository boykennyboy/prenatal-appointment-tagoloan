<?php

namespace App\Http\Resources;

use App\Models\PregnancyTracking;
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

        $pregnancyTracking = PregnancyTracking::where('id', $this->pregnancy_tracking_id)
            ->where('isDone', false)
            ->where('pregnancy_status', '!=', 'miscarriage_abortion')
            ->where('pregnancy_status', '!=', 'discontinued')
            ->first();

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
            'gravidity' => $pregnancyTracking->gravidity,
            'pregnancy_status' => $pregnancyTracking->pregnancy_status,
            'aog' => $aog ?? '',
        ];
    }
}
