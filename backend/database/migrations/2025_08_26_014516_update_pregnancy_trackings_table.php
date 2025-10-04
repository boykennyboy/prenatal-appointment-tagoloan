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
        Schema::table('pregnancy_trackings', function (Blueprint $table) {
            $table->foreignId('antenatal_care_id')->nullable()->constrained('antenatal_cares');
            $table->foreignId('pregnancy_outcome_id')->nullable()->constrained('pregnancy_outcomes');
            $table->foreignId('postnatal_check_up_id')->nullable()->constrained('postnatal_check_ups');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
