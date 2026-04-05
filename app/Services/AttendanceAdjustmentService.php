<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AdjustmentStatusEnum;
use App\Interfaces\IAttendanceAdjustmentRepository;
use App\Models\AttendanceAdjustment;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;

class AttendanceAdjustmentService
{
    public function __construct(
        protected IAttendanceAdjustmentRepository $attendanceAdjustmentRepository,
        protected AttendanceService $attendanceService,
        protected EmployeeService $employeeService,
    ) {}

    public function create(array $data): AttendanceAdjustment
    {
        $data['requested_by'] = Auth::id();
        $data['status'] = AdjustmentStatusEnum::PENDING;
        $data['request_date'] = now();

        return $this->attendanceAdjustmentRepository->create($data);
    }

    public function update(int $id, array $data): AttendanceAdjustment
    {
        return $this->attendanceAdjustmentRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->attendanceAdjustmentRepository->delete($id);
    }

    public function approve(int $id, ?int $approvedBy = null): AttendanceAdjustment
    {
        $adjustment = $this->attendanceAdjustmentRepository->findOrFail($id);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            throw new \Exception('Adjustment is not in pending status');
        }

        $updateData = [
            'status' => AdjustmentStatusEnum::APPROVED,
            'approved_by' => $approvedBy ?? Auth::id(),
            'approved_at' => now(),
            'rejection_reason' => null,
        ];

        $updatedAdjustment = $this->attendanceAdjustmentRepository->update($id, $updateData);

        // Recalculate the attendance summary for the affected date
        $this->attendanceService->updateAttendanceSummary(
            $updatedAdjustment->employee_id,
            $updatedAdjustment->adjustment_date
        );

        return $updatedAdjustment->refresh();
    }

    public function reject(int $id, string $reason, ?int $approvedBy = null): AttendanceAdjustment
    {
        $adjustment = $this->attendanceAdjustmentRepository->findOrFail($id);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            throw new \Exception('Adjustment is not in pending status');
        }

        $updateData = [
            'status' => AdjustmentStatusEnum::REJECTED,
            'rejection_reason' => $reason,
            'approved_by' => $approvedBy ?? Auth::id(),
            'approved_at' => now(),
        ];

        $updatedAdjustment = $this->attendanceAdjustmentRepository->update($id, $updateData);

        return $updatedAdjustment->refresh();
    }

    public function updateStatus(int $id, string $status, ?string $reason = null, ?int $approvedBy = null): AttendanceAdjustment
    {
        $adjustment = $this->attendanceAdjustmentRepository->findOrFail($id);
        $updateData = ['status' => AdjustmentStatusEnum::from($status)];

        if ($status === 'approved') {
            $updateData['approved_by'] = $approvedBy ?? Auth::id();
            $updateData['approved_at'] = now();
            $updateData['rejection_reason'] = null;
        } elseif ($status === 'rejected' && $reason) {
            $updateData['rejection_reason'] = $reason;
            $updateData['approved_by'] = $approvedBy ?? Auth::id();
            $updateData['approved_at'] = now();
        }

        $updatedAdjustment = $this->attendanceAdjustmentRepository->update($id, $updateData);

        if ($status === 'approved') {
            $this->attendanceService->updateAttendanceSummary(
                $updatedAdjustment->employee_id,
                $updatedAdjustment->adjustment_date
            );
        }

        return $updatedAdjustment->refresh();
    }

    public function getForEmployee(int $employeeId, array $filters = [])
    {
        $filters['employee_id'] = $employeeId;

        return $this->attendanceAdjustmentRepository->getPaginated($filters, ['employee', 'attendanceRecord', 'requester', 'approver']);
    }

    public function getByUserId(int $userId, array $filters = [])
    {
        $filters['requested_by'] = $userId;

        return $this->attendanceAdjustmentRepository->getPaginated($filters, ['employee', 'attendanceRecord', 'requester', 'approver']);
    }

    public function requestAdjustment(array $data): AttendanceAdjustment
    {
        $requester = Auth::user();
        $employee = $this->employeeService->getById($data['employee_id']);

        if (! $employee) {
            throw new \Exception('Employee not found.');
        }

        // Check if there's already a pending request for this employee and date
        $existingAdjustment = AttendanceAdjustment::where([
            'employee_id' => $data['employee_id'],
            'adjustment_date' => $data['adjustment_date'],
            'status' => AdjustmentStatusEnum::PENDING,
        ])->exists();

        if ($existingAdjustment) {
            throw new \Exception('There is already a pending adjustment request for this employee on the selected date.');
        }

        // Add additional data
        $requestAdjustmentData = array_merge($data, [
            'request_date' => now(),
            'status' => AdjustmentStatusEnum::PENDING,
            'requested_by' => Auth::id(),
        ]);

        return $this->attendanceAdjustmentRepository->create($requestAdjustmentData);
    }
}
