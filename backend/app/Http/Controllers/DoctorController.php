<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Models\ActivityLogs;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
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

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'firstname',
            'created_at' => 'created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }


        $nurses = Doctor::when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where(DB::raw("CONCAT(firstname, ' ', lastname)"), 'LIKE', "%{$search}%");
            });
        })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortableColumns[$sortBy], $sortDir)
            ->paginate($perPage);


        return [
            'data' => DoctorResource::collection($nurses),
            'meta' => [
                'total' => $nurses->total(),
                'per_page' => $nurses->perPage(),
                'current_page' => $nurses->currentPage(),
                'last_page' => $nurses->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'assigned_day' => 'required',
        ]);

        DB::transaction(function () use ($request, $fields) {
            $doctor = Doctor::create($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Doctor Created',
                'info' => [
                    'new' => $doctor->only(['firstname', 'lastname', 'assigned_day'])
                ],
                'loggable_type' => Doctor::class,
                'loggable_id' => $doctor->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });

        return [
            'message' => 'Doctor created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'assigned_day' => 'required',
        ]);

        DB::transaction(function () use ($request, $fields, $doctor) {
            $oldData =  $doctor->only(['firstname', 'lastname', 'assigned_day']);
            $doctor->update($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Doctor Updated',
                'info' => [
                    'old' => $oldData,
                    'new' => $doctor->only(['firstname', 'lastname', 'assigned_day'])
                ],
                'loggable_type' => Doctor::class,
                'loggable_id' => $doctor->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });


        return [
            'message' => 'Doctor updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        //
    }
}
