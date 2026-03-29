<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->foreignId('approver_id')->nullable()->constrained('employees')->onDelete('set null'); // Onaylayan yönetici
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_half_day')->default(false); // Yarım gün izin
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']); // Durum
            $table->text('reason')->nullable(); // İzin sebebi/açıklama
            $table->text('rejection_reason')->nullable(); // Reddetme gerekçesi
            $table->timestamp('approved_at')->nullable(); // Onay zamanı
            $table->boolean('requires_hr_approval')->default(false); // İK onayı gerekiyor mu?
            $table->timestamps();
            $table->softDeletes();

            $table->index(['employee_id', 'status']);
            $table->index(['approver_id', 'status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
