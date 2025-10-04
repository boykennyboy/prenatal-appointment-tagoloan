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
        Schema::create('midwives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_center_id')->constrained('barangay_centers');
            $table->string('firstname');
            $table->string('lastname');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('midwives');
    }
};
