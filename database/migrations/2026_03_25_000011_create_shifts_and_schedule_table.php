<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['morning', 'evening', 'night', 'flexible']);
            $table->time('start_time');
            $table->time('end_time');
            $table->time('break_start')->nullable();
            $table->time('break_end')->nullable();
            $table->integer('break_duration')->default(0);  // in minutes
            $table->integer('tolerance_minutes')->default(15);
            $table->boolean('is_night')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['start_time', 'end_time']);
        });

        Schema::create('shift_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_id')->constrained('shifts');
            $table->foreignId('work_calendar_id')->constrained('work_calendars');
            $table->tinyInteger('day_of_week'); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['work_calendar_id', 'day_of_week'], 'calendar_day_unique');
        });

        Schema::create('shift_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_id')->constrained('shifts');
            $table->foreignId('work_calendar_id')->nullable()->constrained('work_calendars');
            $table->foreignId('employee_id')->constrained('employees');
            $table->date('date');
            $table->foreignId('assigned_by')->nullable()->constrained('users');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'date'], 'employee_date_unique');
            $table->index(['employee_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_schedules');
        Schema::dropIfExists('shift_templates');
        Schema::dropIfExists('shifts');
    }
};
