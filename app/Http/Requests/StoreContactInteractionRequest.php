<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactInteractionRequest extends FormRequest
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
            'interaction_type' => ['required', 'string', 'in:meeting,phone,email,offer,negotiation,other'],
            'interaction_date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:5000'],
            'response' => ['nullable', 'string', 'max:5000'],
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
            'interaction_type.required' => 'Etkileşim türü zorunludur.',
            'interaction_type.in' => 'Geçersiz etkileşim türü seçimi.',
            'interaction_date.required' => 'Etkileşim tarihi zorunludur.',
            'interaction_date.date' => 'Geçerli bir tarih giriniz.',
            'description.max' => 'Açıklama en fazla 5000 karakter olabilir.',
            'response.max' => 'Yanıt en fazla 5000 karakter olabilir.',
        ];
    }
}