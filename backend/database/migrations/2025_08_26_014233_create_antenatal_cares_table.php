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
        Schema::create('antenatal_cares', function (Blueprint $table) {
            $table->id();
            $table->date('first_trimester')->nullable();
            $table->date('second_trimester')->nullable();
            $table->date('third_trimester')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antenatal_cares');
    }
};
