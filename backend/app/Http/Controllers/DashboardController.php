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

        $query = PregnancyTracking::select(
            DB::raw('COUNT(DISTINCT patients.id) AS total_patients'),
            DB::raw('COUNT(DISTINCT pregnancy_trackings.id) AS total_pregnancy_tracking'),
            DB::raw('COUNT(DISTINCT appointments.id) AS total_appointments'),
            DB::raw("SUM(CASE WHEN pregnancy_trackings.pregnancy_status = 'first_trimester' THEN 1 ELSE 0 END) as total_first_trimester"),
            DB::raw("SUM(CASE WHEN pregnancy_trackings.pregnancy_status = 'second_trimester' THEN 1 ELSE 0 END) as total_second_trimester"),
            DB::raw("SUM(CASE WHEN pregnancy_trackings.pregnancy_status = 'third_trimester' THEN 1 ELSE 0 END) as total_third_trimester"),
            DB::raw("SUM(CASE WHEN pregnancy_trackings.pregnancy_status = 'completed' THEN 1 ELSE 0 END) as total_completed"),
            DB::raw('COUNT(DISTINCT immuzition_records.id) AS total_immunization'),
            DB::raw('COUNT(DISTINCT prenatal_visits.id) AS total_prenatal_visit'),
            DB::raw('COUNT(DISTINCT out_patients.id) AS total_out_patients')
        )
            ->leftJoin('patients', 'pregnancy_trackings.patient_id', '=', 'patients.id')
            ->leftJoin('appointments', 'pregnancy_trackings.id', '=', 'appointments.pregnancy_tracking_id')
            ->leftJoin('immuzition_records', 'pregnancy_trackings.id', '=', 'immuzition_records.pregnancy_tracking_id')
            ->leftJoin('prenatal_visits', 'pregnancy_trackings.id', '=', 'prenatal_visits.pregnancy_tracking_id')
            ->leftJoin('out_patients', 'pregnancy_trackings.id', '=', 'out_patients.pregnancy_tracking_id')
            ->when($user && $user->role_id === 2, function ($query) use ($user) {
                $query->where('pregnancy_trackings.barangay_center_id', $user->barangay_center_id);
            })
            ->first();


        $pregnancy = PregnancyTracking::with(['patient', 'barangay_center'])
            ->when($user && $user->role_id === 2, function ($query) use ($user) {
                $query->where('barangay_center_id', $user->barangay_center_id);
            })
            ->limit(8)
            ->orderBy('created_at', 'desc')
            ->get();


        $appointment_data = Appointment::with(['pregnancy_tracking', 'pregnancy_tracking.barangay_center'])
            ->whereBetween('appointment_date', [
                Carbon::today(),
                Carbon::today()->addWeek()
            ])
            ->get();

        return [
            'data' => $query,
            'pregnancy_data' => DashboardPregnancyResource::collection($pregnancy),
            'appointment_data' => DashboardAppointmentResource::collection($appointment_data),
        ];
    }
}
