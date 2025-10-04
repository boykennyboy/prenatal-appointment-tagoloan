<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePregnancyTrackingRequest;
use App\Http\Resources\PregnancyTrackingResource;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\BarangayCenter;
use App\Models\Patient;
use App\Models\PregnancyTracking;
use App\Models\RiskCode;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PregnancyTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $dateFrom   = $request->input('date_from');
        $category   = $request->input('category');
        $status     = $request->input('status');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);
        $report     = $request->input('report', false);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'age' => 'pregnancy_trackings.age',
            'created_at' => 'pregnancy_trackings.created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $user = Auth::user();

        $pregnancy_trackings = PregnancyTracking::with([
            'patient',
            'patient.barangays',
            'patient.municipalities',
            'patient.provinces',
            'midwife',
            'nurse',
            'risk_codes',
            'barangay_center',
            'doctor',
        ])
            ->when($user->role_id === 2, function ($query) use ($user) {
                $query->where('pregnancy_trackings.barangay_center_id', $user->barangay_center_id);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('pregnancy_trackings.fullname', 'LIKE', "%{$search}%")
                        ->orWhere('pregnancy_trackings.pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('pregnancy_trackings.barangay_center_id', $category);
            })
            ->when($status, function ($query, $status) {
                $query->where('pregnancy_trackings.pregnancy_status', $status);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('pregnancy_trackings.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('pregnancy_trackings.created_at', '<=', $dateTo);
            });



        if ($report) {
            $pregnancy_trackings = $pregnancy_trackings->orderBy($sortableColumns[$sortBy], 'asc');

            $results = $pregnancy_trackings->get();

            return [
                'data' => PregnancyTrackingResource::collection($results),
                'meta' => [
                    'total' => $results->count(),
                    'per_page' => $results->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ];
        } else {
            $pregnancy_trackings = $pregnancy_trackings->orderBy($sortableColumns[$sortBy], $sortDir);

            $results = $pregnancy_trackings->paginate($perPage);

            return [
                'data' => PregnancyTrackingResource::collection($results),
                'meta' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                ],
            ];
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePregnancyTrackingRequest $request)
    {
        $fields = $request->validated();
        $patientType = $request->input('patient_type');
        $fields['age'] = Carbon::parse($fields['birth_date'])->age;

        $pregnancy_tracking = DB::transaction(function () use ($fields, $patientType, $request) {
            if ($patientType === 'new') {
                $patient = Patient::create(array_merge($fields, [
                    'address' => 'n/a',
                ]));
                $fields['patient_id'] = $patient->id;

                $address = collect([
                    $patient->zone,
                    optional($patient->barangays)->name,
                    optional($patient->municipalities)->name,
                    optional($patient->provinces)->name,
                ])->filter()->implode(', ');


                $patient->update([
                    'address' => $address,
                ]);

                ActivityLogs::create([
                    'user_id' => Auth::id(),
                    'action' => 'create',
                    'title' => 'Patient Created',
                    'info' => [
                        'new' => $patient->only(['firstname', 'lastname', 'age', 'birth_date', 'address']),
                    ],
                    'loggable_type' => Patient::class,
                    'loggable_id' => $patient->id,
                    'ip_address' => $request->ip() ?? null,
                    'user_agent' => $request->header('User-Agent') ?? null,
                ]);

                $health_station = BarangayCenter::find($fields['barangay_center_id']);

                $fields['fullname'] = $patient->fullname;
                $fields['barangay_health_station'] = $health_station?->health_station;
            }

            $pregnancy_tracking = PregnancyTracking::create($fields);

            // Generate unique number after creation
            $dailyCount = PregnancyTracking::whereDate('created_at', now())->count();
            $pregnancy_tracking_number = now()->format('Y')
                . str_pad($dailyCount, 2, '0', STR_PAD_LEFT)
                . str_pad($pregnancy_tracking->id, 3, '0', STR_PAD_LEFT);

            if (!empty($pregnancy_tracking->lmp)) {
                $status = $this->calculatePregnancyStatus($pregnancy_tracking->lmp, Carbon::now());
                $pregnancy_tracking->update([
                    'pregnancy_status' => $status,
                    'pregnancy_tracking_number' => $pregnancy_tracking_number,
                ]);
            } else {
                $pregnancy_tracking->update([
                    'pregnancy_tracking_number' => $pregnancy_tracking_number,
                ]);
            }

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Pregnancy Tracking Created',
                'info' => [
                    'new' => $pregnancy_tracking->only(['pregnancy_tracking_number', 'patient_id', 'fullname', 'age', 'pregnancy_status']),
                ],
                'loggable_type' => PregnancyTracking::class,
                'loggable_id' => $pregnancy_tracking->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            // Risk codes inside transaction
            foreach ($fields['risk_codes'] ?? [] as $risk) {
                if (!empty($risk['risk_code'])) {
                    RiskCode::create([
                        'pregnancy_tracking_id' => $pregnancy_tracking->id,
                        'risk_code' => $risk['risk_code'] ?? null,
                        'date_detected' => $risk['date_detected'] ?? null,
                    ]);
                }
            }

            return $pregnancy_tracking;
        });

        return [
            'data' => new PregnancyTrackingResource($pregnancy_tracking),
            'message' => 'Pregnancy Tracking created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(PregnancyTracking $pregnancyTracking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePregnancyTrackingRequest $request, PregnancyTracking $pregnancyTracking)
    {
        $fields = $request->validated();
        $patientType = $request->input('patient_type');
        $fields['age'] = Carbon::parse($fields['birth_date'])->age;
        $pregnancy_tracking = DB::transaction(function () use ($fields, $patientType, $pregnancyTracking, $request) {
            if ($patientType === 'edit') {
                $patient = Patient::findOrFail($fields['patient_id']);

                $oldData = $patient->only(array_keys($fields));

                $patient->update($fields);

                $changes = $patient->getChanges();

                $oldDataFiltered = array_intersect_key($oldData, $changes);

                $address = "{$patient->zone}, {$patient->barangays->name} {$patient->municipalities->name}, {$patient->provinces->name}";
                $patient->update(['address' => $address]);

                ActivityLogs::create([
                    'user_id' => Auth::id(),
                    'action' => 'update',
                    'title' => 'Patient Updated',
                    'info' => [
                        'old' => $oldDataFiltered,
                        'new' => $changes,
                    ],
                    'loggable_type' => Patient::class,
                    'loggable_id' => $patient->id,
                    'ip_address' => $request->ip() ?? null,
                    'user_agent' => $request->header('User-Agent') ?? null,
                ]);

                $health_station = BarangayCenter::findOrFail($fields['barangay_center_id']);

                $fields['fullname'] = $patient->fullname;
                $fields['barangay_health_station'] = $health_station->health_station;
            }

            $oldPregnancyData = $pregnancyTracking->only(array_keys($fields));

            if (!empty($pregnancyTracking->lmp)) {
                $status = $this->calculatePregnancyStatus($pregnancyTracking->lmp, Carbon::now());
                $fields['pregnancy_status'] = $status;
            }
            // update the record
            $pregnancyTracking->update($fields);

            $changes = $pregnancyTracking->getChanges();

            $oldPregnancyDataFiltered = array_intersect_key($oldPregnancyData, $changes);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Pregnancy Tracking Updated',
                'info' => [
                    'old' => $oldPregnancyDataFiltered,
                    'new' => $changes,
                ],
                'loggable_type' => PregnancyTracking::class,
                'loggable_id' => $pregnancyTracking->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            $pregnancyTracking->risk_codes()->delete();

            foreach ($fields['risk_codes'] ?? [] as $risk) {
                if (!empty($risk['risk_code'])) {
                    RiskCode::create([
                        'pregnancy_tracking_id' => $pregnancyTracking->id,
                        'risk_code' => $risk['risk_code'] ?? null,
                        'date_detected' => $risk['date_detected'] ?? null,
                    ]);
                }
            }

            // return the model itself
            return $pregnancyTracking;
        });

        return [
            'data' => new PregnancyTrackingResource($pregnancy_tracking),
            'message' => 'Pregnancy Tracking created successfully',
        ];
    }

    private function calculatePregnancyStatus(string $lmp, Carbon $referenceDate): string
    {
        $lmp = Carbon::parse($lmp);
        $weeks = $lmp->diffInWeeks($referenceDate);

        if ($weeks <= 12) {
            return 'first_trimester';
        } elseif ($weeks <= 27) {
            return 'second_trimester';
        } elseif ($weeks <= 40) {
            return 'third_trimester';
        }
        return 'postpartum';
    }

    public function update_pregnancy(Request $request, PregnancyTracking $pregnancy_tracking)
    {
        $fields = $request->validate([
            'outcome_sex' => 'required',
            'outcome_weight' => 'required',
            'place_of_delivery' => 'required|string|max:255',
            'date_delivery' => 'required|date|max:255',
            'phic' => 'required',
        ]);

        DB::transaction(function () use ($request, $pregnancy_tracking, $fields) {
            $oldPregnancyData = $pregnancy_tracking->only(['pregnancy_tracking_number', 'patient_id', 'fullname', 'age', 'pregnancy_status', 'anc_given']);

            $pregnancy_tracking->update(array_merge($fields, [
                "isDone" => true,
                'pregnancy_status' => 'completed',
                'anc_given' => 1,
            ]));

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Complete Pregnancy Tracking Updated',
                'info' => [
                    'old' => $oldPregnancyData,
                    'new' => $pregnancy_tracking->only(['pregnancy_tracking_number', 'patient_id', 'fullname', 'age', 'pregnancy_status', 'anc_given']),
                ],
                'loggable_type' => PregnancyTracking::class,
                'loggable_id' => $pregnancy_tracking->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });


        return [
            'message' => 'Pregnancy Tracking updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PregnancyTracking $pregnancyTracking)
    {
        //
    }
}
