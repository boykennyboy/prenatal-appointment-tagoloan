<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrenatalOutPatientImmunizationRequest;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\CovidVaccine;
use App\Models\ImmuzitionRecord;
use App\Models\OtherVaccine;
use App\Models\OutPatient;
use App\Models\PregnancyTracking;
use App\Models\PrenatalVisit;
use App\Models\TetanusVaccine;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PrenatalOutPatientImmunizationController extends Controller
{
    public function store(StorePrenatalOutPatientImmunizationRequest $request)
    {
        $validated = $request->validated();

        $result = DB::transaction(function () use ($validated, $request) {

            $pregnancy_tracking = PregnancyTracking::with('doctor')
                ->where('id', $validated['pregnancy_tracking_id'])
                ->where('isDone', false)
                ->firstOrFail();

            $validated['attending_physician'] = $pregnancy_tracking->doctor->fullname;

            // Create Prenatal Visit
            $prenatal_visit = PrenatalVisit::create($validated);

            // Create Out Patient
            $out_patient = OutPatient::create($validated);

            $dailyCount = OutPatient::whereDate('created_at', now())->count();

            $fileNumber = now()->format('Y')
                . str_pad($dailyCount, 2, '0', STR_PAD_LEFT)
                . str_pad($out_patient->id, 3, '0', STR_PAD_LEFT);

            $out_patient->update([
                'file_number' => $fileNumber,
                'phic' => $pregnancy_tracking->phic ? 'yes' : 'no',
                'attending_physician' => $pregnancy_tracking->doctor->fullname,
            ]);

            // Log Out Patient Creation
            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Out Patient Created',
                'info' => [
                    'new' => $out_patient->only(['pregnancy_tracking_id', 'file_number', 'attending_physician'])
                ],
                'loggable_type' => OutPatient::class,
                'loggable_id' => $out_patient->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            // Log Prenatal Visit Creation
            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Prenatal Visit Created',
                'info' => [
                    'new' => $prenatal_visit->only(['pregnancy_tracking_id', 'attending_physician', 'date', 'time'])
                ],
                'loggable_type' => PrenatalVisit::class,
                'loggable_id' => $prenatal_visit->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            $hasImmunization = false;

            // Handle Immunization for Third Trimester Patients
            if ($pregnancy_tracking->pregnancy_status === 'third_trimester' && $request->hasVaccineData()) {
                $vaccineData = $request->getVaccineData();
                $vaccineIds = [];

                // Create Tetanus Vaccine if data exists
                if (!empty($vaccineData['tetanus'])) {
                    $tetanusVaccine = TetanusVaccine::create($vaccineData['tetanus']);
                    $vaccineIds['tetanus_vaccine_id'] = $tetanusVaccine->id;
                }

                // Create COVID Vaccine if data exists
                if (!empty($vaccineData['covid'])) {
                    $covidVaccine = CovidVaccine::create($vaccineData['covid']);
                    $vaccineIds['covid_vaccine_id'] = $covidVaccine->id;
                }

                // Create Other Vaccine if data exists
                if (!empty($vaccineData['other'])) {
                    $otherVaccine = OtherVaccine::create($vaccineData['other']);
                    $vaccineIds['other_vaccine_id'] = $otherVaccine->id;
                }

                // Create main Immunization Record
                $immunizationRecord = ImmuzitionRecord::create([
                    'pregnancy_tracking_id' => $vaccineData['pregnancy_tracking_id'],
                    'prenatal_visit_id' => $prenatal_visit->id, // Link to prenatal visit
                    'tetanus_vaccine_id' => $vaccineIds['tetanus_vaccine_id'] ?? null,
                    'covid_vaccine_id' => $vaccineIds['covid_vaccine_id'] ?? null,
                    'other_vaccine_id' => $vaccineIds['other_vaccine_id'] ?? null,
                ]);

                // Log Immunization Creation
                ActivityLogs::create([
                    'user_id' => Auth::id(),
                    'action' => 'create',
                    'title' => 'Immunization Record Created',
                    'info' => [
                        'new' => $immunizationRecord->only(['pregnancy_tracking_id', 'tetanus_vaccine_id', 'covid_vaccine_id', 'other_vaccine_id']),
                    ],
                    'loggable_type' => ImmuzitionRecord::class,
                    'loggable_id' => $immunizationRecord->id,
                    'ip_address' => $request->ip() ?? null,
                    'user_agent' => $request->header('User-Agent') ?? null,
                ]);

                $hasImmunization = true;
            }

            // Update Appointment Status
            $appointment = Appointment::where('pregnancy_tracking_id', $pregnancy_tracking->id)
                ->whereDate('appointment_date', Carbon::today())
                ->where('status', 'scheduled')
                ->first();

            if ($appointment) {
                $appointment->update(['status' => 'completed']);

                // Log Appointment Status Update
                ActivityLogs::create([
                    'user_id' => Auth::id(),
                    'action' => 'update',
                    'title' => 'Appointment Marked as Completed',
                    'info' => [
                        'old' => ['status' => 'scheduled'],
                        'new' => ['status' => 'completed']
                    ],
                    'loggable_type' => Appointment::class,
                    'loggable_id' => $appointment->id,
                    'ip_address' => $request->ip() ?? null,
                    'user_agent' => $request->header('User-Agent') ?? null,
                ]);
            }

            return [
                'prenatal_visit' => $prenatal_visit,
                'out_patient' => $out_patient,
                'has_immunization' => $hasImmunization,
                'appointment_completed' => $appointment ? true : false,
            ];
        });

        // Success message
        $message = 'Prenatal care recorded successfully!';

        if ($result['has_immunization']) {
            $message = 'Prenatal visit and immunization records saved successfully!';
        }

        return [
            'message' => $message,
        ];
    }

    public function update(StorePrenatalOutPatientImmunizationRequest $request, $id)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {

            $pregnancy_tracking = PregnancyTracking::with('doctor')
                ->where('id', $validated['pregnancy_tracking_id'])
                ->where('isDone', false)
                ->first();

            $prenatal_visit = PrenatalVisit::where('pregnancy_tracking_id', $validated['pregnancy_tracking_id'])
                ->latest()
                ->first();
            //Prenatal Visit
            if (!$pregnancy_tracking) {
                throw new \Exception('No active pregnancy tracking found.');
            }

            $validated['attending_physician'] = $pregnancy_tracking->doctor->fullname;

            $oldPrenatalData = $prenatal_visit->only(array_keys($validated));

            $prenatal_visit->update($validated);

            $prenatalChanges = $prenatal_visit->getChanges();
            $oldPrenatalDataFiltered = array_intersect_key($oldPrenatalData, $prenatalChanges);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Prenatal Visit Updated',
                'info' => [
                    'old' => $oldPrenatalDataFiltered,
                    'new' => $prenatalChanges,
                ],
                'loggable_type' => PrenatalVisit::class,
                'loggable_id' => $prenatal_visit->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            $out_patient = OutPatient::where('pregnancy_tracking_id', $validated['pregnancy_tracking_id'])
                ->latest()
                ->first();

            //Out Patient
            $oldOutPatientData = $out_patient->only(array_keys($validated));

            $out_patient->update(array_merge($validated, [
                'phic' => $pregnancy_tracking->phic ? 'yes' : 'no',
                'attending_physician' => $pregnancy_tracking->doctor->fullname,
            ]));

            $outpatientChanges = $out_patient->getChanges();

            $oldOutPatientDataFiltered = array_intersect_key($oldOutPatientData, $outpatientChanges);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Out Patient Created',
                'info' => [
                    'old' => $oldOutPatientDataFiltered,
                    'new' => $outpatientChanges,
                ],
                'loggable_type' => OutPatient::class,
                'loggable_id' => $out_patient->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });

        return [
            'message' => 'Prenatal care updated successfully!',
        ];
    }
}
