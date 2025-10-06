<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\GetAddressesNameResource;
use App\Http\Resources\GetMidwivesAndBarangayWorkersResource;
use App\Http\Resources\SelectBarangayWorkerResource;
use App\Http\Resources\SelectMidWifeResource;
use App\Http\Resources\SelectNurseResource;
use App\Models\Appointment;
use App\Models\Barangay;
use App\Models\BarangayCenter;
use App\Models\BarangayWorker;
use App\Models\Midwife;
use App\Models\Municipality;
use App\Models\Nurse;
use App\Models\PregnancyTracking;
use App\Models\Province;
use App\Models\Region;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class SelectAddressController extends Controller
{
    public function regions()
    {
        return Cache::remember('regions_select', 3600, function () {
            return Region::select('id', 'name')
                ->orderBy('name')
                ->get();
        });
    }

    public function provinces(Region $region)
    {
        return Cache::remember("provinces_region_{$region->id}", 3600, function () use ($region) {
            return Province::select('id', 'name')
                ->where('region_id', $region->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function municipalities(Province $province)
    {
        return Cache::remember("municipalities_province_{$province->id}", 3600, function () use ($province) {
            return Municipality::select('id', 'name')
                ->where('province_id', $province->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function barangays(Municipality $municipality)
    {
        return Cache::remember("barangays_municipality_{$municipality->id}", 3600, function () use ($municipality) {
            return Barangay::select('id', 'name')
                ->where('municipality_id', $municipality->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function roles()
    {
        return Cache::remember("roles", 3600, function () {
            return Role::select('id', 'role')
                ->orderBy('role')
                ->get();
        });
    }

    public function getAddressName(Request $request)
    {
        $barangay = Barangay::find($request->input('barangay_id'));
        $municipality = Municipality::find($request->input('municipality_id'));
        $province = Province::find($request->input('province_id'));
        $region = Region::find($request->input('region_id'));

        // Bundle the names into a simple object or array
        $address = (object) [
            'barangay_name' => $barangay?->name,
            'municipality_name' => $municipality?->name,
            'province_name' => $province?->name,
            'region_name' => $region?->name,
        ];

        return new GetAddressesNameResource($address);
    }

    public function getMidwifeAndBarangayWorkerName(Request $request)
    {
        $midwife = Midwife::find($request->input('midwife_id'));
        $barangay_worker = BarangayWorker::find($request->input('barangay_worker_id'));

        $data = (object) [
            'midwife_name' => $midwife?->fullname,
            'barangay_worker_name' => $barangay_worker?->fullname,
        ];

        return new GetMidwivesAndBarangayWorkersResource($data);
    }

    public function getMidwifeAndNurseName(Request $request)
    {
        $midwife = Midwife::find($request->input('midwife_id'));
        $nurse = Nurse::find($request->input('nurse_id'));

        $data = (object) [
            'midwife_name' => $midwife?->fullname,
            'nurse_name' => $nurse?->fullname,
        ];

        return new GetMidwivesAndBarangayWorkersResource($data);
    }

    public function pregnancy_trackings()
    {
        $pregnancy_trackings = PregnancyTracking::select(['id', 'fullname'])
            ->where('isDone', false)
            ->get();

        return $pregnancy_trackings->map(function ($tracking) {
            return [
                'id' => $tracking->id,
                'fullname' => $tracking->fullname,
            ];
        });
    }

    public function pregnancy_trackings_has_appointments()
    {
        // $pregnancy_trackings = PregnancyTracking::select(['id', 'fullname'])
        //     ->where('isDone', false)
        //     ->whereHas('appointments')
        //     ->get();

        // return $pregnancy_trackings->map(function ($tracking) {
        //     return [
        //         'id' => $tracking->id,
        //         'fullname' => $tracking->fullname,
        //     ];
        // });

        $appointment = Appointment::with('pregnancy_tracking')
            ->whereDate('appointment_date', Carbon::today())
            ->get();

        return $appointment->map(function ($apt) {
            return [
                'id' => $apt->pregnancy_tracking_id,
                'fullname' => $apt->pregnancy_tracking->fullname,
            ];
        });
    }

    public function midwives(BarangayCenter $barangay_center)
    {
        $midwives = Midwife::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectMidWifeResource::collection($midwives);
    }

    public function nurses(BarangayCenter $barangay_center)
    {
        $nurses = Nurse::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectNurseResource::collection($nurses);
    }

    public function barangay_workers(BarangayCenter $barangay_center)
    {
        $barangay_workers = BarangayWorker::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectBarangayWorkerResource::collection($barangay_workers);
    }



    // Optional: Method to preload all address data for edit forms
    public function preloadAddressData(Request $request)
    {
        $regionId = $request->get('region_id');
        $provinceId = $request->get('province_id');
        $municipalityId = $request->get('municipality_id');

        $data = [];

        if ($regionId) {
            $data['provinces'] = Cache::remember("provinces_region_{$regionId}", 3600, function () use ($regionId) {
                return Province::select('id', 'name')
                    ->where('region_id', $regionId)
                    ->orderBy('name')
                    ->get();
            });

            if ($provinceId) {
                $data['municipalities'] = Cache::remember("municipalities_province_{$provinceId}", 3600, function () use ($provinceId) {
                    return Municipality::select('id', 'name')
                        ->where('province_id', $provinceId)
                        ->orderBy('name')
                        ->get();
                });

                if ($municipalityId) {
                    $data['barangays'] = Cache::remember("barangays_municipality_{$municipalityId}", 3600, function () use ($municipalityId) {
                        return Barangay::select('id', 'name')
                            ->where('municipality_id', $municipalityId)
                            ->orderBy('name')
                            ->get();
                    });
                }
            }
        }

        return response()->json($data);
    }

    public function checkNurseMidwifeExistence()
    {

        $user = Auth::user();

        $has_nurse = Nurse::when(
            $user && $user->role_id === 2,
            fn($query) => $query->where('barangay_center_id', $user->barangay_center_id)
        )->exists();

        $has_midwife = Midwife::when(
            $user && $user->role_id === 2,
            fn($query) => $query->where('barangay_center_id', $user->barangay_center_id)
        )->exists();

        return [
            'data' => $has_midwife && $has_nurse,
        ];
    }
}
