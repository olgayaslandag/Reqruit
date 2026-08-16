<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IFormRepository;
use App\Interfaces\ISubmissionRepository;
use App\Jobs\SendSubmissionNotification;
use App\Models\Department;
use App\Models\Form;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class WidgetService
{
    public function __construct(
        protected IFormRepository $formRepository,
        protected ISubmissionRepository $submissionRepository,
        protected FormService $formService
    ) {}

    public function getRootDepartments(): Collection
    {
        return Department::with(['children', 'forms'])
            ->whereNull('parent_id')
            ->orderBy('title')
            ->get();
    }

    public function getDepartmentWithDetails(int $id): ?Department
    {
        return Department::with(['children.forms', 'forms.fields'])
            ->withCount(['children', 'forms'])
            ->find($id);
    }

    public function getDepartmentBySlug(string $slug): ?Department
    {
        return Department::with(['children.forms', 'forms.fields'])
            ->withCount(['children', 'forms'])
            ->where('slug', $slug)
            ->first();
    }

    public function getFormBySlug(string $slug): ?Form
    {
        return Form::with(['fields' => fn ($q) => $q->orderBy('sort_order')])
            ->where('slug', $slug)
            ->first();
    }

    public function buildValidationRules(Form $form): array
    {
        return $this->formService->buildValidationRules($form);
    }

    public function handleSubmission(Form $form, array $data, array $files = []): mixed
    {
        return DB::transaction(function () use ($form, $data, $files) {
            $formFields = $form->fields->keyBy('name');

            $uploadedFiles = [];
            foreach ($files as $key => $file) {
                $formField = $formFields[$key] ?? null;

                if (! $formField || $formField->type !== 'file') {
                    continue;
                }

                if ($file && $file->isValid()) {
                    $path = $file->store('submissions/'.$form->id, 'local');
                    $uploadedFiles[$key] = $path;
                }
            }

            $data = array_merge($data, $uploadedFiles);

            $details = [];
            $labels = $data['labels'] ?? [];

            foreach ($data as $key => $value) {
                if (in_array($key, ['_token', 'labels'])) {
                    continue;
                }

                $formField = $formFields[$key] ?? null;
                $details[] = [
                    'field_name' => $key,
                    'field_label' => $labels[$key] ?? ($formField ? $formField->label : $key),
                    'field_value' => is_array($value) ? implode(', ', $value) : $value,
                ];
            }

            $submission = $this->submissionRepository->create([
                'form_id' => $form->id,
                'details' => $details,
            ]);

            SendSubmissionNotification::dispatch($form, $submission);

            return $submission;
        });
    }
}
