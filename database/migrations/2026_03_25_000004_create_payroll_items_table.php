<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('salary_component_id')->constrained('salary_components')->onDelete('cascade');
            $table->decimal('amount', 15, 2); // Tutar
            $table->decimal('calculated_amount', 15, 2)->nullable(); // Hesaplanan tutar (vergi kesintileri sonrası)
            $table->integer('quantity')->default(1); // Miktar (fazla çalışma saatleri için)
            $table->decimal('unit_price', 15, 2)->nullable(); // Birim fiyat
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['payroll_period_id', 'employee_id', 'salary_component_id'], 'payroll_item_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
