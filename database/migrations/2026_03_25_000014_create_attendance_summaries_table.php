<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees');
            $table->date('date');
            $table->string('work_day_type', 20)->default('full_day'); // full_day, half_day, weekend, holiday
            $table->time('scheduled_start_time')->nullable();
            $table->time('actual_check_in')->nullable();
            $table->time('scheduled_end_time')->nullable();
            $table->time('actual_check_out')->nullable();
            $table->time('actual_break_start')->nullable();
            $table->time('actual_break_end')->nullable();
            $table->decimal('expected_working_duration', 5, 2)->default(0.00); // in hours
            $table->decimal('actual_working_duration', 5, 2)->default(0.00); // in hours
            $table->decimal('overtime_duration', 5, 2)->default(0.00); // in hours
            $table->decimal('late_duration', 5, 2)->default(0.00); // in hours
            $table->decimal('early_leave_duration', 5, 2)->default(0.00); // in hours
            $table->boolean('was_absent')->default(false);
            $table->enum('status', ['present', 'absent', 'late', 'early_leave', 'overtime'])->default('present');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'date']);
            $table->index(['date', 'status']);
            $table->unique(['employee_id', 'date'], 'employee_date_summary_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_summaries');
    }
};
