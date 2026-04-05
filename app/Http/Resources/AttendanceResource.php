<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'employee' => $this->whenLoaded('employee', fn () => new EmployeeResource($this->employee)),
            'date' => $this->date?->format('Y-m-d'),
            'time' => $this->time?->format('H:i:s'),
            'timestamp' => $this->date && $this->time
                ? $this->date->format('Y-m-d').' '.$this->time->format('H:i:s')
                : null,
            'type' => $this->type?->value,
            'status' => $this->status?->value,
            'source' => $this->source?->value,
            'geolocation' => $this->geolocation,
            'ip_address' => $this->ip_address,
            'device_id' => $this->device_id,
            'notes' => $this->notes,
            'approved_by' => $this->approved_by,
            'approval_date' => $this->approval_date?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
