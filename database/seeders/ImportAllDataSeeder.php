<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportAllDataSeeder extends Seeder
{
    public function run(): void
    {
        // Increase PHP memory limit and execution time for large JSON
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        
        $this->command->info('Importing data... (this may take a while)');
        
        // Disable foreign key constraints for both MySQL and SQLite
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        } catch (\Exception $e) {
            $this->command->warn('Could not disable FK checks: ' . $e->getMessage());
        }
        
        try {
            DB::statement('PRAGMA foreign_keys = OFF');
        } catch (\Exception $e) {}
        
        $this->importDepartments();
        $this->importForms();
        $this->importFormFields();
        $this->importSubmissions();
        
        // Re-enable foreign key constraints
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        } catch (\Exception $e) {}
        
        try {
            DB::statement('PRAGMA foreign_keys = ON');
        } catch (\Exception $e) {}
        
        $this->command->info('All data imported successfully!');
    }

    private function importDepartments(): void
    {
        $this->command->info('Reading d.json...');
        
        // Use the combined d.json file
        $jsonPath = database_path('seeders/json_data/d.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error('d.json not found at: ' . $jsonPath);
            return;
        }
        
        $this->command->info('Parsing JSON...');
        $jsonData = json_decode(file_get_contents($jsonPath), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('JSON error: ' . json_last_error_msg());
            return;
        }
        
        $this->command->info('JSON count: ' . count($jsonData));
        
        // d.json has special structure: [header, database, table{data: [...]}]
        // Actual data is in $jsonData[2]['data']
        if (!isset($jsonData[2]['data']) || empty($jsonData[2]['data'])) {
            $this->command->error('No data found in d.json! Keys: ' . implode(', ', array_keys($jsonData)));
            return;
        }
        
        $dataRows = $jsonData[2]['data'];
        $this->command->info('Data rows: ' . count($dataRows));
        
        // Also read departments.json for parent_id
        $deptJsonPath = database_path('seeders/json_data/departments.json');
        $departmentsData = [];
        if (file_exists($deptJsonPath)) {
            $departmentsData = json_decode(file_get_contents($deptJsonPath), true);
            // Map by id for quick lookup
            $departmentsData = array_column($departmentsData, null, 'id');
        }
        
        // Filter only actual data rows (with department_id)
        $dataRows = array_filter($dataRows, function($item) {
            return isset($item['department_id']) && !empty($item['department_id']);
        });
        
        // Get unique departments
        $departmentsMap = [];
        foreach ($dataRows as $item) {
            $deptId = $item['department_id'];
            if (!isset($departmentsMap[$deptId])) {
                $deptData = $departmentsData[$deptId] ?? [];
                
                // Convert emails to JSON array for Laravel's array cast
                $emails = null;
                if (!empty($item['department_emails'])) {
                    $emails = json_encode([$item['department_emails']]);
                }
                
                $departmentsMap[$deptId] = [
                    'id' => (int) $deptId,
                    'title' => $item['department_name'],
                    'slug' => $item['department_slug'],
                    'emails' => $emails,
                    'parent_id' => $deptData['parent_id'] ?? null,
                ];
            }
        }
        
        DB::table('departments')->truncate();
        
        foreach ($departmentsMap as $item) {
            try {
                DB::table('departments')->insert([
                    'id' => $item['id'],
                    'title' => $item['title'],
                    'slug' => $item['slug'] ?: Str::slug($item['title']),
                    'emails' => $item['emails'],
                    'parent_id' => $item['parent_id'] > 0 ? $item['parent_id'] : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {}
        }
        
        $this->command->info('Imported ' . count($departmentsMap) . ' departments');
    }

    private function importForms(): void
    {
        // Use the combined d.json file
        $jsonPath = database_path('seeders/json_data/d.json');
        
        if (!file_exists($jsonPath)) {
            return;
        }
        
        $jsonData = json_decode(file_get_contents($jsonPath), true);
        
        // d.json has special structure: [header, database, table{data: [...]}]
        if (!isset($jsonData[2]['data']) || empty($jsonData[2]['data'])) {
            return;
        }
        
        $dataRows = $jsonData[2]['data'];
        
        // Filter only actual data rows (with form_id)
        $dataRows = array_filter($dataRows, function($item) {
            return isset($item['form_id']) && !empty($item['form_id']);
        });
        
        // Get unique forms
        $formsMap = [];
        $deptEmailsMap = [];
        
        // First pass: collect department emails
        foreach ($dataRows as $item) {
            if (!empty($item['department_id']) && !empty($item['department_emails'])) {
                $deptId = $item['department_id'];
                if (!isset($deptEmailsMap[$deptId])) {
                    $deptEmailsMap[$deptId] = $item['department_emails'];
                }
            }
        }
        
        // Second pass: create forms
        foreach ($dataRows as $item) {
            $formId = $item['form_id'];
            if (!isset($formsMap[$formId])) {
                $deptId = (int) $item['department_id'];
                $notificationEmails = null;
                
                // Use department's email as default notification email if available
                if (isset($deptEmailsMap[$deptId])) {
                    $notificationEmails = json_encode([$deptEmailsMap[$deptId]]);
                }
                
                $formsMap[$formId] = [
                    'id' => (int) $formId,
                    'department_id' => $deptId,
                    'name' => $item['form_name'],
                    'description' => $item['form_description'],
                    'notification_emails' => $notificationEmails,
                ];
            }
        }
        
        DB::table('forms')->truncate();
        
        foreach ($formsMap as $item) {
            try {
                $name = $item['name'] ?: 'Untitled Form';
                $slug = Str::slug($name);
                
                $originalSlug = $slug;
                $counter = 1;
                while (DB::table('forms')->where('slug', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                
                DB::table('forms')->insert([
                    'id' => $item['id'],
                    'department_id' => $item['department_id'],
                    'name' => $name,
                    'description' => $item['description'],
                    'slug' => $slug,
                    'notification_emails' => $item['notification_emails'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {}
        }
        
        $this->command->info('Imported ' . count($formsMap) . ' forms');
    }

    private function importFormFields(): void
    {
        // Use the combined d.json file
        $jsonPath = database_path('seeders/json_data/d.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error('d.json not found!');
            return;
        }
        
        $jsonData = json_decode(file_get_contents($jsonPath), true);
        
        // d.json has special structure: [header, database, table{data: [...]}]
        if (!isset($jsonData[2]['data']) || empty($jsonData[2]['data'])) {
            $this->command->error('No data found in d.json!');
            return;
        }
        
        $allData = $jsonData[2]['data'];
        
        // Filter only rows with field_id (actual form fields)
        $fields = array_filter($allData, function($item) {
            return !empty($item['field_id']);
        });
        
        if (empty($fields)) {
            $this->command->error('No fields found in d.json!');
            return;
        }
        
        $this->command->info('Processing ' . count($fields) . ' fields from d.json');
        
        DB::table('form_fields')->truncate();
        
        // Get existing form IDs  
        $existingFormIds = DB::table('forms')->pluck('id')->toArray();
        
        // Deduplicate fields by field_id first (same field appears multiple times in combined JSON)
        $uniqueFields = [];
        foreach ($fields as $item) {
            $fieldId = (int) $item['field_id'];
            if ($fieldId > 0 && !isset($uniqueFields[$fieldId])) {
                $uniqueFields[$fieldId] = $item;
            }
        }
        
        $this->command->info('Unique fields after deduplication: ' . count($uniqueFields));
        
        $batch = [];
        $imported = 0;
        $skipped = 0;
        
        foreach ($uniqueFields as $fieldId => $item) {
            $formId = (int) $item['form_id'];
            
            // Skip if form doesn't exist
            if (!in_array($formId, $existingFormIds)) {
                $skipped++;
                continue;
            }
            
            // Parse options from JSON string
            $options = null;
            if (!empty($item['field_options'])) {
                $options = $item['field_options'];
            }
            
            $batch[] = [
                'id' => $fieldId,
                'form_id' => $formId,
                'label' => $item['field_label'] ?? '',
                'name' => $item['field_name'] ?? '',
                'type' => $item['field_type'] ?? 'text',
                'required' => ($item['field_required'] ?? '0') === '1' ? 1 : 0,
                'options' => $options,
                'sort_order' => (int) ($item['field_sort_order'] ?? 0),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            if (count($batch) >= 50) {
                try { 
                    DB::table('form_fields')->insert($batch); 
                    $imported += count($batch);
                } catch (\Exception $e) { 
                    $skipped += count($batch);
                }
                $batch = [];
            }
        }
        
        if (!empty($batch)) {
            try { 
                DB::table('form_fields')->insert($batch); 
                $imported += count($batch);
            } catch (\Exception $e) { 
                $skipped += count($batch);
            }
        }
        
        $this->command->info("Imported form_fields: $imported inserted, $skipped skipped");
    }

    private function importSubmissions(): void
    {
        // Submissions
        $data = json_decode(file_get_contents(database_path('seeders/json_data/submissions.json')), true);
        
        DB::table('submissions')->truncate();
        
        foreach ($data as $item) {
            try {
                DB::table('submissions')->insert([
                    'id' => $item['id'],
                    'form_id' => $item['form_id'],
                    'reference_no' => $item['reference_no'] ?? 'APP-' . strtoupper(Str::random(8)),
                    'status' => $item['status'] ?? 'new',
                    'investigation' => $item['investigation'] ?? 'none',
                    'created_at' => $item['created_at'] ?? now(),
                    'updated_at' => $item['updated_at'] ?? now(),
                ]);
            } catch (\Exception $e) {}
        }
        
        $this->command->info('Imported ' . count($data) . ' submissions');
        
        // Submission Details
        $details = json_decode(file_get_contents(database_path('seeders/json_data/submission_details.json')), true);
        
        if ($details) {
            DB::table('submission_details')->truncate();
            
            $batch = [];
            foreach ($details as $item) {
                $batch[] = [
                    'id' => $item['id'],
                    'submission_id' => $item['submission_id'],
                    'field_name' => $item['field_name'] ?? '',
                    'field_label' => $item['field_label'] ?? '',
                    'field_value' => $item['field_value'] ?? '',
                    'created_at' => $item['created_at'] ?? now(),
                    'updated_at' => $item['updated_at'] ?? now(),
                ];
                
                if (count($batch) >= 50) {
                    try { DB::table('submission_details')->insert($batch); } catch (\Exception $e) {}
                    $batch = [];
                }
            }
            if (!empty($batch)) {
                try { DB::table('submission_details')->insert($batch); } catch (\Exception $e) {}
            }
            
            $this->command->info('Imported submission_details');
        }
        
        // Submission Comments
        $comments = json_decode(file_get_contents(database_path('seeders/json_data/submission_comments.json')), true);
        
        if ($comments) {
            DB::table('submission_comments')->truncate();
            
            $existingSubmissionIds = DB::table('submissions')->pluck('id')->toArray();
            $existingUserIds = DB::table('users')->pluck('id')->toArray();
            
            foreach ($comments as $item) {
                if (!in_array($item['submission_id'], $existingSubmissionIds)) {
                    continue;
                }
                
                $userId = $item['user_id'] ?? 1;
                if (!in_array($userId, $existingUserIds)) {
                    $userId = 1;
                }
                
                try {
                    DB::table('submission_comments')->insert([
                        'id' => $item['id'],
                        'submission_id' => $item['submission_id'],
                        'user_id' => $userId,
                        'comment' => $item['comment'] ?? '',
                        'rating' => $item['rating'] ?? null,
                        'is_private' => $item['is_private'] ?? 0,
                        'created_at' => $item['created_at'] ?? now(),
                        'updated_at' => $item['updated_at'] ?? now(),
                    ]);
                } catch (\Exception $e) {}
            }
            
            $this->command->info('Imported submission_comments');
        }
    }
}