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
        Schema::create('pregnancy_outcomes', function (Blueprint $table) {
            $table->id();
            $table->boolean('live_birth')->nullable();
            $table->boolean('preterm_birth')->nullable();
            $table->boolean('stillbirth')->nullable();
            $table->boolean('abortion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancy_outcomes');
    }
};
