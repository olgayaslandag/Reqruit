<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddSubmissionCommentRequest extends FormRequest
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
            'comment' => ['required', 'string', 'max:5000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_private' => ['nullable', 'boolean'],
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
            'comment.required' => 'Yorum alanı zorunludur.',
            'comment.max' => 'Yorum en fazla 5000 karakter olabilir.',
            'rating.integer' => 'Puanlama bir tam sayı olmalıdır.',
            'rating.min' => 'Puanlama en az 1 olmalıdır.',
            'rating.max' => 'Puanlama en fazla 5 olabilir.',
        ];
    }
}
