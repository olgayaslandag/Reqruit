<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create', \App\Models\LeaveType::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'is_paid' => ['required', 'boolean'],
            'requires_document' => ['required', 'boolean'],
            'max_duration_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'code' => ['required', 'string', 'max:20', 'unique:leave_types,code'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
