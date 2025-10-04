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
        Schema::create('prenatal_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_tracking_id')->constrained('pregnancy_trackings');
            $table->string('attending_physician')->nullable();
            $table->date('date');
            $table->string('temp');
            $table->string('weight');
            $table->string('rr')->nullable();
            $table->string('pr')->nullable();
            $table->string('two_sat')->nullable();
            $table->string('bp')->nullable();
            $table->string('fht')->nullable();
            $table->string('fh')->nullable();
            $table->string('aog')->nullable();
            $table->string('term')->nullable();
            $table->string('preterm')->nullable();
            $table->string('post_term')->nullable();
            $table->string('living_children')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prenatal_visits');
    }
};
