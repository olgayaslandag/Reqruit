<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advance_deductions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advance_request_id')->constrained('advance_requests')->onDelete('cascade');
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->onDelete('cascade');
            $table->decimal('deduction_amount', 15, 2); // Kesinti tutarı
            $table->decimal('remaining_amount', 15, 2); // Kalan tutar
            $table->enum('status', ['pending', 'deducted', 'completed', 'cancelled'])->default('pending');
            $table->date('deduction_date')->nullable(); // Kesinti tarihi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advance_deductions');
    }
};
