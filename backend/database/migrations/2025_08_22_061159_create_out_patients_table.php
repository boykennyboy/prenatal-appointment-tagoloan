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
        Schema::create('out_patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_tracking_id')->constrained('pregnancy_trackings');
            $table->string('file_number')->nullable();
            $table->date('date');
            $table->time('time');
            $table->string('temp');
            $table->string('height');
            $table->string('weight');
            $table->string('rr')->nullable();
            $table->string('pr')->nullable();
            $table->string('two_sat')->nullable();
            $table->string('bp')->nullable();
            $table->string('phic')->nullable();
            $table->string('chief_complaint')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('out_patients');
    }
};
