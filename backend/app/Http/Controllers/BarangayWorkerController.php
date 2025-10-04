<?php

namespace App\Http\Controllers;

use App\Http\Resources\BarangayWorkerResource;
use App\Http\Resources\SelectBarangayWorkerResource;
use App\Models\Barangay;
use App\Models\BarangayCenter;
use App\Models\BarangayWorker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BarangayWorkerController extends Controller
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

        $barangayWorkers = BarangayWorker::with([
            'barangay_center',
            'barangay_center.barangays',
            'barangay_center.municipalities',
            'barangay_center.provinces'
        ])
            ->when($search, function ($query, $search) {
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
            'data' => BarangayWorkerResource::collection($barangayWorkers),
            'meta' => [
                'total' => $barangayWorkers->total(),
                'per_page' => $barangayWorkers->perPage(),
                'current_page' => $barangayWorkers->currentPage(),
                'last_page' => $barangayWorkers->lastPage(),
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
            'barangay_center_id' => 'required|exists:barangay_centers,id',
        ]);

        BarangayWorker::create($fields);

        return [
            'message' => 'Barangay health worker created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayCenter $barangay_center)
    {
        $barangay_workers = BarangayWorker::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectBarangayWorkerResource::collection($barangay_workers);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BarangayWorker $barangayWorker)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'barangay_center_id' => 'required|exists:barangay_centers,id',
        ]);

        $barangayWorker->update($fields);

        return [
            'message' => 'Barangay health worker updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayWorker $barangayWorker)
    {
        //
    }
}
