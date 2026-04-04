<?php

declare(strict_types=1);
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class EmployeeCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'identity_no' => $this->maskIdentityNumber($employee->identity_no),
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'full_name' => $employee->full_name,
                    'birth_date' => $employee->birth_date,
                    'gender' => $employee->gender,
                    'phone' => $employee->phone,
                    'email' => $employee->email,
                    'emergency_contact_name' => $employee->emergency_contact_name,
                    'emergency_contact_phone' => $employee->emergency_contact_phone,
                    'emergency_contact_relation' => $employee->emergency_contact_relation,
                    'marital_status' => $employee->marital_status,
                    'children_count' => $employee->children_count,
                    'hire_date' => $employee->hire_date,
                    'position_title' => $employee->position_title,
                    'department_id' => $employee->department_id,
                    'department' => $employee->whenLoaded('department'),
                    'employment_type' => $employee->employment_type,
                    'contract_type' => $employee->contract_type,
                    'termination_date' => $employee->termination_date,
                ];
            }),
            'links' => [
                'first' => $this->firstPageUrl(),
                'last' => $this->lastPageUrl(),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $this->currentPage(),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'path' => $this->path(),
                'per_page' => $this->perPage(),
                'to' => $this->lastItem(),
                'total' => $this->total(),
            ],
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
