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
        Schema::table('submissions', function (Blueprint $table) {
            // Add index for submissions.form_id to improve query performance
            // Only create if it doesn't already exist
            if (! $this->hasIndex('submissions', 'submissions_form_id_index')) {
                $table->index('form_id', 'submissions_form_id_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex('submissions_form_id_index');
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
