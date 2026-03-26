<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advance_requests', function (Blueprint $table) {
            $table->enum('type', ['emergency', 'commitment', 'fuel', 'travel', 'education', 'health', 'housing', 'other'])->nullable()->after('employee_id');
            $table->timestamp('approved_at')->nullable()->after('approver_id');
        });
    }

    public function down(): void
    {
        Schema::table('advance_requests', function (Blueprint $table) {
            $table->dropColumn(['type', 'approved_at']);
        });
    }
};
