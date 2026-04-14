<?php

namespace App\Console\Commands;

use App\Models\Submission;
use Illuminate\Console\Command;

class UpdateSubmissionLabels extends Command
{
    protected $signature = 'update:submission-labels';

    protected $description = 'Update field labels for all submission details based on form fields';

    public function handle(): void
    {
        $submissions = Submission::with(['form.fields', 'details'])->get();

        $progressBar = $this->output->createProgressBar(count($submissions));
        $progressBar->start();

        foreach ($submissions as $submission) {
            // Skip if form relationship is not available
            if (! $submission->form) {
                continue;
            }

            $formFields = $submission->form->fields->keyBy('name');

            foreach ($submission->details as $detail) {
                $formField = $formFields[$detail->field_name] ?? null;
                $formFieldLabel = $formField ? $formField->label : null;

                if ($formFieldLabel && $detail->field_label !== $formFieldLabel) {
                    // Update the detail with the correct label from form field
                    $detail->update(['field_label' => $formFieldLabel]);
                }
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->info("\nSubmission labels updated successfully!");
    }
}
