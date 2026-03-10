<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportRealData extends Command
{
    protected $signature = 'import:real-data {--force : Force import without confirmation}';

    protected $description = 'Import real data from SQL files';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('This will clear and import data. Continue?')) {
            return self::FAILURE;
        }

        // SQLite foreign keys disable
        DB::statement('PRAGMA foreign_keys = OFF');

        $this->importDepartments();
        $this->importForms();
        $this->importFormFields();

        DB::statement('PRAGMA foreign_keys = ON');

        $this->info('Done!');
        $this->info('- Departments: '.DB::table('departments')->count());
        $this->info('- Forms: '.DB::table('forms')->count());
        $this->info('- Form Fields: '.DB::table('form_fields')->count());

        return self::SUCCESS;
    }

    private function importDepartments()
    {
        DB::table('departments')->truncate();

        $sql = file_get_contents(database_path('seeders/sql_data/sVKPUJUU_dd_departments.sql'));

        // Extract INSERT values - find the VALUES block
        if (preg_match('/INSERT INTO[^;]+VALUES\s*(.*);/s', $sql, $m)) {
            $block = str_replace(["\n", "\r"], ' ', $m[1]);

            // Match each row: (id, 'title', 'slug', 'emails', parent_id, 'created', 'updated')
            preg_match_all('/\(\s*(\d+)\s*,\s*\'([^\']*)\'\s*,\s*\'([^\']*)\'\s*,\s*\'?([^\']*)\'?(\s*,\s*(\d+))?\s*,\s*\'([^\']*)\'\s*,\s*\'([^\']*)\'/', $block, $rows, PREG_SET_ORDER);

            foreach ($rows as $row) {
                $id = (int) $row[1];
                $title = $row[2];
                $slug = $row[3];
                $emails = $row[4];
                $parentId = isset($row[6]) ? (int) $row[6] : 0;

                // Convert emails to array (single email or comma-separated)
                $emailsArray = [];
                if ($emails) {
                    $emailsArray = array_filter(array_map('trim', explode(',', $emails)));
                }

                DB::table('departments')->insert([
                    'id' => $id,
                    'title' => $title,
                    'slug' => $slug,
                    'emails' => count($emailsArray) > 0 ? json_encode($emailsArray) : null,
                    'parent_id' => $parentId > 0 ? $parentId : null,
                    'created_at' => $row[7] ? $row[7] : now(),
                    'updated_at' => $row[8] ? $row[8] : now(),
                ]);
            }
        }

        $this->info('Departments imported: '.DB::table('departments')->count());
    }

    private function importForms()
    {
        DB::table('forms')->truncate();

        $sql = file_get_contents(database_path('seeders/sql_data/sVKPUJUU_dd_forms.sql'));

        if (preg_match('/INSERT INTO[^;]+VALUES\s*\((.*)\);/s', $sql, $m)) {
            $block = str_replace(["\n", "\r"], ' ', $m[1]);
            preg_match_all('/\(([^)]+)\)/', $block, $rows);

            foreach ($rows[1] as $row) {
                // WordPress format: id, department_id, name, description, created_at, updated_at
                if (preg_match('/^(\d+),\s*(\d+),\s*\'?([^\']*)\'?,\s*\'?([^\']*)\'?/', $row, $p)) {
                    $id = (int) $p[1];
                    $deptId = (int) $p[2];
                    $name = $p[3];
                    $desc = $p[4];

                    if (empty($name)) {
                        continue;
                    }

                    // Slug benzersiz olsun - form-{id} kullan
                    $slug = 'form-'.$id;

                    DB::table('forms')->insert([
                        'id' => $id,
                        'department_id' => $deptId,
                        'name' => $name,
                        'description' => $desc ?: null,
                        'slug' => $slug,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $this->info('Forms imported');
    }

    private function importFormFields()
    {
        DB::table('form_fields')->truncate();

        $sql = file_get_contents(database_path('seeders/sql_data/sVKPUJUU_dd_form_fields.sql'));

        if (preg_match('/INSERT INTO[^;]+VALUES\s*\((.*)\);/s', $sql, $m)) {
            $block = str_replace(["\n", "\r"], ' ', $m[1]);
            preg_match_all('/\(([^)]+)\)/', $block, $rows);

            $count = 0;
            foreach ($rows[1] as $row) {
                $p = array_map('trim', explode(',', $row, 10));
                if (count($p) < 9) {
                    continue;
                }

                // Skip invalid rows
                $id = (int) $p[0];
                if ($id <= 0) {
                    continue;
                }

                try {
                    DB::table('form_fields')->insertOrIgnore([
                        'id' => $id,
                        'form_id' => (int) $p[1],
                        'label' => trim($p[2], "'"),
                        'name' => trim($p[3], "'"),
                        'type' => trim($p[4], "'"),
                        'required' => (int) $p[5],
                        'options' => trim($p[6], "'") ?: null,
                        'sort_order' => (int) $p[7],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $count++;
                } catch (\Exception $e) {
                    // Skip duplicates
                }
            }

            $this->info("Form fields imported: $count");
        }
    }
}
