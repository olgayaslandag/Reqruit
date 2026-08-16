<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // submissions listesi status + created_at ile sıklıkla filtreleniyor
        Schema::table('submissions', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'submissions_status_created_idx');
        });

        // intelligence_reports: ROW_NUMBER partition sorgusu için bileşik indeks
        Schema::table('intelligence_reports', function (Blueprint $table) {
            $table->index(['submission_id', 'created_at'], 'intel_reports_submission_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex('submissions_status_created_idx');
        });

        Schema::table('intelligence_reports', function (Blueprint $table) {
            $table->dropIndex('intel_reports_submission_created_idx');
        });
    }
};