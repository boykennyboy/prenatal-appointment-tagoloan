<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardAppointmentResource;
use App\Http\Resources\DashboardPregnancyResource;
use App\Models\Appointment;
use App\Models\PregnancyTracking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Build base query with user filter
        $baseQuery = PregnancyTracking::query()
            ->when($user && $user->role_id === 2, function ($query) use ($user) {
                $query->where('pregnancy_trackings.barangay_center_id', $user->barangay_center_id);
            })
            ->when($user->role_id !== 2, function ($query) use ($user) {
                $query->whereHas('risk_codes');
            });

        // Get accurate counts using separate queries to avoid JOIN multiplication
        $stats = [
            'total_patients' => (clone $baseQuery)->distinct('patient_id')->count('patient_id'),
            'total_pregnancy_tracking' => (clone $baseQuery)->count(),
            'total_completed' => (clone $baseQuery)->where('pregnancy_status', 'completed')->count(),
            'total_third_trimester' => (clone $baseQuery)->where('pregnancy_status', 'third_trimester')->count(),
            'total_second_trimester' => (clone $baseQuery)->where('pregnancy_status', 'second_trimester')->count(),
            'total_first_trimester' => (clone $baseQuery)->where('pregnancy_status', 'first_trimester')->count(),
        ];

        $pregnancyTrackingIds = (clone $baseQuery)->pluck('id');

        $stats['total_appointments'] = Appointment::whereIn('pregnancy_tracking_id', $pregnancyTrackingIds)->count();
        $stats['total_immunization'] = DB::table('immuzition_records')->whereIn('pregnancy_tracking_id', $pregnancyTrackingIds)->count();
        $stats['total_prenatal_visit'] = DB::table('prenatal_visits')->whereIn('pregnancy_tracking_id', $pregnancyTrackingIds)->count();
        $stats['total_out_patients'] = DB::table('out_patients')->whereIn('pregnancy_tracking_id', $pregnancyTrackingIds)->count();

        $pregnancy = PregnancyTracking::with(['patient', 'barangay_center'])
            ->when($user && $user->role_id === 2, function ($query) use ($user) {
                $query->where('barangay_center_id', $user->barangay_center_id);
            })
            ->when($user->role_id !== 2, function ($query) use ($user) {
                $query->whereHas('risk_codes');
            })
            ->limit(8)
            ->orderBy('created_at', 'desc')
            ->get();

        $appointment_data = Appointment::with(['pregnancy_tracking', 'pregnancy_tracking.barangay_center'])
            ->whereBetween('appointment_date', [
                Carbon::today(),
                Carbon::today()->addWeek()
            ])
            ->when($user && $user->role_id === 2, function ($query) use ($user) {
                $query->whereHas('pregnancy_tracking', function ($q) use ($user) {
                    $q->where('barangay_center_id', $user->barangay_center_id);
                });
            })
            ->get();

        return [
            'data' => (object) $stats,
            'pregnancy_data' => DashboardPregnancyResource::collection($pregnancy),
            'appointment_data' => DashboardAppointmentResource::collection($appointment_data),
        ];
    }
}
