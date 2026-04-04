<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClockAttendanceRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
            'time' => 'nullable',
            'source' => 'required|in:device,mobile,web,api',
            'geolocation' => 'nullable|array',
            'ip_address' => 'nullable|string|max:45',
            'device_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
