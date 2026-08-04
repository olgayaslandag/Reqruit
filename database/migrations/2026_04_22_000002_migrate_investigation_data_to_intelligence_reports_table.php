<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Temporary table to track migrated records
    private string $tracking_table = 'investigation_migration_tracking';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a temporary tracking table to record what we're migrating
        DB::statement("CREATE TABLE IF NOT EXISTS {$this->tracking_table} (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            submission_id BIGINT UNSIGNED,
            intelligence_report_id BIGINT UNSIGNED,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (submission_id),
            INDEX (intelligence_report_id)
        )");

        // Get submissions that have valid investigation data and no existing intelligence reports
        $submissionsData = DB::table('submissions')
            ->select('id', 'investigation', 'investigation_notes', 'created_at', 'updated_at')
            ->whereNotNull('investigation')
            ->where('investigation', '!=', 'none')
            ->get();

        foreach ($submissionsData as $submission) {
            // Check if there are NO intelligence reports associated with this submission
            $existingReportCount = DB::table('intelligence_reports')
                ->where('submission_id', $submission->id)
                ->count();

            if ($existingReportCount == 0) {
                // Create a new IntelligenceReport entry from the old investigation data
                $reportId = DB::table('intelligence_reports')->insertGetId([
                    'submission_id' => $submission->id,
                    'status' => $submission->investigation,
                    'notes' => $submission->investigation_notes,
                    'date_of_investigation' => $submission->created_at, // Using creation date as investigation date
                    'verified_status' => 'pending_verification',
                    'priority_level' => 'medium',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Track this migration to enable safe rollback
                DB::table($this->tracking_table)->insert([
                    'submission_id' => $submission->id,
                    'intelligence_report_id' => $reportId,
                    'created_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Retrieve all migration tracking records to find exactly what we created
        $migratedRecords = DB::table($this->tracking_table)
            ->select('intelligence_report_id')
            ->get();

        // Delete only the intelligence reports we created during this migration
        $reportIds = $migratedRecords->pluck('intelligence_report_id')->toArray();
        
        if (!empty($reportIds)) {
            DB::table('intelligence_reports')
                ->whereIn('id', $reportIds)
                ->delete();
        }

        // Clean up the tracking table
        DB::statement("DROP TABLE IF EXISTS {$this->tracking_table}");
    }
};