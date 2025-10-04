<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_tracking_id')->constrained('pregnancy_trackings');
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->integer('visit_count')->default(1);
            $table->enum('status', ['scheduled', 'completed', 'missed'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamp('booking_timestamp')->useCurrent();
            $table->timestamps();

            $table->index(['appointment_date', 'start_time']);
            $table->index(['pregnancy_tracking_id', 'appointment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
