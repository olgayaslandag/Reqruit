<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update attendance adjustments') ||
               $this->user()->hasRole(['admin', 'hr_manager']);
    }

    public function rules(): array
    {
        return [
            'reason' => 'sometimes|string|max:1000',
            'status' => 'sometimes|in:pending,approved,rejected',
            'rejection_reason' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Geçersiz durum değeri.',
        ];
    }
}
