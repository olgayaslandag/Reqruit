<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update attendance records') ||
               $this->user()->hasRole(['admin', 'hr_manager']);
    }

    public function rules(): array
    {
        return [
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'type' => 'sometimes|required|in:check_in,check_out,break_start,break_end',
            'status' => 'nullable|in:present,absent,late,early_leave,overtime',
            'geolocation' => 'nullable|array',
            'geolocation.lat' => 'numeric|min:-90|max:90',
            'geolocation.lng' => 'numeric|min:-180|max:180',
            'ip_address' => 'nullable|ip',
            'device_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Tarih boş bırakılamaz.',
            'time.required' => 'Saat boş bırakılamaz.',
            'type.required' => 'Kayıt türü belirtilmelidir.',
        ];
    }
}
