<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->onDelete('cascade');
            $table->foreignId('approver_id')->constrained('users')->onDelete('cascade');
            $table->enum('role', ['manager', 'hr', 'accounting']); // Onaylayan rolü
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('comment')->nullable(); // Yorum
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->unique(['payroll_period_id', 'role'], 'payroll_approval_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_approvals');
    }
};
