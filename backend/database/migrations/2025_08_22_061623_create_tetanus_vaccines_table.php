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
        Schema::create('tetanus_vaccines', function (Blueprint $table) {
            $table->id();
            $table->date('first_given')->nullable();
            $table->date('second_given')->nullable();
            $table->date('third_given')->nullable();
            $table->date('fourth_given')->nullable();
            $table->date('fifth_given')->nullable();
            $table->date('first_comeback')->nullable();
            $table->date('second_comeback')->nullable();
            $table->date('third_comeback')->nullable();
            $table->date('fourth_comeback')->nullable();
            $table->date('fifth_comeback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tetanus_vaccines');
    }
};
