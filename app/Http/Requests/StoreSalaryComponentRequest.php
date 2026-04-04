<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalaryComponentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:200'],
            'code' => ['required', 'string', 'max:50', Rule::unique('salary_components', 'code')],
            'type' => ['required', 'in:earning,deduction'],
            'category' => ['required', 'in:fixed,variable'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_taxable' => ['boolean'],
            'is_sgk_applicable' => ['boolean'],
            'default_amount' => ['nullable', 'numeric', 'min:0'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
