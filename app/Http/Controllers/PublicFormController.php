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

        $rules = $this->formService->buildValidationRules($form);

        $validated = $request->validate($rules);

        $fileFieldNames = $form->fields->where('type', 'file')->pluck('name')->all();
        $files = array_intersect_key($request->file() ?: [], array_flip($fileFieldNames));

        $submission = $this->submissionService->handleSubmission(
            $slug,
            $validated,
            $files
        );

        return back()->with('success', [
            'message' => 'Başvurunuz başarıyla gönderildi.',
            'reference_no' => $submission->reference_no,
        ]);
    }
}
