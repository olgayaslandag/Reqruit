<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('salary_component_id')->constrained('salary_components')->onDelete('cascade');
            $table->decimal('amount', 15, 2); // Tutar
            $table->date('start_date'); // Başlangıç tarihi
            $table->date('end_date')->nullable(); // Bitiş tarihi (null = hala aktif)
            $table->enum('payment_frequency', ['monthly', 'biweekly', 'weekly'])->default('monthly');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Aynı employee için aynı component'in birden fazla aktif olamayacağı kuralı
            $table->unique(['employee_id', 'salary_component_id', 'start_date'], 'emp_sal_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};
