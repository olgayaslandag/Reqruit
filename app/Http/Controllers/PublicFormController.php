<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\FormService;
use App\Services\SubmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicFormController extends Controller
{
    public function __construct(
        protected FormService $formService,
        protected SubmissionService $submissionService
    ) {}

    public function show(string $slug)
    {
        $form = $this->formService->getPublicForm($slug);

        return Inertia::render('Public/Form', [
            'form' => $form,
        ]);
    }

    public function submit(Request $request, string $slug)
    {
        $form = $this->formService->getBySlug($slug);

        // Get field definitions for validation
        $fields = $form->fields;
        $rules = [];

        foreach ($fields as $field) {
            $fieldRules = [];

            if ($field->required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            switch ($field->type) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'max:10240'; // 10MB

                    // Check allowed file types from options
                    if (! empty($field->options) && is_array($field->options)) {
                        $allowedMimes = [];
                        foreach ($field->options as $opt) {
                            $allowedMimes[] = match (strtolower($opt)) {
                                'pdf' => 'application/pdf',
                                'doc' => 'application/msword',
                                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'jpg', 'jpeg' => 'image/jpeg',
                                'png' => 'image/png',
                                default => $opt,
                            };
                        }
                        if (! empty($allowedMimes)) {
                            $fieldRules[] = 'mimes:'.implode(',', $field->options);
                        }
                    }
                    break;
            }

            $rules[$field->name] = $fieldRules;
        }

        $validated = $request->validate($rules);

        $submission = $this->submissionService->handleSubmission(
            $slug,
            $validated,
            $request->file()
        );

        return back()->with('success', [
            'message' => 'Başvurunuz başarıyla gönderildi.',
            'reference_no' => $submission->reference_no,
        ]);
    }
}
