<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200); // Dönem adı (örn: Ocak 2026)
            $table->date('start_date'); // Dönem başı
            $table->date('end_date'); // Dönem sonu
            $table->enum('payment_frequency', ['monthly', 'biweekly', 'weekly'])->default('monthly');
            $table->date('payment_date')->nullable(); // Ödeme tarihi
            $table->enum('status', ['draft', 'manager_approved', 'hr_approved', 'accounting_approved', 'published'])->default('draft');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Aynı tarih aralığında sadece bir dönem olabilir
            $table->unique(['start_date', 'end_date', 'payment_frequency'], 'payroll_period_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_periods');
    }
};
