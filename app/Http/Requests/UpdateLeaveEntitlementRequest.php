<?php

declare(strict_types=1);
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeaveEntitlementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('update', \App\Models\LeaveEntitlement::class);
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'entitled_days' => ['required', 'integer', 'min:1', 'max:365'],
            'used_days' => ['required', 'integer', 'min:0', 'max:'.$this->route('entitlement')->entitled_days ?? 0],
            'calculation_year_start' => ['required', 'date'],
            'accrual_date' => ['required', 'date'],
            'can_carry_over' => ['required', 'boolean'],
            'max_carry_over_days' => ['required', 'integer', 'min:0', 'max:365'],
        ];
    }
}
