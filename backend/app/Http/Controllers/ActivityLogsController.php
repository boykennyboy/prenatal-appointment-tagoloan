<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogsResource;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;

class ActivityLogsController extends Controller
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
        $category   = $request->input('category');

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'user' => 'users.name',
            'title' => 'activity_logs.title',
            'created_at' => 'activity_logs.created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }


        $activity_logs = ActivityLogs::select('activity_logs.*')
            ->join('users', 'activity_logs.user_id', '=', 'users.id')
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.name', 'LIKE', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('activity_logs.action', $category);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('activity_logs.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('activity_logs.created_at', '<=', $dateTo);
            })
            ->orderBy($sortableColumns[$sortBy], $sortDir)
            ->paginate($perPage);


        return [
            'data' => ActivityLogsResource::collection($activity_logs),
            'meta' => [
                'total' => $activity_logs->total(),
                'per_page' => $activity_logs->perPage(),
                'current_page' => $activity_logs->currentPage(),
                'last_page' => $activity_logs->lastPage(),
            ],
        ];
    }

    public function getActivityActions()
    {
        return ActivityLogs::select('action')
            ->distinct()
            ->get()
            ->map(fn($log) => ['id' => $log->action, 'action' => $log->action]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
