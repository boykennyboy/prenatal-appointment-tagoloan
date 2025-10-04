<?php

namespace App\Services;

use App\Models\Appointment;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class AppointmentSchedulingService
{
    const SLOT_DURATION = 20; // minutes
    const START_TIME = '08:00';
    const END_TIME = '16:20';
    const MAX_SLOTS_PER_DAY = 5; // This is the max slot per day to accept in the database

    /**
     * Generate all possible time slots for a day
     */
    public function generateTimeSlots()
    {
        $slots = [];
        $startTime = Carbon::createFromTimeString(self::START_TIME);

        for ($i = 0; $i < self::MAX_SLOTS_PER_DAY; $i++) {
            $slotStart = $startTime->copy()->addMinutes($i * self::SLOT_DURATION);
            $slotEnd = $slotStart->copy()->addMinutes(self::SLOT_DURATION);

            $slots[] = [
                'start_time' => $slotStart->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
                'slot_index' => $i
            ];
        }

        return $slots;
    }

    /**
     * Get available slots for a specific date
     */
    public function getAvailableSlots($date)
    {
        $allSlots = $this->generateTimeSlots();
        $bookedSlots = Appointment::forDate($date)
            ->scheduled()
            ->pluck('start_time')
            ->map(function ($time) {
                return Carbon::parse($time)->format('H:i');
            })
            ->toArray();

        return collect($allSlots)->filter(function ($slot) use ($bookedSlots) {
            return !in_array($slot['start_time'], $bookedSlots);
        })->values()->toArray();
    }

    public function getPriorityScore($visit_count, $priority, $booking_timestamp = null)
    {
        // Visit count priority (higher visits = higher priority)
        $visitPriority = $visit_count * 1000;

        // Risk priority
        $riskValues = ['high' => 3, 'medium' => 2, 'low' => 1];
        $riskPriority = ($riskValues[$priority] ?? 1) * 100;

        // Time priority (earlier bookings get slight priority for ties)
        if ($booking_timestamp) {
            $timePriority = - (Carbon::parse($booking_timestamp)->timestamp / 1000000);
        } else {
            $timePriority = - (now()->timestamp / 1000000);
        }

        return $visitPriority + $riskPriority + $timePriority;
    }

    /**
     * Find the nearest available date starting from a given date
     */
    public function findNearestAvailableDate($startDate, $excludeDates = [])
    {
        $currentDate = Carbon::parse($startDate);
        $maxSearchDays = 30; // Limit search to 30 days to avoid infinite loop

        for ($i = 1; $i <= $maxSearchDays; $i++) { // Start from day 1 (next day)
            $checkDate = $currentDate->copy()->addDays($i);

            // Skip if date is in exclude list
            if (in_array($checkDate->format('Y-m-d'), $excludeDates)) {
                continue;
            }

            if ($this->isDateAvailable($checkDate->format('Y-m-d'))) {
                return $checkDate->format('Y-m-d');
            }
        }

        return null; // No available date found within search range
    }

    /**
     * Create appointment with priority-based scheduling and automatic rescheduling
     */
    public function createAppointment($data)
    {
        $date = $data['appointment_date'];
        $visit_count = $data['visit_count'];
        $priority = $data['priority'];
        $priority_score = $this->getPriorityScore($visit_count, $priority);

        // Check current appointments for the date
        $currentAppointments = Appointment::forDate($date)->scheduled()->count();

        // If date is full, handle rescheduling of lowest priority appointment
        if ($currentAppointments >= self::MAX_SLOTS_PER_DAY) {
            $this->handleFullDateRescheduling($date, $priority_score, $data);
        } else {
            // Date is not full, proceed with normal appointment creation
            $this->createNormalAppointment($data, $priority_score);
        }

        // Reorganize appointments for the date
        $this->reorganizeAppointments($date);

        // Return the newly created appointment
        return Appointment::where('pregnancy_tracking_id', $data['pregnancy_tracking_id'])
            ->where('appointment_date', $date)
            ->where('status', 'scheduled')
            ->first();
    }

    /**
     * Handle rescheduling when date is full
     */
    private function handleFullDateRescheduling($date, $newAppointmentPriority, $newAppointmentData)
    {
        // Get the lowest priority appointment for the date
        $lowestPriorityAppointment = Appointment::forDate($date)
            ->scheduled()
            ->orderBy('priority_score')
            ->first();

        // If new appointment has higher priority than the lowest existing one
        if ($newAppointmentPriority > $lowestPriorityAppointment->priority_score) {
            // Find nearest available date for the lowest priority appointment
            $nearestDate = $this->findNearestAvailableDate($date);

            if (!$nearestDate) {
                throw new Exception('No available dates found for rescheduling. Please try a different date.');
            }

            // Move the lowest priority appointment to the nearest available date
            $lowestPriorityAppointment->update([
                'appointment_date' => $nearestDate
            ]);

            // Create the new appointment in the original date
            $this->createNormalAppointment($newAppointmentData, $newAppointmentPriority);

            // Reorganize appointments for the new date
            $this->reorganizeAppointments($nearestDate);

            // Log the rescheduling (optional - you can implement logging as needed)
            Log::info("Appointment ID {$lowestPriorityAppointment->id} rescheduled from {$date} to {$nearestDate} due to higher priority appointment");
        } else {
            // New appointment has lower or equal priority, find alternative date for it
            $nearestDate = $this->findNearestAvailableDate($date);

            if (!$nearestDate) {
                throw new Exception('This date is fully booked and no alternative dates are available. Please select another date.');
            }

            // Create appointment on the nearest available date instead
            $newAppointmentData['appointment_date'] = $nearestDate;
            $this->createNormalAppointment($newAppointmentData, $newAppointmentPriority);

            // Reorganize appointments for the new date
            $this->reorganizeAppointments($nearestDate);

            throw new Exception("The selected date was full. Your appointment has been scheduled for {$nearestDate} instead.");
        }
    }

    /**
     * Create a normal appointment
     */
    private function createNormalAppointment($data, $priority_score)
    {
        $timeSlots = $this->generateTimeSlots();
        $firstAvailableSlot = $timeSlots[0]; // Temporary assignment

        $newAppointment = new Appointment([
            'pregnancy_tracking_id' => $data['pregnancy_tracking_id'],
            'appointment_date' => $data['appointment_date'],
            'start_time' => $firstAvailableSlot['start_time'],
            'end_time' => $firstAvailableSlot['end_time'],
            'priority' => $data['priority'],
            'visit_count' => $data['visit_count'],
            'notes' => $data['notes'] ?? null,
            'booking_timestamp' => now(),
            'status' => 'scheduled',
            'priority_score' => $priority_score,
        ]);

        $newAppointment->save();
        return $newAppointment;
    }

    /**
     * Reorganize appointments based on priority
     */
    public function reorganizeAppointments($date, $old_date = null)
    {
        // Handle old date reorganization if provided
        if ($old_date && $old_date !== $date) {
            $oldAppointments = Appointment::forDate($old_date)
                ->scheduled()
                ->orderByDesc('priority_score')
                ->orderBy('booking_timestamp') // For same priority, earlier bookings get better slots
                ->get();

            $timeSlots = $this->generateTimeSlots();

            foreach ($oldAppointments as $index => $appointment) {
                if (isset($timeSlots[$index])) {
                    $appointment->update([
                        'start_time' => $timeSlots[$index]['start_time'],
                        'end_time' => $timeSlots[$index]['end_time']
                    ]);
                }
            }
        }

        // Reorganize appointments for the main date
        $appointments = Appointment::forDate($date)
            ->scheduled()
            ->orderByDesc('priority_score')
            ->orderBy('booking_timestamp') // For same priority, earlier bookings get better slots
            ->get();

        $timeSlots = $this->generateTimeSlots();

        foreach ($appointments as $index => $appointment) {
            if (isset($timeSlots[$index])) {
                $appointment->update([
                    'start_time' => $timeSlots[$index]['start_time'],
                    'end_time' => $timeSlots[$index]['end_time']
                ]);
            }
        }
    }

    /**
     * Get appointments for a specific date with details
     */
    public function getAppointmentsForDate($date)
    {
        return Appointment::forDate($date)
            ->scheduled()
            ->orderBy('start_time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'pregnancy_tracking_id' => $appointment->pregnancy_tracking_id,
                    'start_time' => $appointment->start_time,
                    'end_time' => $appointment->end_time,
                    'priority' => $appointment->priority,
                    'visit_count' => $appointment->visit_count,
                    'notes' => $appointment->notes,
                    'priority_score' => $appointment->priority_score
                ];
            });
    }

    /**
     * Check if a date is available for booking
     */
    public function isDateAvailable($date)
    {
        $carbonDate = Carbon::parse($date);

        // Check if it's a weekend
        if ($carbonDate->isWeekend()) {
            return false;
        }

        // Check if it's in the past
        if ($carbonDate->isPast()) {
            return false;
        }

        // Check if fully booked
        $appointmentCount = Appointment::forDate($date)->scheduled()->count();
        return $appointmentCount < self::MAX_SLOTS_PER_DAY;
    }

    /**
     * Get visit count for a patient
     */
    public function getPatientVisitCount($pregnancyTrackingId)
    {
        return Appointment::where('pregnancy_tracking_id', $pregnancyTrackingId)
            ->where('status', '!=', 'cancelled')
            ->count() + 1; // +1 for the current appointment being booked
    }

    /**
     * Get rescheduled appointments (for notifications/alerts)
     */
    public function getRescheduledAppointments($originalDate, $newDate)
    {
        return Appointment::where('appointment_date', $newDate)
            ->where('updated_at', '>', now()->subMinutes(5)) // Recently updated
            ->scheduled()
            ->get();
    }

    /**
     * Update existing appointment with priority-based rescheduling
     */
    public function updateAppointment($appointmentId, $data)
    {
        $appointment = Appointment::findOrFail($appointmentId);

        $oldDate = $appointment->appointment_date;
        $oldPriorityScore = $appointment->priority_score;

        $newDate = $data['appointment_date'];
        $newPriorityScore = $this->getPriorityScore($data['visit_count'], $data['priority']);

        // If date is changing and new date is full, handle rescheduling
        if ($oldDate !== $newDate) {
            $currentCount = Appointment::forDate($newDate)
                ->where('id', '!=', $appointmentId)
                ->scheduled()
                ->count();

            if ($currentCount >= self::MAX_SLOTS_PER_DAY) {
                return $this->handleUpdateToFullDate($appointment, $data, $newPriorityScore);
            }
        }

        // Normal update
        $appointment->update(array_merge($data, ['priority_score' => $newPriorityScore]));

        // Reorganize affected dates
        $this->reorganizeAppointments($newDate);
        if ($oldDate !== $newDate) {
            $this->reorganizeAppointments($oldDate);
        }

        return $appointment->fresh();
    }

    /**
     * Handle update to a full date
     */
    private function handleUpdateToFullDate($appointment, $data, $newPriorityScore)
    {
        $newDate = $data['appointment_date'];
        $oldDate = $appointment->appointment_date;

        // Get lowest priority appointment on target date
        $lowestPriorityAppointment = Appointment::forDate($newDate)
            ->where('id', '!=', $appointment->id)
            ->scheduled()
            ->orderBy('priority_score')
            ->first();

        if ($newPriorityScore > $lowestPriorityAppointment->priority_score) {
            // Reschedule the lowest priority appointment
            $nearestDate = $this->findNearestAvailableDate($newDate, [$oldDate]);

            if (!$nearestDate) {
                throw new Exception('Cannot update: No available dates for rescheduling.');
            }

            $lowestPriorityAppointment->update(['appointment_date' => $nearestDate]);
            $appointment->update(array_merge($data, ['priority_score' => $newPriorityScore]));

            $this->reorganizeAppointments($newDate);
            $this->reorganizeAppointments($nearestDate);
            if ($oldDate !== $newDate && $oldDate !== $nearestDate) {
                $this->reorganizeAppointments($oldDate);
            }
        } else {
            // Find alternative date for the updated appointment
            $nearestDate = $this->findNearestAvailableDate($newDate, [$oldDate]);

            if (!$nearestDate) {
                throw new Exception("Date {$newDate} is fully booked. No alternative dates available.");
            }

            $data['appointment_date'] = $nearestDate;
            $appointment->update(array_merge($data, ['priority_score' => $newPriorityScore]));

            $this->reorganizeAppointments($nearestDate);
            if ($oldDate !== $nearestDate) {
                $this->reorganizeAppointments($oldDate);
            }

            throw new Exception("Date {$newDate} was full. Appointment moved to {$nearestDate}.");
        }

        return $appointment->fresh();
    }
}
