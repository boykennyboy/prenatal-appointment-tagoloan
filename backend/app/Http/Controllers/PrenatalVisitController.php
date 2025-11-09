<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrenatalOutPatientValueResource;
use App\Http\Resources\PrenatalVisitResource;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\OutPatient;
use App\Models\PregnancyTracking;
use App\Models\PrenatalVisit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PrenatalVisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);
        $report     = $request->input('report', false);
        $start_date = $request->input('start_date', null);
        $end_date   = $request->input('end_date', null);

        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'date' => 'preantal_visits.date',
            'age' => 'patients.age',
            'created_at' => 'prenatal_visits.created_at',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'prenatal_visits.created_at';

        $prenatal_visits = PrenatalVisit::select('prenatal_visits.*')
            ->join('pregnancy_trackings', 'pregnancy_trackings.id', '=', 'prenatal_visits.pregnancy_tracking_id')
            ->whereIn('prenatal_visits.id', function ($query) {
                $query->select(DB::raw('MAX(id)'))
                    ->from('prenatal_visits')
                    ->groupBy('pregnancy_tracking_id');
            })
            ->with([
                'pregnancy_tracking',
                'pregnancy_tracking.doctor',
                'pregnancy_tracking.patient',
                'pregnancy_tracking.patient.barangays',
                'pregnancy_tracking.patient.municipalities',
                'pregnancy_tracking.patient.provinces',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where("pregnancy_trackings.fullname", 'LIKE', "%{$search}%")
                        ->orWhere('pregnancy_trackings.pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('prenatal_visits.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('prenatal_visits.created_at', '<=', $dateTo);
            })
            ->when($start_date, function ($query, $start_date) {
                $query->whereDate('prenatal_visits.created_at', '>=', $start_date);
            })
            ->when($end_date, function ($query, $end_date) {
                $query->whereDate('prenatal_visits.created_at', '<=', $end_date);
            });


        if ($report) {
            $prenatal_visits = $prenatal_visits->orderBy($sortBy, 'asc');

            $results = $prenatal_visits->get();

            return [
                'data' => PrenatalVisitResource::collection($results),
                'meta' => [
                    'total' => $results->count(),
                    'per_page' => $results->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ];
        } else {
            $prenatal_visits = $prenatal_visits->orderBy($sortBy, $sortDir);

            $results = $prenatal_visits->paginate($perPage);

            return [
                'data' => PrenatalVisitResource::collection($results),
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
    public function store(Request $request)
    {
        $fields = $request->validate([
            'pregnancy_tracking_id'  => 'required|exists:pregnancy_trackings,id',
            'date'        => 'required|date',
            'weight'      => 'required',
            'bp'          => 'required',
            'temp'        => 'required',
            'rr'          => 'required',
            'pr'          => 'required',
            'two_sat'     => 'required',
            'fht'         => 'required',
            'fh'          => 'required',
            'aog'         => 'required',
            'term'        => 'required',
            'preterm'     => 'required',
            'post_term'   => 'required',
            'living_children' => 'required',
        ]);

        DB::transaction(function () use ($fields, $request) {

            $pregnancy_tracking = PregnancyTracking::with('doctor')
                ->where('id', $fields['pregnancy_tracking_id'])
                ->where('isDone', false)
                ->first();

            $fields['attending_physician'] = $pregnancy_tracking->doctor->fullname;

            $prenatal_visit = PrenatalVisit::create($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Prenatal Visit Created',
                'info' => [
                    'new' => $prenatal_visit->only(['pregnancy_tracking_id', 'attending_physician'])
                ],
                'loggable_type' => PrenatalVisit::class,
                'loggable_id' => $prenatal_visit->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            $appointment = Appointment::where('pregnancy_tracking_id', $pregnancy_tracking->id)
                ->whereDate('appointment_date', Carbon::today())
                ->first();

            if ($appointment) {
                $has_outpatient_today = OutPatient::where('pregnancy_tracking_id', $pregnancy_tracking->id)
                    ->whereDate('created_at', $appointment->appointment_date)
                    ->exists();

                if ($appointment->status === 'scheduled' && $has_outpatient_today) {
                    $appointment->update(['status' => 'completed']);

                    ActivityLogs::create([
                        'user_id' => Auth::id(),
                        'action' => 'update',
                        'title' => 'Appointment Status Updated',
                        'info' => [
                            'new' => $appointment->only(['pregnancy_tracking_id', 'status'])
                        ],
                        'loggable_type' => Appointment::class,
                        'loggable_id' => $appointment->id,
                        'ip_address' => $request->ip() ?? null,
                        'user_agent' => $request->header('User-Agent') ?? null,
                    ]);
                }
            }
        });


        return [
            'message' => 'Prenatal visit created successfully!',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $prenatal_visit = PrenatalVisit::with('pregnancy_tracking')
            ->where('pregnancy_tracking_id', $id)
            ->whereDate('created_at', Carbon::today())
            ->first();

        if ($prenatal_visit) {
            return ['data' => new PrenatalOutPatientValueResource($prenatal_visit)];
        }

        return [
            'data' => [
                'temp'    => '',
                'weight'  => '',
                'rr'      => '',
                'pr'      => '',
                'two_sat' => '',
                'bp'      => '',
                'aog'     => '',
            ]
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PrenatalVisit $prenatal_visit)
    {
        $fields = $request->validate([
            'pregnancy_tracking_id'  => 'required|exists:pregnancy_trackings,id',
            'date'        => 'required|date',
            'weight'      => 'required',
            'bp'          => 'required',
            'temp'        => 'required',
            'rr'          => 'required',
            'pr'          => 'required',
            'two_sat'     => 'required',
            'fht'         => 'required',
            'fh'          => 'required',
            'aog'         => 'required',
            'term'        => 'required',
            'preterm'     => 'required',
            'post_term'   => 'required',
            'living_children' => 'required',
        ]);


        DB::transaction(function () use ($fields, $prenatal_visit, $request) {

            $old_pregnancy_tracking_id = $prenatal_visit->pregnancy_tracking_id;

            $pregnancy_tracking = PregnancyTracking::with('doctor')
                ->where('id', $fields['pregnancy_tracking_id'])
                ->where('isDone', false)
                ->first();

            if (!$pregnancy_tracking) {
                throw new \Exception('No active pregnancy tracking found.');
            }

            $fields['attending_physician'] = $pregnancy_tracking->doctor->fullname;

            $oldData = $prenatal_visit->only(array_keys($fields));

            $prenatal_visit->update($fields);

            $changes = $prenatal_visit->getChanges();
            $oldDataFiltered = array_intersect_key($oldData, $changes);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Prenatal Visit Updated',
                'info' => [
                    'old' => $oldDataFiltered,
                    'new' => $changes,
                ],
                'loggable_type' => PrenatalVisit::class,
                'loggable_id' => $prenatal_visit->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            $old_appointment = Appointment::where('pregnancy_tracking_id', $old_pregnancy_tracking_id)
                ->whereDate('appointment_date', Carbon::today())
                ->first();

            $new_appointment = Appointment::where('pregnancy_tracking_id', $pregnancy_tracking->id)
                ->whereDate('appointment_date', Carbon::today())
                ->first();

            // ✅ Check if there is an OutPatient record today for the new pregnancy_tracking
            $hasOutPatientToday = OutPatient::where('pregnancy_tracking_id', $pregnancy_tracking->id)
                ->whereDate('created_at', Carbon::today())
                ->exists();

            if ($old_pregnancy_tracking_id !== $pregnancy_tracking->id) {
                // revert old appointment back to scheduled
                if ($old_appointment && $old_appointment->status === 'completed') {
                    $old_appointment->update(['status' => 'scheduled']);
                }

                // complete new appointment only if outpatient record exists
                if ($new_appointment && $hasOutPatientToday) {
                    $new_appointment->update(['status' => 'completed']);

                    ActivityLogs::create([
                        'user_id' => Auth::id(),
                        'action' => 'update',
                        'title' => 'Appointment Status Updated',
                        'info' => [
                            'old' => $old_appointment?->only(['pregnancy_tracking_id', 'status']) ?? 'N/A',
                            'new' => $new_appointment->only(['pregnancy_tracking_id', 'status'])
                        ],
                        'loggable_type' => Appointment::class,
                        'loggable_id' => $new_appointment->id,
                        'ip_address' => $request->ip() ?? null,
                        'user_agent' => $request->header('User-Agent') ?? null,
                    ]);
                }
            } else {
                // pregnancy tracking did not change
                if ($new_appointment && $hasOutPatientToday) {
                    $new_appointment->update(['status' => 'completed']);

                    ActivityLogs::create([
                        'user_id' => Auth::id(),
                        'action' => 'update',
                        'title' => 'Appointment Status Updated',
                        'info' => [
                            'new' => $new_appointment->only(['pregnancy_tracking_id', 'status'])
                        ],
                        'loggable_type' => Appointment::class,
                        'loggable_id' => $new_appointment->id,
                        'ip_address' => $request->ip() ?? null,
                        'user_agent' => $request->header('User-Agent') ?? null,
                    ]);
                }
            }
        });


        return [
            'message' => 'Prenatal visit updated successfully!',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PrenatalVisit $prenatalVisit)
    {
        //
    }

    public function getGroupPrenatalVisit($pregnancy_tracking_id)
    {
        $prenatal_visits = PrenatalVisit::query()
            ->with([
                'pregnancy_tracking',
                'pregnancy_tracking.doctor',
                'pregnancy_tracking.patient',
                'pregnancy_tracking.patient.barangays',
                'pregnancy_tracking.patient.municipalities',
                'pregnancy_tracking.patient.provinces',
            ])
            ->where('pregnancy_tracking_id', $pregnancy_tracking_id)
            ->get();

        return [
            'data' => PrenatalVisitResource::collection($prenatal_visits),
        ];
    }
}
