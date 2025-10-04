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
        Schema::create('risk_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_tracking_id')->nullable()->constrained('pregnancy_trackings');
            $table->string('risk_code')->nullable();
            $table->date('date_detected')->nullable();
            $table->enum('risk_status', ['high', 'medium', 'low'])->default('high');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_codes');
    }
};
