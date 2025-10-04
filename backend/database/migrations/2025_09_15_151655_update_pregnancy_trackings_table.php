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
            // Drop the old 'role' string column
            $table->dropColumn('attended_by');

            $table->foreignId('attended_by')->nullable()->constrained('doctors');
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
