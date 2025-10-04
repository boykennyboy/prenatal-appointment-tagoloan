<?php

namespace App\Http\Controllers;

use App\Http\Resources\AppointmentResource;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PregnancyTracking;
use App\Services\AppointmentSchedulingService;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    protected $schedulingService;

    public function __construct(AppointmentSchedulingService $schedulingService)
    {
        $this->schedulingService = $schedulingService;
    }

    public function index(Request $request)
    {
        $search     = $request->input('search');
        $status     = $request->input('status');
        $priority   = $request->input('priority');
        $pregnancy_status   = $request->input('pregnancy_status');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);
        $report     = $request->input('report', false);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'appointment_date' => 'appointments.appointment_date',
            'created_at' => 'appointments.created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $appointments = Appointment::select('appointments.*')
            ->join('pregnancy_trackings', 'appointments.pregnancy_tracking_id', '=', 'pregnancy_trackings.id')
            ->with([
                'pregnancy_tracking',
                'pregnancy_tracking.patient',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('pregnancy_trackings.fullname', 'LIKE', "%{$search}%")
                        ->orWhere('pregnancy_trackings.pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('appointments.status', $status);
            })
            ->when($pregnancy_status, function ($query, $pregnancy_status) {
                $query->where('pregnancy_trackings.pregnancy_status', $pregnancy_status);
            })
            ->when($priority, function ($query, $priority) {
                $query->where('appointments.priority', $priority);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('appointments.appointment_date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('appointments.appointment_date', '<=', $dateTo);
            });

        if ($report) {
            $appointments = $appointments->orderBy($sortableColumns[$sortBy], 'asc');

            $results = $appointments->get();

            return [
                'data' => AppointmentResource::collection($results),
                'meta' => [
                    'total' => $results->count(),
                    'per_page' => $results->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ];
        } else {
            $appointments = $appointments->orderBy($sortableColumns[$sortBy], $sortDir);

            $results = $appointments->paginate($perPage);

            return [
                'data' => AppointmentResource::collection($results),
                'meta' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                ],
            ];
        }

        return [
            'data' => AppointmentResource::collection($appointments),
            'meta' => [
                'total' => $appointments->total(),
                'per_page' => $appointments->perPage(),
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
            ],
        ];
    }

    public function show(Appointment $qppointment) {}

    /**
     * Create a new appointment
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
            'appointment_date' => 'required|date|after:today',
            'priority' => 'required|in:high,medium,low',
            'visit_count' => 'integer|min:1',
            'doctor_id' => 'required',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            // Auto-calculate visit count if not provided
            if (!$request->has('visit_count')) {
                $visitCount = $this->schedulingService->getPatientVisitCount($request->pregnancy_tracking_id);
                $request->merge(['visit_count' => $visitCount]);
            }

            $appointment = $this->schedulingService->createAppointment($request->all());

            $pregnancy_tracking = PregnancyTracking::where('id', $request->pregnancy_tracking_id)->first();

            if (empty($pregnancy_tracking->attended_by)) {
                $pregnancy_tracking->update([
                    'attended_by' => $request->doctor_id,
                ]);
            }

            // Calculate pregnancy status based on LMP and appointment date
            if (!empty($pregnancy_tracking->lmp)) {
                $appointmentDate = Carbon::parse($request->appointment_date);
                $status = $this->calculatePregnancyStatus($pregnancy_tracking->lmp, $appointmentDate);
                $pregnancy_tracking->update(['pregnancy_status' => $status]);
                $appointment->update(['pregnancy_status' => $status]);
            }

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Appointment Created',
                'info' => [
                    'new' => $appointment->only(['pregnancy_tracking_id', 'appointment_date', 'priority', 'visit-count', 'pregnancy_status'])
                ],
                'loggable_type' => Appointment::class,
                'loggable_id' => $appointment->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            return response()->json([
                'message' => 'Appointment created successfully',
                'appointment' => $appointment,
                'assigned_time' => [
                    'start' => $appointment->start_time,
                    'end' => $appointment->end_time
                ]
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {

        $appointment_model = Appointment::findOrFail($id);

        $request->validate([
            'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
            'appointment_date' => [
                'required',
                'date',
                Rule::when(
                    $request->appointment_date != $appointment_model->appointment_date,
                    ['after_or_equal:today']
                ),
            ],
            'priority' => 'required|in:high,medium,low',
            'visit_count' => 'integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($request, $id) {
            $appointment = Appointment::findOrFail($id);

            // Store original values for comparison
            $old_pregnancy_tracking_id = $appointment->pregnancy_tracking_id;
            $oldDate = $appointment->appointment_date;
            $oldPriority = $appointment->priority;
            $oldVisitCount = $appointment->visit_count;

            $new_pregnancy_tracking_id = $request->pregnancy_tracking_id;
            $newDate = $request->appointment_date;
            $newPriority = $request->priority;
            $newVisitCount = $request->visit_count;

            // Calculate new priority score
            $newPriorityScore = $this->schedulingService->getPriorityScore($newVisitCount, $newPriority, $appointment->booking_timestamp);

            $hasDateChanged = $oldDate !== $newDate;
            $hasPriorityChanged = $oldPriority !== $newPriority || $oldVisitCount !== $newVisitCount;

            $oldData = $appointment->only(array_keys($request->all()));

            // Handle different update scenarios
            if ($hasDateChanged) {
                // Date is changing - check if target date is full
                $this->handleDateChange($appointment, $request, $oldDate, $newDate, $newPriorityScore);
            } else if ($hasPriorityChanged) {
                // Same date, priority changed - update and reorganize
                $appointment->update([
                    'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                    'priority' => $newPriority,
                    'visit_count' => $newVisitCount,
                    'notes' => $request->notes,
                    'priority_score' => $newPriorityScore
                ]);

                $this->schedulingService->reorganizeAppointments($oldDate);
            } else {
                // Only notes or pregnancy_tracking_id changed
                $appointment->update($request->only(['pregnancy_tracking_id', 'notes']));
            }

            $changes = $appointment->getChanges();

            $appointment = $appointment->fresh();

            $oldDataFiltered = array_intersect_key($oldData, $changes);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Appointment Updated',
                'info' => [
                    'old' => $oldDataFiltered,
                    'new' => $changes,
                ],
                'loggable_type' => Appointment::class,
                'loggable_id' => $appointment->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);

            if ($old_pregnancy_tracking_id !== $new_pregnancy_tracking_id) {
                $old_pregnancy_tracking = PregnancyTracking::find($old_pregnancy_tracking_id);

                // Clear attended_by
                if ($old_pregnancy_tracking->attended_by) {
                    $old_pregnancy_tracking->update([
                        'attended_by' => null,
                    ]);
                }

                // ✅ Old tracking status based on NOW
                if ($old_pregnancy_tracking->lmp) {
                    $status = $this->calculatePregnancyStatus($old_pregnancy_tracking->lmp, Carbon::now());
                    $old_pregnancy_tracking->update(['pregnancy_status' => $status]);
                }

                $new_pregnancy_tracking = PregnancyTracking::find($new_pregnancy_tracking_id);

                // Assign doctor if none
                if ($new_pregnancy_tracking->attended_by === null) {
                    $new_pregnancy_tracking->update([
                        'attended_by' => $request->doctor_id,
                    ]);
                }

                // ✅ New tracking status based on appointment_date
                if ($new_pregnancy_tracking->lmp) {
                    $appointmentDate = Carbon::parse($request->appointment_date);
                    $status = $this->calculatePregnancyStatus($new_pregnancy_tracking->lmp, $appointmentDate);
                    $new_pregnancy_tracking->update(['pregnancy_status' => $status]);
                    $appointment->update(['pregnancy_status' => $status]);
                }
            } else {
                $pregnancy_tracking = PregnancyTracking::find($old_pregnancy_tracking_id);

                // ✅ Same tracking, use appointment_date
                if ($pregnancy_tracking->lmp) {
                    $appointmentDate = Carbon::parse($request->appointment_date);
                    $status = $this->calculatePregnancyStatus($pregnancy_tracking->lmp, $appointmentDate);
                    $pregnancy_tracking->update(['pregnancy_status' => $status]);
                }
            }
        });

        return response()->json([
            'message' => 'Appointment updated successfully',
            // 'appointment' => $appointment,
            // 'changes' => [
            //     'date_changed' => $hasDateChanged,
            //     'priority_changed' => $hasPriorityChanged
            // ]
        ]);
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


    public function getAvailabilityByRange(Request $request): JsonResponse
    {
        $start = $request->input('start'); // YYYY-MM-DD
        $end = $request->input('end');     // YYYY-MM-DD
        $maxSlots = 5; // This is the max slot to display in the calendar

        // Get appointment counts
        $appointments = Appointment::selectRaw('DATE(appointment_date) as date, COUNT(*) as count')
            ->whereBetween('appointment_date', [$start, $end])
            ->groupBy('date')
            ->get();

        $availability = [];

        // Process existing appointments data
        foreach ($appointments as $day) {
            $remaining = max($maxSlots - $day->count, 0);
            $availability[$day->date] = [
                'appointments_count' => $day->count,
                'remaining_slots' => $remaining,
                'is_fully_booked' => $remaining === 0,
            ];
        }

        // Add doctors information for each date in the range
        $startDate = new DateTime($start);
        $endDate = new DateTime($end);
        $period = new DatePeriod($startDate, new DateInterval('P1D'), $endDate);

        foreach ($period as $date) {
            $dayName = strtolower($date->format('l')); // monday, tuesday, etc.
            $dateStr = $date->format('Y-m-d');

            // Skip weekends (no doctors assigned)
            if (in_array($dayName, ['saturday', 'sunday'])) {
                continue;
            }

            // Get doctors assigned to this day
            $doctors = Doctor::where('assigned_day', $dayName)
                ->get(['id', 'firstname', 'lastname'])
                ->map(function ($doctor) {
                    return [
                        'id' => $doctor->id,
                        'name' => $doctor->full_name
                    ];
                });

            // If we already have availability data for this date, add doctors
            if (isset($availability[$dateStr])) {
                $availability[$dateStr]['doctors'] = $doctors;
            } else {
                // If no appointments exist for this date, create availability entry
                $availability[$dateStr] = [
                    'appointments_count' => 0,
                    'remaining_slots' => $maxSlots,
                    'is_fully_booked' => false,
                    'doctors' => $doctors
                ];
            }
        }

        return response()->json($availability);
    }


    /**
     * Handle appointment date change with rescheduling logic
     */
    private function handleDateChange($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Check if new date is available (excluding current appointment)
        $currentAppointmentsOnNewDate = Appointment::forDate($newDate)
            ->where('id', '!=', $appointment->id)
            ->scheduled()
            ->count();

        // If new date is not full, proceed normally
        if ($currentAppointmentsOnNewDate < $this->schedulingService::MAX_SLOTS_PER_DAY) {
            $appointment->update([
                'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                'appointment_date' => $newDate,
                'priority' => $request->priority,
                'visit_count' => $request->visit_count,
                'notes' => $request->notes,
                'priority_score' => $newPriorityScore
            ]);

            // Reorganize both old and new dates
            $this->schedulingService->reorganizeAppointments($newDate);
            if ($oldDate !== $newDate) {
                $this->schedulingService->reorganizeAppointments($oldDate);
            }
            return;
        }

        // New date is full - handle rescheduling
        $this->handleFullDateUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
    }

    /**
     * Handle updating to a full date with automatic rescheduling
     */
    private function handleFullDateUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Get the lowest priority appointment on the target date (excluding current appointment)
        $lowestPriorityAppointment = Appointment::forDate($newDate)
            ->where('id', '!=', $appointment->id)
            ->scheduled()
            ->orderBy('priority_score')
            ->orderByDesc('booking_timestamp') // For same priority, later bookings get moved first
            ->first();

        Log::info("Get Lowest Priority Appointment Id: {$lowestPriorityAppointment->id}");

        Log::info("Priority Score Comparison: {$newPriorityScore} compare to {$lowestPriorityAppointment->priority_score}");
        // Compare priorities
        if ($newPriorityScore > $lowestPriorityAppointment->priority_score) {
            // New appointment has higher priority - reschedule the lowest priority one
            $this->rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore);
        } else if ($newPriorityScore === $lowestPriorityAppointment->priority_score) {
            // Same priority - check booking_timestamp (who booked first gets preference)
            $updatedBookingTime = $appointment->booking_timestamp;
            $existingBookingTime = $lowestPriorityAppointment->booking_timestamp;

            Log::info("Bookign Timestamp Comparison: {$updatedBookingTime} compare to {$existingBookingTime}");

            if ($updatedBookingTime < $existingBookingTime) {
                // Updated appointment was booked earlier, so it gets the slot
                $this->rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore);
            } else {
                // Updated appointment was booked later - find alternative for it
                $this->findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
            }
        } else {
            // New appointment has lower priority - find alternative for it
            $this->findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
        }
    }

    /**
     * Reschedule lowest priority appointment and update current one to target date
     */
    private function rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore)
    {
        // Find nearest available date for the lowest priority appointment
        $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate);


        if (!$nearestDate) {
            // Try including old date as fallback
            $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate, [$oldDate]);
        }

        if (!$nearestDate) {
            throw new Exception('Cannot update appointment: No available dates found for rescheduling existing appointments.');
        }

        // Move the lowest priority appointment
        $lowestPriorityAppointment->update([
            'appointment_date' => $nearestDate
        ]);

        // Update the current appointment to the target date
        $appointment->update([
            'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
            'appointment_date' => $newDate,
            'priority' => $request->priority,
            'visit_count' => $request->visit_count,
            'notes' => $request->notes,
            'priority_score' => $newPriorityScore
        ]);

        // Reorganize all affected dates
        $this->schedulingService->reorganizeAppointments($newDate);
        $this->schedulingService->reorganizeAppointments($nearestDate);
        if ($oldDate !== $newDate && $oldDate !== $nearestDate) {
            $this->schedulingService->reorganizeAppointments($oldDate);
        }

        // Log the rescheduling
        Log::info("Update: Appointment ID {$lowestPriorityAppointment->id} rescheduled from {$newDate} to {$nearestDate} due to higher priority update");
    }

    /**
     * Find alternative date for the updated appointment
     */
    private function findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Find nearest available date for the updated appointment
        $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate, [$oldDate]);

        if (!$nearestDate) {
            // No alternative found - keep on original date but update other fields
            $appointment->update([
                'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                'priority' => $request->priority,
                'visit_count' => $request->visit_count,
                'notes' => $request->notes,
                'priority_score' => $newPriorityScore
                // appointment_date remains unchanged
            ]);

            $this->schedulingService->reorganizeAppointments($oldDate);

            throw new Exception("The selected date ({$newDate}) is fully booked with higher priority appointments. Appointment details updated but date remains {$oldDate}.");
        }

        // Update appointment to the nearest available date
        $appointment->update([
            'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
            'appointment_date' => $nearestDate,
            'priority' => $request->priority,
            'visit_count' => $request->visit_count,
            'notes' => $request->notes,
            'priority_score' => $newPriorityScore
        ]);

        // Reorganize both dates
        $this->schedulingService->reorganizeAppointments($nearestDate);
        if ($oldDate !== $nearestDate) {
            $this->schedulingService->reorganizeAppointments($oldDate);
        }

        throw new Exception("The selected date ({$newDate}) was full. Your appointment has been updated and moved to {$nearestDate} instead.");
    }

    /**
     * Cancel appointment
     */
    public function cancel($id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $date = $appointment->appointment_date;

            $appointment->update(['status' => 'cancelled']);

            // Reorganize remaining appointments
            $this->schedulingService->reorganizeAppointments($date);

            return response()->json(['message' => 'Appointment cancelled successfully']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
