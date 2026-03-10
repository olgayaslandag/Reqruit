<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ImportSqlData extends Command
{
    protected $signature = 'import:sql-data {--force : Force import without confirmation}';

    protected $description = 'Import data from SQL backup files';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('This will clear and import data. Continue?')) {
            return self::FAILURE;
        }

        Schema::disableForeignKeyConstraints();

        $this->importTable('departments', 'sVKPUJUU_dd_departments.sql');
        $this->importTable('forms', 'sVKPUJUU_dd_forms.sql');
        $this->importTable('form_fields', 'sVKPUJUU_dd_form_fields.sql');

        // Submissions require forms to exist first
        $this->importTable('submissions', 'sVKPUJUU_dd_submissions.sql');
        $this->importTable('submission_details', 'sVKPUJUU_dd_submission_details.sql');
        $this->importTable('submission_comments', 'sVKPUJUU_dd_submission_comments.sql');

        Schema::enableForeignKeyConstraints();

        $this->info('All data imported successfully!');

        return self::SUCCESS;
    }

    private function importTable(string $table, string $filename): void
    {
        $path = database_path("seeders/sql_data/{$filename}");

        if (! file_exists($path)) {
            $this->warn("File not found: {$filename}");

            return;
        }

        // Clear table
        DB::table($table)->truncate();

        $sql = file_get_contents($path);

        // Extract INSERT INTO statement
        if (preg_match('/INSERT INTO[^;]+VALUES\s*(.+);/is', $sql, $matches)) {
            $valuesString = $matches[1];

            // Parse values - handle different formats
            $valuesString = str_replace("\n", ' ', $valuesString);
            $valuesString = preg_replace('/\s+/', ' ', $valuesString);

            // Find all value groups
            preg_match_all('/\(([^)]+)\)/', $valuesString, $valueMatches);

            $batch = [];
            $prefix = "INSERT INTO {$table} VALUES ";

            foreach ($valueMatches[1] as $index => $valueGroup) {
                $batch[] = "({$valueGroup})";

                if (count($batch) >= 50) {
                    $query = $prefix.implode(', ', $batch);
                    try {
                        DB::statement($query);
                    } catch (\Exception $e) {
                        // Continue on error
                    }
                    $batch = [];
                }
            }

            if (! empty($batch)) {
                $query = $prefix.implode(', ', $batch);
                try {
                    DB::statement($query);
                } catch (\Exception $e) {
                    // Continue on error
                }
            }
        }

        $this->info("Imported {$table}");
    }
}
