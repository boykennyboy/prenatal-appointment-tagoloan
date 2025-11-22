<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SendSmsNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $userFields = $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|min:8'
        ]);

        $user = User::with('barangay_center')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'email' => ["Invalid credentials."]
                ]
            ], 422); // Unauthorized
        }

        $token = $user->createToken($user->name);

        // Correct way to send an ad-hoc notification
        // $phoneNumber = 639060319020;
        // $message = "This is a sms test only.";

        // $response=Notification::route('philsms', $phoneNumber)
            // ->notify(new SendSmsNotification($message));

        return [
            'message' => 'Login successfully.',
            'user' => $user,
            'token' => $token->plainTextToken,
            // 'SMSResponse' => $response,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return [
            'message' => 'You have been logged out!',
        ];
    }
}
