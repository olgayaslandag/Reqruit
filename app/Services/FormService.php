<?php

namespace App\Services;

use App\Interfaces\IFormRepository;
use Illuminate\Support\Str;

class FormService
{
    public function __construct(
        protected IFormRepository $formRepository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->formRepository->getAll($filters);
    }

    public function getById(int $id)
    {
        return $this->formRepository->getById($id);
    }

    public function getBySlug(string $slug)
    {
        return $this->formRepository->getBySlug($slug);
    }

    public function getPublicForm(string $slug)
    {
        $form = $this->formRepository->getWithFieldsBySlug($slug);

        return [
            'id' => $form->id,
            'name' => $form->name,
            'description' => $form->description,
            'slug' => $form->slug,
            'department' => $form->department,
            'fields' => $form->fields->map(function ($field) {
                return [
                    'id' => $field->id,
                    'label' => $field->label,
                    'name' => $field->name,
                    'type' => $field->type,
                    'required' => $field->required,
                    'options' => $field->options,
                ];
            }),
        ];
    }

    public function create(array $data)
    {
        $data['fields'] = $this->addDefaultFields($data['fields'] ?? []);

        foreach ($data['fields'] as &$field) {
            if (! isset($field['name']) || empty($field['name'])) {
                $field['name'] = Str::slug($field['label'], '_');
            }
        }

        return $this->formRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $data['fields'] = $this->addDefaultFields($data['fields'] ?? []);

        foreach ($data['fields'] as &$field) {
            if (! isset($field['name']) || empty($field['name'])) {
                $field['name'] = Str::slug($field['label'], '_');
            }
        }

        return $this->formRepository->update($id, $data);
    }

    private function addDefaultFields(array $fields): array
    {
        $defaultFields = [
            ['name' => 'name', 'label' => 'Ad Soyad', 'type' => 'text', 'required' => true, 'sort_order' => 1],
            ['name' => 'email', 'label' => 'E-posta', 'type' => 'email', 'required' => true, 'sort_order' => 2],
        ];

        $existingNames = array_column($fields, 'name');

        foreach ($defaultFields as $default) {
            if (! in_array($default['name'], $existingNames)) {
                array_unshift($fields, $default);
            }
        }

        foreach ($fields as $index => &$field) {
            $field['sort_order'] = $index + 1;
        }

        return $fields;
    }

    public function delete(int $id)
    {
        return $this->formRepository->delete($id);
    }
}
