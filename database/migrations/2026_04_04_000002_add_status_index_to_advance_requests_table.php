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
        Schema::table('advance_requests', function (Blueprint $table) {
            // Add index for advance_requests.status to improve query performance
            // Only create if it doesn't already exist
            if (! $this->hasIndex('advance_requests', 'advance_requests_status_index')) {
                $table->index('status', 'advance_requests_status_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advance_requests', function (Blueprint $table) {
            $table->dropIndex('advance_requests_status_index');
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
