<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        // Filter by read status
        if ($request->has('filter')) {
            switch ($request->filter) {
                case 'unread':
                    $query->where('is_read', false);
                    break;
                case 'read':
                    $query->where('is_read', true);
                    break;
            }
        }

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }

        $notifications = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => Notification::where('user_id', Auth::id())
                ->where('is_read', false)
                ->count(),
            'read_count' => Notification::where('user_id', Auth::id())
                ->where('is_read', true)
                ->count(),
            'meta' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    public function limitedNotifications()
    {
        $query = Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->limit(7)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $query,
        ]);
    }

    public function getUnreadCount(): JsonResponse
    {
        $count = Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count,
            'read_count' => Notification::where('user_id', Auth::id())
                ->where('is_read', true)
                ->count(),
        ]);
    }

    public function markAsRead(Request $request, $id): JsonResponse
    {
        try {
            $notification = Notification::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $notification->update([
                'is_read' => true,
                'read_at' => Carbon::now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'unread_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', false)
                    ->count(),
                'read_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', true)
                    ->count(),
                'data' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found or access denied'
            ], 404);
        }
    }

    /**
     * Mark all notifications as read for authenticated user
     */
    public function markAllAsRead(): JsonResponse
    {
        try {
            $updated = Notification::where('user_id', Auth::id())
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => Carbon::now()
                ]);

            return response()->json([
                'success' => true,
                'message' => "Marked {$updated} notifications as read",
                'updated_count' => $updated,
                'unread_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', false)
                    ->count(),
                'read_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', true)
                    ->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notifications as read'
            ], 500);
        }
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
    public function destroy($id): JsonResponse
    {
        try {
            $notification = Notification::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully',
                'unread_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', false)
                    ->count(),
                'read_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', true)
                    ->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found or access denied'
            ], 404);
        }
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead(): JsonResponse
    {
        try {
            $deleted = Notification::where('user_id', Auth::id())
                ->where('is_read', true)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => "Deleted {$deleted} read notifications",
                'deleted_count' => $deleted,
                'unread_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', false)
                    ->count(),
                'read_count' => Notification::where('user_id', Auth::id())
                    ->where('is_read', true)
                    ->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notifications'
            ], 500);
        }
    }
}
