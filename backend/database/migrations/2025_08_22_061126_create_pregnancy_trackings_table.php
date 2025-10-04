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
        Schema::create('pregnancy_trackings', function (Blueprint $table) {
            $table->id();
            $table->string('pregnancy_tracking_number')->nullable()->unique();
            $table->foreignId('patient_id')->nullable()->constrained('patients');
            $table->foreignId('barangay_center_id')->nullable()->constrained('barangay_centers');
            $table->foreignId('midwife_id')->nullable()->constrained('midwives');
            $table->string('fullname');
            $table->integer('age');
            $table->string('gravidity')->nullable();
            $table->string('parity')->nullable();
            $table->string('abortion')->nullable();
            $table->string('lmp')->nullable();
            $table->string('edc')->nullable();
            $table->string('bemoc')->nullable();
            $table->string('bemoc_address')->nullable();
            $table->string('cemoc')->nullable();
            $table->string('cemoc_address')->nullable();
            $table->string('barangay_health_station')->nullable();
            $table->string('referral_unit')->nullable();
            $table->boolean('anc_given')->default(false);
            $table->date('date_delivery')->nullable();
            $table->string('outcome_sex')->nullable();
            $table->string('outcome_weight')->nullable();
            $table->string('place_of_delivery')->nullable();
            $table->string('attended_by')->nullable();
            $table->boolean('phic')->default(false);
            $table->boolean('isDone')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancy_trackings');
    }
};
