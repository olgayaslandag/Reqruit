<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_adjustments', function (Blueprint $table) {
            $table->foreignId('attendance_record_id')
                ->nullable()
                ->change()
                ->constrained('attendance_records')
                ->onDelete('set null');

            $table->foreignId('requested_by')
                ->change()
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('approved_by')
                ->nullable()
                ->change()
                ->constrained('users')
                ->onDelete('set null');
        });

        Schema::table('attendance_summaries', function (Blueprint $table) {
            $table->foreignId('employee_id')
                ->change()
                ->constrained('employees')
                ->onDelete('cascade');
        });

        Schema::table('holidays', function (Blueprint $table) {
            $table->foreignId('work_calendar_id')
                ->change()
                ->constrained('work_calendars')
                ->onDelete('cascade');
        });

        Schema::table('shift_templates', function (Blueprint $table) {
            $table->foreignId('shift_id')
                ->change()
                ->constrained('shifts')
                ->onDelete('cascade');

            $table->foreignId('work_calendar_id')
                ->change()
                ->constrained('work_calendars')
                ->onDelete('cascade');
        });

        Schema::table('shift_schedules', function (Blueprint $table) {
            $table->foreignId('shift_id')
                ->change()
                ->constrained('shifts')
                ->onDelete('cascade');

            $table->foreignId('work_calendar_id')
                ->nullable()
                ->change()
                ->constrained('work_calendars')
                ->onDelete('set null');

            $table->foreignId('employee_id')
                ->change()
                ->constrained('employees')
                ->onDelete('cascade');

            $table->foreignId('assigned_by')
                ->nullable()
                ->change()
                ->constrained('users')
                ->onDelete('set null');
        });

        Schema::table('advance_requests', function (Blueprint $table) {
            $table->foreignId('employee_id')
                ->change()
                ->constrained('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::table('payroll_approvals', function (Blueprint $table) {
            $table->foreignId('approver_id')
                ->nullable()
                ->change()
                ->constrained('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        // Reversing all changes would require knowing original states
        // This migration is for adding constraints, not removing them
    }
};
