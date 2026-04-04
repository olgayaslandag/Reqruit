<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update shifts') ||
               $this->user()->hasRole(['admin', 'hr_manager']);
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:morning,evening,night,flexible',
            'start_time' => 'sometimes|date_format:H:i|before:end_time',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'break_start' => 'nullable|date_format:H:i|after_or_equal:start_time|before:end_time',
            'break_end' => 'nullable|date_format:H:i|after:break_start|before_or_equal:end_time',
            'break_duration' => 'sometimes|integer|min:0',
            'tolerance_minutes' => 'sometimes|integer|min:0|max:60',
            'is_night' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'end_time.before' => 'Bitiş saati, başlangıç saatinden sonra olmalıdır.',
            'break_start.after_or_equal' => 'Ara başlangıcı, vardiyadan sonra ve bitişten önce olmalıdır.',
            'break_end.after' => 'Ara bitişi, ara başlagıcı zamanından sonra olmalıdır.',
        ];
    }
}
