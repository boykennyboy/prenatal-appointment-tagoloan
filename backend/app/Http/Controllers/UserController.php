<?php

namespace App\Http\Controllers;

use App\Models\ActivityLogs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $role       = $request->input('role');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = ['id', 'name', 'email', 'created_at',];
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $users = User::with(['role', 'barangay_center'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                $query->where('role_id', $role);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return $users;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'barangay_center_id' => 'nullable|exists:barangay_centers,id'
        ]);

        DB::transaction(function () use ($request, $fields) {
            $user = User::create($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'title' => 'User Created',
                'info' => [
                    'new_user' => $user->only(['id', 'name', 'email'])
                ],
                'loggable_type' => User::class,
                'loggable_id' => $user->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });

        return [
            'message' => 'User created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'barangay_center_id' => 'nullable|exists:barangay_centers,id'
        ]);

        if (empty($fields['password'])) {
            unset($fields['password']);
        }

        DB::transaction(function () use ($request, $fields, $user) {
            $oldData = $user->only(['name', 'email']);

            $user->update($fields);

            ActivityLogs::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'title' => 'User Updated',
                'info' => [
                    'old' => $oldData,
                    'new' => $user->only(['name', 'email'])
                ],
                'loggable_type' => User::class,
                'loggable_id' => $user->id,
                'ip_address' => $request->ip() ?? null,
                'user_agent' => $request->header('User-Agent') ?? null,
            ]);
        });



        return [
            'message' => 'User updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
