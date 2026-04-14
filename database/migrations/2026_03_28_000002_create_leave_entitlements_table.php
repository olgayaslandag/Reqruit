<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_entitlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->unsignedSmallInteger('entitled_days'); // Hak edilen gün sayısı
            $table->unsignedSmallInteger('used_days')->default(0); // Kullanılan gün sayısı
            $table->date('calculation_year_start'); // Hesaplama yıl başlangıcı
            $table->date('accrual_date'); // Hak kazanma tarihi
            $table->boolean('can_carry_over')->default(true); // Devredilebilir mi?
            $table->unsignedSmallInteger('max_carry_over_days')->default(182); // Maks devir günü (6 ay)
            $table->timestamps();

            $table->unique(['employee_id', 'leave_type_id', 'calculation_year_start'], 'leave_entitlements_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_entitlements');
    }
};
