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
        protected ISubmissionRepository $submissionRepository
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
        $rules = [];

        foreach ($form->fields as $field) {
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
                case 'tel':
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:20';
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'max:10240';

                    if (! empty($field->options) && is_array($field->options)) {
                        $fieldRules[] = 'mimes:'.implode(',', $field->options);
                    }
                    break;
                default:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:5000';
            }

            $rules[$field->name] = $fieldRules;
        }

        return $rules;
    }

    public function handleSubmission(Form $form, array $data, array $files = []): mixed
    {
        return DB::transaction(function () use ($form, $data, $files) {
            $uploadedFiles = [];
            foreach ($files as $key => $file) {
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

                $details[] = [
                    'field_name' => $key,
                    'field_label' => $labels[$key] ?? $key,
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
