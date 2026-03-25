<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bonus_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('payroll_period_id')->nullable()->constrained('payroll_periods')->onDelete('set null');
            $table->string('bonus_type', 100); // Prim tipi (performance, annual, signing, etc.)
            $table->decimal('amount', 15, 2); // Tutar
            $table->decimal('tax_amount', 15, 2)->default(0); // Vergi tutarı
            $table->decimal('net_amount', 15, 2); // Net tutar
            $table->date('payment_date'); // Ödeme tarihi
            $table->text('description')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bonus_payments');
    }
};
