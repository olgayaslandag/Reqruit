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
        Schema::table('intelligence_reports', function (Blueprint $table) {
            // Drop unnecessary columns
            $table->dropForeign(['investigator_id']); // Drop foreign key constraint first
            $table->dropForeign(['created_by']);      // Drop foreign key constraint first
            $table->dropForeign(['updated_by']);      // Drop foreign key constraint first
            
            $table->dropColumn([
                'investigator_id',
                'date_of_investigation',
                'report_document',
                'investigation_type',
                'created_by',
                'updated_by',
                'verified_status',
                'priority_level',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('intelligence_reports', function (Blueprint $table) {
            $table->unsignedBigInteger('investigator_id')->nullable();
            $table->dateTime('date_of_investigation')->nullable();
            $table->string('report_document')->nullable();
            $table->string('investigation_type')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->enum('verified_status', ['pending_verification', 'approved', 'rejected'])->default('pending_verification');
            $table->enum('priority_level', ['low', 'medium', 'high', 'critical'])->default('medium');
            
            // Add foreign key constraints back
            $table->foreign('investigator_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }
};