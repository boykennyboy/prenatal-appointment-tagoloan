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
        Schema::table('users', function (Blueprint $table) {
            // Drop the old 'role' string column
            $table->dropColumn('role');

            // Add the new 'role_id' foreign key column
            // The 'constrained()' method assumes a 'roles' table with an 'id' column
            $table->foreignId('role_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['role_id']);

            // Drop the new 'role_id' column
            $table->dropColumn('role_id');

            // Re-add the old 'role' string column
            $table->string('role');
        });
    }
};
