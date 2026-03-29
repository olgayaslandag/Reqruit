<?php

namespace App\Repositories;

use App\Interfaces\IFormRepository;
use App\Models\Form;
use App\Models\FormField;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class FormRepository extends BaseRepository implements IFormRepository
{
    public function __construct(Form $model)
    {
        $this->model = $model;
    }

    /**
     * Get all forms.
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Form::with('department', 'fields');

        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated forms.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Form::with('department', 'fields');

        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Get form by ID.
     */
    public function getById(int $id): Form
    {
        return Form::with('department', 'fields')->findOrFail($id);
    }

    /**
     * Get form by slug.
     */
    public function getBySlug(string $slug): Form
    {
        return Form::with('department', 'fields')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * Create a new form with fields.
     */
    public function create(array $data): Form
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        // Ensure unique slug
        $originalSlug = $data['slug'];
        $counter = 1;
        while (Form::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug.'-'.$counter++;
        }

        // Clean empty notification emails
        if (isset($data['notification_emails'])) {
            $data['notification_emails'] = array_filter($data['notification_emails'], fn ($e) => ! empty($e));
        }

        $form = Form::create($data);

        if (isset($data['fields'])) {
            $this->createFields($form, $data['fields']);
        }

        return $form->fresh(['fields', 'department']);
    }

    /**
     * Update a form with fields.
     */
    public function update(int $id, array $data): Form
    {
        $form = Form::findOrFail($id);

        if (isset($data['name']) && $data['name'] !== $form->name) {
            $data['slug'] = Str::slug($data['name']);
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Form::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $originalSlug.'-'.$counter++;
            }
        }

        // Clean empty notification emails
        if (isset($data['notification_emails'])) {
            $data['notification_emails'] = array_filter($data['notification_emails'], fn ($e) => ! empty($e));
        }

        $form->update($data);

        if (isset($data['fields'])) {
            // Delete old fields
            $form->fields()->delete();
            // Create new fields
            $this->createFields($form, $data['fields']);
        }

        return $form->fresh(['fields', 'department']);
    }

    /**
     * Get form with fields by ID.
     */
    public function getWithFields(int $id): Form
    {
        return Form::with('fields')->findOrFail($id);
    }

    /**
     * Get form with fields by slug.
     */
    public function getWithFieldsBySlug(string $slug): Form
    {
        return Form::with('fields')->where('slug', $slug)->firstOrFail();
    }

    /**
     * Create form fields.
     */
    private function createFields(Form $form, array $fields): void
    {
        foreach ($fields as $index => $field) {
            FormField::create([
                'form_id' => $form->id,
                'label' => $field['label'],
                'name' => $field['name'],
                'type' => $field['type'],
                'required' => $field['required'] ?? false,
                'options' => $field['options'] ?? null,
                'sort_order' => $index,
            ]);
        }
    }
}
