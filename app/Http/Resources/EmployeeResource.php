<?php

declare(strict_types=1);
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'identity_no' => $this->maskIdentityNumber($this->identity_no),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'birth_date' => $this->birth_date,
            'gender' => $this->gender,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'emergency_contact_relation' => $this->emergency_contact_relation,
            'marital_status' => $this->marital_status,
            'children_count' => $this->children_count,
            'hire_date' => $this->hire_date,
            'position_title' => $this->position_title,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department'),
            'employment_type' => $this->employment_type,
            'contract_type' => $this->contract_type,
            'manager_id' => $this->manager_id,
            'manager' => $this->whenLoaded('manager'),
            'subordinates' => $this->whenLoaded('subordinates'),
            'gross_salary' => $this->gross_salary ?? null,
            'termination_date' => $this->termination_date,
            'termination_reason' => $this->termination_reason,
        ];
    }

    /**
     * Mask the identity number to show only last 4 digits
     */
    private function maskIdentityNumber(?string $identityNo): ?string
    {
        if (! $identityNo || strlen($identityNo) !== 11) {
            return $identityNo;
        }

        // Show only last 4 digits, mask others with X
        return 'XXXXX'.substr($identityNo, -4);
    }
}
