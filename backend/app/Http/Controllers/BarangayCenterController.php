<?php

namespace App\Http\Controllers;

use App\Http\Resources\BarangayCenterCollection;
use App\Http\Resources\BarangayCenterResource;
use App\Models\ActivityLogs;
use App\Models\BarangayCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BarangayCenterController extends Controller
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
        $sortableColumns = ['id', 'health_station', 'created_at',];
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $barangayCenters = BarangayCenter::with(['barangays', 'municipalities', 'provinces'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('health_station', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return [
            'data' => BarangayCenterResource::collection($barangayCenters),
            'meta' => [
                'total' => $barangayCenters->total(),
                'per_page' => $barangayCenters->perPage(),
                'current_page' => $barangayCenters->currentPage(),
                'last_page' => $barangayCenters->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'health_station' => 'required|max:255',
            'rural_health_unit' => 'required|max:255',
            'region' => 'required|exists:regions,id',
            'province' => 'required|exists:provinces,id',
            'municipality' => 'required|exists:municipalities,id',
            'barangay' => 'required|exists:barangays,id',
        ]);

        DB::transaction(function () use ($request, $fields) {
            $health_station = BarangayCenter::create($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Barangay Center Created',
                'info' => [
                    'new' => $health_station->only(['health_station', 'municipality', 'barangay'])
                ],
                'loggable_type' => BarangayCenter::class,
                'loggable_id' => $health_station->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });


        return [
            'message' => 'Barangay Health Station created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayCenter $barangayCenter)
    {

        return [
            'health_station' => $barangayCenter->health_station,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BarangayCenter $barangayCenter)
    {
        $fields = $request->validate([
            'health_station' => 'required|max:255',
            'rural_health_unit' => 'required|max:255',
            'region' => 'required|exists:regions,id',
            'province' => 'required|exists:provinces,id',
            'municipality' => 'required|exists:municipalities,id',
            'barangay' => 'required|exists:barangays,id',
        ]);

        DB::transaction(function () use ($request, $fields, $barangayCenter) {
            $changes = $barangayCenter->getDirty();
            $oldData = $barangayCenter->getOriginal(array_keys($changes));

            $barangayCenter->update($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Barangay Center Updated',
                'info' => [
                    'old' => $oldData,
                    'new' => $changes,
                ],
                'loggable_type' => BarangayCenter::class,
                'loggable_id' => $barangayCenter->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });

        return [
            'message' => 'Barangay Health Station updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayCenter $barangayCenter)
    {
        //
    }
}
