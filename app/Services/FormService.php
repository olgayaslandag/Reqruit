<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IFormRepository;
use App\Models\Form;

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

                    $allowedExtensions = ! empty($field->options) && is_array($field->options)
                        ? $field->options
                        : ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

                    $fieldRules[] = 'mimes:'.implode(',', $allowedExtensions);
                    break;
                default:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:5000';
            }

            $rules[$field->name] = $fieldRules;
        }

        return $rules;
    }

    public function create(array $data)
    {
        return \DB::transaction(function () use ($data) {
            $data['fields'] = $this->addDefaultFields($data['fields'] ?? []);

            foreach ($data['fields'] as &$field) {
                if (! isset($field['name']) || empty($field['name'])) {
                    $field['name'] = \Illuminate\Support\Str::slug($field['label'], '_');
                }
            }

            return $this->formRepository->create($data);
        });
    }

    public function update(int $id, array $data)
    {
        return \DB::transaction(function () use ($id, $data) {
            $data['fields'] = $this->addDefaultFields($data['fields'] ?? []);

            foreach ($data['fields'] as &$field) {
                if (! isset($field['name']) || empty($field['name'])) {
                    $field['name'] = \Illuminate\Support\Str::slug($field['label'], '_');
                }
            }

            return $this->formRepository->update($id, $data);
        });
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
