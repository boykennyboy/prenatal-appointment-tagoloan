<?php

namespace App\Http\Controllers;

use App\Http\Resources\MidwifeResource;
use App\Http\Resources\SelectMidWifeResource;
use App\Models\ActivityLogs;
use App\Models\BarangayCenter;
use App\Models\Midwife;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MidwifeController extends Controller
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

        $user = Auth::user();
        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'firstname',
            'created_at' => 'created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $midwives = Midwife::with([
            'barangay_center',
            'barangay_center.barangays',
            'barangay_center.municipalities',
            'barangay_center.provinces'
        ])
            ->when($user->role_id === 2, function ($query) use ($user) {
                $query->where('barangay_center_id', $user->barangay_center_id);
            })
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
            'data' => MidwifeResource::collection($midwives),
            'meta' => [
                'total' => $midwives->total(),
                'per_page' => $midwives->perPage(),
                'current_page' => $midwives->currentPage(),
                'last_page' => $midwives->lastPage(),
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

        DB::transaction(function () use ($request, $fields) {

            $midwife = Midwife::create($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'Midwife Created',
                'info' => [
                    'new' => $midwife->only(['firstname', 'lastname', 'barangay_center_id'])
                ],
                'loggable_type' => Midwife::class,
                'loggable_id' => $midwife->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });


        return [
            'message' => 'Midwife created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayCenter $barangay_center)
    {
        $midwives = Midwife::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectMidWifeResource::collection($midwives);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Midwife $midwife)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'barangay_center_id' => 'required|exists:barangay_centers,id',
        ]);

        DB::transaction(function () use ($request, $fields, $midwife) {
            $oldData = $midwife->only(['firstname', 'lastname', 'barangay_center_id']);

            $midwife->update($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'Midwife Updated',
                'info' => [
                    'old' => $oldData,
                    'new' => $midwife->only(['firstname', 'lastname', 'barangay_center_id'])
                ],
                'loggable_type' => Midwife::class,
                'loggable_id' => $midwife->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });


        return [
            'message' => 'Midwife updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Midwife $midwife)
    {
        //
    }
}
