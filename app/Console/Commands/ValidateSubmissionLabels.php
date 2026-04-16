<?php

namespace App\Console\Commands;

use App\Models\Submission;
use Illuminate\Console\Command;

class ValidateSubmissionLabels extends Command
{
    protected $signature = 'validate:submission-labels {--fix : Automatically fix incorrect labels}';

    protected $description = 'Validate that submission detail field labels match form field definitions';

    public function handle(): void
    {
        $submissions = Submission::with(['form.fields', 'details'])->get();

        $totalSubmissions = count($submissions);
        $processed = 0;
        $incorrectLabels = 0;
        $fixedLabels = 0;

        $progressBar = $this->output->createProgressBar($totalSubmissions);
        $progressBar->start();

        foreach ($submissions as $submission) {
            $processed++;

            // Skip if form relationship is not available
            if (! $submission->form) {
                $progressBar->advance();

                continue;
            }

            $formFields = $submission->form->fields->keyBy('name');

            foreach ($submission->details as $detail) {
                $formField = $formFields[$detail->field_name] ?? null;
                $expectedLabel = $formField ? $formField->label : null;

                if ($expectedLabel && $detail->field_label !== $expectedLabel) {
                    $incorrectLabels++;

                    if ($this->option('fix')) {
                        $detail->update(['field_label' => $expectedLabel]);
                        $fixedLabels++;
                    } else {
                        $this->info("\nIncorrect label detected:");
                        $this->info("- Field Name: {$detail->field_name}");
                        $this->info("- Current Label: '{$detail->field_label}'");
                        $this->info("- Expected Label: '{$expectedLabel}'");
                        $this->info("- Submission ID: {$submission->id}");
                        $this->newLine();  // Add a blank line for readability
                    }
                }
            }

            $progressBar->advance();
        }

        $progressBar->finish();

        $this->info("\n\nValidation Summary:");
        $this->info("- Total processed submissions: $processed");
        $this->info("- Submissions with incorrect labels: $incorrectLabels");

        if ($this->option('fix')) {
            $this->info("- Labels fixed: $fixedLabels");
            $this->info("\nSubmission labels validation and fixing completed!");
        } else {
            $this->info('- Run with --fix option to correct these labels automatically');
        }
    }
}
