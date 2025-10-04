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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('middlename')->nullable();
            $table->integer('age');
            $table->string('sex');
            $table->string('status');
            $table->date('birth_date');
            $table->string('birth_place');
            $table->string('address');
            $table->string('zone');
            $table->string('religion');
            $table->string('contact')->unique();
            $table->string('contact_person_name');
            $table->string('contact_person_number');
            $table->string('contact_person_relationship');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
