<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('intelligence_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->enum('status', ['pending', 'completed', 'none'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('investigator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('date_of_investigation')->nullable();
            $table->string('report_document')->nullable();
            $table->string('investigation_type')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('verified_status', ['pending_verification', 'approved', 'rejected'])->default('pending_verification');
            $table->enum('priority_level', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->timestamps();

            // Indexes
            $table->index('submission_id');
            $table->index('status');
            $table->index('date_of_investigation');
            $table->index('investigation_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intelligence_reports');
    }
};