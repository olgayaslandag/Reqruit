<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees');
            $table->date('date');
            $table->time('time');
            $table->enum('type', ['check_in', 'check_out', 'break_start', 'break_end']);
            $table->enum('source', ['device', 'mobile', 'web', 'api', 'manual']);
            $table->enum('status', ['present', 'absent', 'late', 'early_leave', 'overtime'])->default('present');
            $table->json('geolocation')->nullable(); // Format: {"lat": xx.xxxx, "lng": yy.yyyy}
            $table->string('ip_address', 45)->nullable();
            $table->string('device_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'date']);
            $table->index(['date', 'employee_id']);
            $table->index(['employee_id', 'date', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
