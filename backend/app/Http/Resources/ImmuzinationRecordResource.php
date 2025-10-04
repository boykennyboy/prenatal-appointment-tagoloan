<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImmuzinationRecordResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Count tetanus doses
        $tetanusLastVaccination = collect([
            $this->tetanus_vaccine->first_given ?? null,
            $this->tetanus_vaccine->second_given ?? null,
            $this->tetanus_vaccine->third_given ?? null,
            $this->tetanus_vaccine->fourth_given ?? null,
            $this->tetanus_vaccine->fifth_given ?? null,
        ])->filter();

        // Count covid doses
        $covidLastVaccination = collect([
            $this->covid_vaccine->first_given ?? null,
            $this->covid_vaccine->second_given ?? null,
            $this->covid_vaccine->booster_given ?? null,
        ])->filter();

        // Count other doses
        $otherLastVaccination = collect([
            $this->other_vaccine->first_given ?? null,
            $this->other_vaccine->second_given ?? null,
            $this->other_vaccine->third_given ?? null,
            $this->other_vaccine->fourth_given ?? null,
            $this->other_vaccine->fifth_given ?? null,
        ])->filter();


        $tetanus = $tetanusLastVaccination->max();
        $covid   = $covidLastVaccination->max();
        $other   = $otherLastVaccination->max();

        $combineWithTime = function ($date, $timeSource) {
            return $date ? Carbon::parse($date . ' ' . $timeSource->format('H:i:s')) : null;
        };

        $tetanusDateTime = $combineWithTime($tetanus, $this->updated_at);
        $covidDateTime   = $combineWithTime($covid, $this->updated_at);
        $otherDateTime   = $combineWithTime($other, $this->updated_at);

        return [
            'id' => $this->id,
            'created_at' => $this->created_at,
            'pregnancy_tracking_id' => $this->pregnancy_tracking_id,
            'tetanus_vaccine_id' => $this->tetanus_vaccine_id,
            'covid_vaccine_id' => $this->covid_vaccine_id,
            'other_vaccine_id' => $this->other_vaccine_id,

            'fullname' => $this->pregnancy_tracking->fullname,
            'patient_full_address' => $this->pregnancy_tracking->patient->fulladdress,
            'patient_address' => $this->pregnancy_tracking->patient->address,
            'age' => $this->pregnancy_tracking->age,

            // ✅ computed fields
            'tetanus_last_vaccine' => $tetanusDateTime
                ? $tetanusDateTime->diffForHumans()
                : 'No vaccination',
            'covid_last_vaccine' => $covidDateTime
                ? $covidDateTime->diffForHumans()
                : 'No vaccination',
            'other_last_vaccine' => $otherDateTime
                ? $otherDateTime->diffForHumans()
                : 'No vaccination',

            // ✅ tetanus fields
            'tetanus_first_given' => $this->tetanus_vaccine->first_given ?? '',
            'tetanus_second_given' => $this->tetanus_vaccine->second_given ?? '',
            'tetanus_third_given' => $this->tetanus_vaccine->third_given ?? '',
            'tetanus_fourth_given' => $this->tetanus_vaccine->fourth_given ?? '',
            'tetanus_fifth_given' => $this->tetanus_vaccine->fifth_given ?? '',

            'tetanus_first_comeback' => $this->tetanus_vaccine->first_comeback ?? '',
            'tetanus_second_comeback' => $this->tetanus_vaccine->second_comeback ?? '',
            'tetanus_third_comeback' => $this->tetanus_vaccine->third_comeback ?? '',
            'tetanus_fourth_comeback' => $this->tetanus_vaccine->fourth_comeback ?? '',
            'tetanus_fifth_comeback' => $this->tetanus_vaccine->fifth_comeback ?? '',

            // ✅ covid fields
            'covid_first_given' => $this->covid_vaccine->first_given ?? '',
            'covid_second_given' => $this->covid_vaccine->second_given ?? '',
            'covid_booster_given' => $this->covid_vaccine->booster_given ?? '',

            'covid_first_comeback' => $this->covid_vaccine->first_comeback ?? '',
            'covid_second_comeback' => $this->covid_vaccine->second_comeback ?? '',
            'covid_booster_comeback' => $this->covid_vaccine->booster_comeback ?? '',

            // ✅ other fields
            'other_vaccine_name' => $this->other_vaccine->vaccine_name ?? '',
            'other_first_given' => $this->other_vaccine->first_given ?? '',
            'other_second_given' => $this->other_vaccine->second_given ?? '',
            'other_third_given' => $this->other_vaccine->third_given ?? '',
            'other_fourth_given' => $this->other_vaccine->fourth_given ?? '',
            'other_fifth_given' => $this->other_vaccine->fifth_given ?? '',

            'other_first_comeback' => $this->other_vaccine->first_comeback ?? '',
            'other_second_comeback' => $this->other_vaccine->second_comeback ?? '',
            'other_third_comeback' => $this->other_vaccine->third_comeback ?? '',
            'other_fourth_comeback' => $this->other_vaccine->fourth_comeback ?? '',
            'other_fifth_comeback' => $this->other_vaccine->fifth_comeback ?? '',
        ];
    }
}
