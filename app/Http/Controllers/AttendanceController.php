<?php

namespace App\Http\Controllers;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceTypeEnum;
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
        $attendance->load(['employee.department']);

        return inertia('Admin/Attendance/Show', [
            'attendance' => $attendance,
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
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
        $attendance->delete();

        return redirect()->back()->with('success', 'Attendance record deleted successfully.');
    }

    public function clockIn(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
            'time' => 'nullable',
            'source' => 'required|in:device,mobile,web,api',
            'geolocation' => 'nullable|array',
            'ip_address' => 'nullable|string|max:45',
            'device_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
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
            return response()->json([
                'success' => false,
                'message' => 'Failed to record clock in: '.$e->getMessage(),
            ], 500);
        }
    }

    public function clockOut(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
            'time' => 'nullable',
            'source' => 'required|in:device,mobile,web,api',
            'geolocation' => 'nullable|array',
            'ip_address' => 'nullable|string|max:45',
            'device_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
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
            return response()->json([
                'success' => false,
                'message' => 'Failed to record clock out: '.$e->getMessage(),
            ], 500);
        }
    }

    public function forEmployee(Request $request, int $employeeId)
    {
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

    public function scan(Request $request)
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'department_id']);

        $employees->load('department');

        return inertia('Admin/Attendance/Scan', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/Attendance/Create', [
            'employees' => $employees,
        ]);
    }

    public function edit(AttendanceRecord $attendance)
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/Attendance/Edit', [
            'attendance' => $attendance,
            'employees' => $employees,
        ]);
    }
}
