<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('school_name', 200);
            $table->string('department', 200)->nullable();
            $table->enum('degree', ['primary', 'secondary', 'high_school', 'associate', 'bachelor', 'master', 'doctorate']);
            $table->unsignedSmallInteger('graduation_year')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_education');
    }
};