<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceTypeEnum;
use App\Http\Requests\ManualClockRequest;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Services\AttendanceCalculationService;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    protected AttendanceCalculationService $calculationService;

    public function __construct(
        AttendanceService $attendanceService,
        AttendanceCalculationService $calculationService
    ) {
        $this->attendanceService = $attendanceService;
        $this->calculationService = $calculationService;
    }

    public function index(Request $request)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $filters = [
            'employee_id' => $request->employee_id,
            'date' => $request->date,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'type' => $request->type,
        ];

        $attendances = $this->attendanceService->getFilteredAttendances($filters);

        return inertia('Admin/Attendance/Index', [
            'attendances' => $attendances,
        ]);
    }

    public function show(AttendanceRecord $attendance)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2]) && $attendance->employee->user_id !== $user?->id) {
            abort(403, 'Unauthorized');
        }

        $attendance->load(['employee.department']);

        return inertia('Admin/Attendance/Show', [
            'attendance' => $attendance,
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validated();

        $employee = Employee::findOrFail($data['employee_id']);
        $date = Carbon::parse($data['date']);
        $time = Carbon::parse($data['time']);
        $type = AttendanceTypeEnum::from($data['type']);
        $source = AttendanceSourceEnum::from($data['source']);

        // Prepare metadata
        $metadata = [
            'geolocation' => $data['geolocation'] ?? null,
            'ip_address' => $data['ip_address'] ?? null,
            'device_id' => $data['device_id'] ?? null,
            'notes' => $data['notes'] ?? null,
        ];

        $attendance = $this->attendanceService->recordAttendance(
            $employee->id,
            $date,
            $time,
            $type,
            $source,
            $metadata
        );

        return redirect()->back()->with('success', 'Attendance record created successfully.');
    }

    public function update(UpdateAttendanceRequest $request, AttendanceRecord $attendance)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validated();

        // Update the attendance record
        $attendance->update([
            'date' => $data['date'],
            'time' => $data['time'],
            'type' => $data['type'],
            'status' => $data['status'] ?? $attendance->status,
            'geolocation' => $data['geolocation'] ?? null,
            'ip_address' => $data['ip_address'] ?? null,
            'device_id' => $data['device_id'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        // Update the corresponding summary
        $this->attendanceService->updateAttendanceSummary(
            $attendance->employee_id,
            Carbon::parse($data['date'])
        );

        return redirect()->back()->with('success', 'Attendance record updated successfully.');
    }

    public function destroy(AttendanceRecord $attendance)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $attendance->delete();

        return redirect()->back()->with('success', 'Attendance record deleted successfully.');
    }

    public function clockIn(ClockAttendanceRequest $request)
    {
        try {
            $employee = Employee::findOrFail($request->employee_id);

            // Manual authorization check
            $user = auth()->user();
            if (! in_array($user?->rank_id?->value, [1, 2]) && $employee->user_id !== $user?->id) {
                abort(403, 'Unauthorized');
            }

            $attendance = $this->attendanceService->clockIn(
                $request->employee_id,
                $request->date,
                $request->time,
                $request->all()
            );

            return response()->json([
                'success' => true,
                'message' => 'Clock in recorded successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            \Log::error('Clock in failed', [
                'message' => $e->getMessage(),
                'employee_id' => $request->employee_id ?? null,
                'user_id' => auth()->id() ?? null,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to record clock in',
            ], 500);
        }
    }

    public function clockOut(ClockAttendanceRequest $request)
    {
        try {
            $employee = Employee::findOrFail($request->employee_id);

            // Manual authorization check
            $user = auth()->user();
            if (! in_array($user?->rank_id?->value, [1, 2]) && $employee->user_id !== $user?->id) {
                abort(403, 'Unauthorized');
            }

            $attendance = $this->attendanceService->clockOut(
                $request->employee_id,
                $request->date,
                $request->time,
                $request->all()
            );

            return response()->json([
                'success' => true,
                'message' => 'Clock out recorded successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            \Log::error('Clock out failed', [
                'message' => $e->getMessage(),
                'employee_id' => $request->employee_id ?? null,
                'user_id' => auth()->id() ?? null,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to record clock out',
            ], 500);
        }
    }

    public function forEmployee(Request $request, int $employeeId)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $employee = Employee::findOrFail($employeeId);

        $filters = [
            'date' => $request->date,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ];

        $attendances = $this->attendanceService->getEmployeeAttendances($employeeId, $filters);

        return inertia('Attendance/EmployeeAttendance', [
            'employee' => $employee,
            'attendances' => $attendances,
        ]);
    }

    public function manualClock(ManualClockRequest $request)
    {
        try {
            $employeeId = (int) $request->employee_id;
            $timestamp = Carbon::parse($request->timestamp);

            $employee = Employee::findOrFail($employeeId);

            // Manual authorization check - only admin/IK can manually clock for other employees
            $user = auth()->user();
            if (! in_array($user?->rank_id?->value, [1, 2])) {
                abort(403, 'Unauthorized');
            }

            if ($request->type === 'clock_in') {
                $result = $this->attendanceService->manualClockIn(
                    $employeeId,
                    $timestamp,
                );
            } else {
                $result = $this->attendanceService->manualClockOut(
                    $employeeId,
                    $timestamp,
                );
            }

            return redirect()->back()->with('success', $request->type === 'clock_in' ? 'Giriş kaydı başarıyla oluşturuldu.' : 'Çıkış kaydı başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            \Log::error('Manual attendance failed', [
                'message' => $e->getMessage(),
                'employee_id' => $request->employee_id ?? null,
                'user_id' => auth()->id() ?? null,
                'ip' => request()->ip(),
            ]);

            return redirect()->back()->with('error', 'Kayıt başarısız: Lütfen tekrar deneyin veya sistem yöneticinizle iletişime geçin.');
        }
    }

    public function scan(Request $request)
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'department_id']);

        $employees->load('department');

        $recentAttendances = AttendanceRecord::with('employee:id,first_name,last_name')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($record) {
                $timestamp = null;
                if ($record->date && $record->time) {
                    $timeStr = is_string($record->time) ? $record->time : $record->time->format('H:i:s');
                    $timestamp = Carbon::parse($record->date->format('Y-m-d').' '.$timeStr);
                }

                $type = $record->type?->value ?? '';
                $typeDisplay = $type === 'check_in' ? 'clock_in' : ($type === 'check_out' ? 'clock_out' : $type);

                return [
                    'id' => $record->id,
                    'employee' => [
                        'first_name' => $record->employee->first_name,
                        'last_name' => $record->employee->last_name,
                        'identity_no' => $this->maskIdentityNumber($record->employee->identity_no),
                    ],
                    'timestamp' => $timestamp?->toISOString(),
                    'timestamp_formatted' => $timestamp?->format('d.m.Y H:i'),
                    'type' => $typeDisplay,
                    'status' => $record->status?->value ?? '',
                ];
            });

        return inertia('Admin/Attendance/Scan', [
            'employees' => $employees,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    private function maskIdentityNumber(?string $identityNo): ?string
    {
        if (! $identityNo || strlen($identityNo) !== 11) {
            return $identityNo;
        }

        // Show only last 4 digits, mask others with X
        return 'XXXXX'.substr($identityNo, -4);
    }

    public function create()
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/Attendance/Create', [
            'employees' => $employees,
        ]);
    }

    public function edit(AttendanceRecord $attendance)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/Attendance/Edit', [
            'attendance' => $attendance,
            'employees' => $employees,
        ]);
    }
}
