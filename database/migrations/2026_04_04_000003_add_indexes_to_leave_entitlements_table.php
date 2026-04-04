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
        Schema::table('leave_entitlements', function (Blueprint $table) {
            // Add common indexes for the leave entitlements table for improved query performance

            // Index on employee_id for querying employee's leave entitlements
            if (! $this->hasIndex('leave_entitlements', 'leave_entitlements_employee_id_index')) {
                $table->index('employee_id', 'leave_entitlements_employee_id_index');
            }

            // Index on leave_type_id for filtering by leave type
            if (! $this->hasIndex('leave_entitlements', 'leave_entitlements_leave_type_id_index')) {
                $table->index('leave_type_id', 'leave_entitlements_leave_type_id_index');
            }

            // Composite index for common queries filtering by both employee and leave type
            if (! $this->hasIndex('leave_entitlements', 'leave_entitlements_employee_leave_type_index')) {
                $table->index(['employee_id', 'leave_type_id'], 'leave_entitlements_employee_leave_type_index');
            }

            // Index on calculation_year_start for year-based queries
            if (! $this->hasIndex('leave_entitlements', 'leave_entitlements_calculation_year_start_index')) {
                $table->index('calculation_year_start', 'leave_entitlements_calculation_year_start_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_entitlements', function (Blueprint $table) {
            $table->dropIndex('leave_entitlements_employee_id_index');
            $table->dropIndex('leave_entitlements_leave_type_id_index');
            $table->dropIndex('leave_entitlements_employee_leave_type_index');
            $table->dropIndex('leave_entitlements_calculation_year_start_index');
        });
    }

    /**
     * Helper method to check if index exists
     */
    private function hasIndex(string $table, string $index): bool
    {
        $connection = Schema::getConnection();
        $schema = $connection->getSchemaBuilder();

        $indexes = $schema->getIndexes($table);

        foreach ($indexes as $indexInfo) {
            if (isset($indexInfo['name']) && $indexInfo['name'] === $index) {
                return true;
            }
        }

        return false;
    }
};
