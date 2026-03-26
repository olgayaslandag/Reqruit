<?php

namespace App\Http\Controllers;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceStatusEnum;
use App\Enums\AttendanceTypeEnum;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Services\AttendanceCalculationService;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $query = AttendanceRecord::with(['employee.department']);

        // Apply filters
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $attendances = $query->latest()->paginate(15);

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

        $employee = Employee::findOrFail($request->employee_id);

        // Set current date/time if not provided
        $date = $request->date ? Carbon::parse($request->date) : today();
        $time = $request->time ? Carbon::parse($request->time) : now();

        // Combine date and time properly
        $dateTime = Carbon::combine($date, Carbon::parse($request->time ?? now()->format('H:i')));

        $metadata = [
            'geolocation' => $request->geolocation,
            'ip_address' => $request->ip_address,
            'device_id' => $request->device_id,
            'notes' => $request->notes,
        ];

        try {
            DB::beginTransaction();

            // Record the attendance
            $attendance = $this->attendanceService->recordAttendance(
                $employee->id,
                $date,
                $time,
                AttendanceTypeEnum::CHECK_IN,
                AttendanceSourceEnum::from($request->source),
                $metadata
            );

            // If successful, also try to determine if this is late arrival
            $shift = $this->attendanceService->getEmployeeShiftForDate($employee->id, $date);
            if ($shift) {
                $scheduledStart = Carbon::createFromTime($shift->start_time);
                if ($time->gt($scheduledStart->addMinutes($shift->tolerance_minutes ?? 15))) {
                    $attendance->status = AttendanceStatusEnum::LATE;
                    $attendance->save();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Clock in recorded successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

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

        $employee = Employee::findOrFail($request->employee_id);

        // Set current date/time if not provided
        $date = $request->date ? Carbon::parse($request->date) : today();
        $time = $request->time ? Carbon::parse($request->time) : now();

        $metadata = [
            'geolocation' => $request->geolocation,
            'ip_address' => $request->ip_address,
            'device_id' => $request->device_id,
            'notes' => $request->notes,
        ];

        try {
            DB::beginTransaction();

            // Record the attendance
            $attendance = $this->attendanceService->recordAttendance(
                $employee->id,
                $date,
                $time,
                AttendanceTypeEnum::CHECK_OUT,
                AttendanceSourceEnum::from($request->source),
                $metadata
            );

            // If successful, also try to determine if this is early departure
            $shift = $this->attendanceService->getEmployeeShiftForDate($employee->id, $date);
            if ($shift) {
                $scheduledEnd = Carbon::createFromTime($shift->end_time);
                if ($time->lt($scheduledEnd->subMinutes($shift->tolerance_minutes ?? 15))) {
                    $attendance->status = AttendanceStatusEnum::EARLY_LEAVE;
                    $attendance->save();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Clock out recorded successfully',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to record clock out: '.$e->getMessage(),
            ], 500);
        }
    }

    public function forEmployee(Request $request, int $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);

        $query = AttendanceRecord::where('employee_id', $employeeId)->with(['employee.department']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $attendances = $query->orderBy('date', 'desc')->orderBy('time', 'asc')->paginate(15);

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
