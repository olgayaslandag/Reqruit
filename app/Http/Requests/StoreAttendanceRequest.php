<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create attendance records') ||
               $this->user()->hasRole(['admin', 'hr_manager', 'hr_staff']);
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'type' => 'required|in:check_in,check_out,break_start,break_end',
            'source' => 'required|in:device,mobile,web,api',
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
            'employee_id.required' => 'Personel seçilmelidir.',
            'date.required' => 'Tarih boş bırakılamaz.',
            'time.required' => 'Saat boş bırakılamaz.',
            'type.required' => 'Kayıt türü belirtilmelidir.',
        ];
    }
}
