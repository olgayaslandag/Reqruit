<?php

namespace Database\Factories;

use App\Enums\DocumentTypeEnum;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeDocumentFactory extends Factory
{
    protected $model = EmployeeDocument::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'document_type' => DocumentTypeEnum::CONTRACT->value,
            'file_name' => fake()->word() . '.pdf',
            'file_path' => 'documents/' . fake()->uuid() . '.pdf',
            'file_size' => fake()->numberBetween(1024, 1024000),
            'mime_type' => 'application/pdf',
        ];
    }

    public function contract(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentTypeEnum::CONTRACT->value,
        ]);
    }

    public function idDocument(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentTypeEnum::ID_DOCUMENT->value,
        ]);
    }

    public function diploma(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentTypeEnum::DIPLOMA->value,
        ]);
    }
}
