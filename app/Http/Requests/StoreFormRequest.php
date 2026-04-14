<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFormRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'notification_emails' => ['nullable', 'array'],
            'notification_emails.*' => ['nullable', 'email', 'max:255'],
            'fields' => ['nullable', 'array'],
            'fields.*.label' => ['required', 'string', 'max:255'],
            'fields.*.name' => ['nullable', 'string', 'max:255'],
            'fields.*.type' => ['required', 'string', 'max:50', 'in:text,email,tel,number,date,textarea,select,checkbox,radio,file'],
            'fields.*.required' => ['nullable', 'boolean'],
            'fields.*.options' => ['nullable', 'array'],
            'fields.*.options.*' => ['string', 'max:255'],
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
            'name.required' => 'Form adı zorunludur.',
            'department_id.required' => 'Departman seçimi zorunludur.',
            'department_id.exists' => 'Seçilen departman geçersiz.',
            'notification_emails.*.email' => 'Geçerli bir e-posta adresi giriniz.',
            'fields.*.label.required' => 'Alan etiketi zorunludur.',
            'fields.*.type.required' => 'Alan türü zorunludur.',
            'fields.*.type.in' => 'Geçersiz alan türü.',
        ];
    }
}
