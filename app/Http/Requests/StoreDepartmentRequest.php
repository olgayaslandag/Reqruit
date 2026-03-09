<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:departments,slug'],
            'emails' => ['nullable', 'array'],
            'emails.*' => ['email', 'max:255'],
            'parent_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Departman adı zorunludur.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'emails.*.email' => 'Geçerli bir e-posta adresi giriniz.',
            'parent_id.exists' => 'Seçilen üst departman geçersiz.',
        ];
    }
}
