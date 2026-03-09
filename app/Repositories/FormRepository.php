<?php

namespace App\Repositories;

use App\Interfaces\FormInterface;
use App\Models\Form;
use App\Models\FormField;
use Illuminate\Support\Str;

class FormRepository implements FormInterface
{
    public function getAll(array $filters = [])
    {
        $query = Form::with('department', 'fields');

        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->orderBy('name')->get();
    }

    public function getById(int $id)
    {
        return Form::with('department', 'fields')->findOrFail($id);
    }

    public function getBySlug(string $slug)
    {
        return Form::with('department', 'fields')->where('slug', $slug)->firstOrFail();
    }

    public function create(array $data)
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
            foreach ($data['fields'] as $index => $field) {
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

        return $form->fresh(['fields', 'department']);
    }

    public function update(int $id, array $data)
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
            foreach ($data['fields'] as $index => $field) {
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

        return $form->fresh(['fields', 'department']);
    }

    public function delete(int $id)
    {
        $form = Form::findOrFail($id);

        return $form->delete();
    }

    public function getWithFields(int $id)
    {
        return Form::with('fields')->findOrFail($id);
    }

    public function getWithFieldsBySlug(string $slug)
    {
        return Form::with('fields')->where('slug', $slug)->firstOrFail();
    }
}
