<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(['admin', 'hr_manager', 'hr_staff', 'employee']) ?? false;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'attendance_record_id' => 'nullable|exists:attendance_records,id',
            'adjustment_date' => 'required|date',
            'from_time' => 'required_without:to_time|nullable|date_format:H:i',
            'to_time' => 'required_without:from_time|nullable|date_format:H:i',
            'reason' => 'required|string|max:1000',
            'type' => 'required|in:missing,wrong,overtime_request',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Personel seçilmelidir.',
            'adjustment_date.required' => 'Ayarlama tarihi belirlenmelidir.',
            'reason.required' => 'Neden belirtilmelidir.',
            'type.required' => 'Ayarlama türü seçilmelidir.',
        ];
    }
}
