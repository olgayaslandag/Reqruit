<?php

namespace App\Http\Controllers;

use App\Enums\AdjustmentStatusEnum;
use App\Http\Requests\StoreAdjustmentRequest;
use App\Http\Requests\UpdateAdjustmentRequest;
use App\Models\AttendanceAdjustment;
use App\Models\Employee;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdjustmentController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index(Request $request)
    {
        $query = AttendanceAdjustment::query()->with(['employee', 'attendanceRecord', 'requester', 'approver']);

        // Apply filters
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('adjustment_date')) {
            $query->whereDate('adjustment_date', $request->adjustment_date);
        }

        $adjustments = $query->latest()->paginate(15);

        return inertia('Admin/AttendanceAdjustments/Index', [
            'adjustments' => $adjustments,
        ]);
    }

    public function show(AttendanceAdjustment $adjustment)
    {
        $adjustment->load(['employee', 'attendanceRecord', 'requester', 'approver']);

        return inertia('Admin/AttendanceAdjustments/Show', [
            'adjustment' => $adjustment,
        ]);
    }

    public function create()
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/AttendanceAdjustments/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(StoreAdjustmentRequest $request)
    {
        $data = $request->validated();

        $data['employee_id'] = $data['employee_id'];
        $data['request_date'] = now();
        $data['requested_by'] = Auth::id();
        $data['status'] = AdjustmentStatusEnum::PENDING;

        $adjustment = AttendanceAdjustment::create($data);

        return redirect()->route('admin.adjustments.index')->with('success', 'Düzeltme talebi başarıyla oluşturuldu.');
    }

    public function edit(AttendanceAdjustment $adjustment)
    {
        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/AttendanceAdjustments/Edit', [
            'adjustment' => $adjustment,
            'employees' => $employees,
        ]);
    }

    public function update(UpdateAdjustmentRequest $request, AttendanceAdjustment $adjustment)
    {
        $data = $request->validated();

        $adjustment->update($data);

        return redirect()->route('admin.adjustments.index')->with('success', 'Düzeltme başarıyla güncellendi.');
    }

    public function destroy(AttendanceAdjustment $adjustment)
    {
        $adjustment->delete();

        return redirect()->route('admin.adjustments.index')->with('success', 'Düzeltme başarıyla silindi.');
    }

    public function approve(Request $request, AttendanceAdjustment $adjustment)
    {
        $request->validate([
            'approval_notes' => 'nullable|string|max:1000',
        ]);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            return response()->json([
                'success' => false,
                'message' => 'Adjustment is not in pending status',
            ], 400);
        }

        DB::beginTransaction();

        try {
            $adjustment->update([
                'status' => AdjustmentStatusEnum::APPROVED,
                'approved_by' => Auth::id(),
                'approved_at' => now(),
                'rejection_reason' => null,
            ]);

            // Recalculate the attendance summary for the affected date
            $this->attendanceService->updateAttendanceSummary(
                $adjustment->employee_id,
                $adjustment->adjustment_date
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Adjustment approved successfully',
                'adjustment' => $adjustment->refresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve adjustment: '.$e->getMessage(),
            ], 500);
        }
    }

    public function reject(Request $request, AttendanceAdjustment $adjustment)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            return response()->json([
                'success' => false,
                'message' => 'Adjustment is not in pending status',
            ], 400);
        }

        $adjustment->update([
            'status' => AdjustmentStatusEnum::REJECTED,
            'rejection_reason' => $request->rejection_reason,
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Adjustment rejected successfully',
            'adjustment' => $adjustment->refresh(),
        ]);
    }

    public function updateStatus(Request $request, AttendanceAdjustment $adjustment)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $updateData = ['status' => AdjustmentStatusEnum::from($request->status)];

        if ($request->status === 'approved') {
            $updateData['approved_by'] = Auth::id();
            $updateData['approved_at'] = now();
            $updateData['rejection_reason'] = null;
        } elseif ($request->status === 'rejected' && $request->has('reason')) {
            $updateData['rejection_reason'] = $request->reason;
            $updateData['approved_by'] = Auth::id();
            $updateData['approved_at'] = now();
        }

        $adjustment->update($updateData);

        if ($request->status === 'approved') {
            $this->attendanceService->updateAttendanceSummary(
                $adjustment->employee_id,
                $adjustment->adjustment_date
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'adjustment' => $adjustment->refresh(),
        ]);
    }

    public function myRequests(Request $request)
    {
        $query = AttendanceAdjustment::where('requested_by', Auth::id())
            ->with(['employee', 'attendanceRecord', 'requester', 'approver']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('adjustment_date')) {
            $query->whereDate('adjustment_date', $request->adjustment_date);
        }

        $adjustments = $query->latest()->paginate(15);

        return inertia('Adjustments/MyRequests', [
            'adjustments' => $adjustments,
        ]);
    }

    public function requestAdjustment(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'adjustment_date' => 'required|date',
            'from_time' => 'required_without:to_time|nullable|date_format:H:i',
            'to_time' => 'required_without:from_time|nullable|date_format:H:i',
            'type' => 'required|in:missing,wrong,overtime_request',
            'reason' => 'required|string|max:1000',
        ]);

        $requester = Auth::user();
        $employee = Employee::findOrFail($request->employee_id);

        // Check if user can make adjustments for this employee
        if ($requester->cannot('make-adjustment-for', $employee)) {
            abort(403);
        }

        // Check for existing pending requests for the same employee and date
        $existingAdjustment = AttendanceAdjustment::where([
            'employee_id' => $request->employee_id,
            'adjustment_date' => $request->adjustment_date,
            'status' => AdjustmentStatusEnum::PENDING,
        ])->exists();

        if ($existingAdjustment) {
            return response()->json([
                'success' => false,
                'message' => 'There is already a pending adjustment request for this employee on the selected date.',
            ], 400);
        }

        $adjustment = AttendanceAdjustment::create([
            'employee_id' => $request->employee_id,
            'request_date' => now(),
            'adjustment_date' => $request->adjustment_date,
            'from_time' => $request->from_time,
            'to_time' => $request->to_time,
            'reason' => $request->reason,
            'type' => $request->type,
            'status' => AdjustmentStatusEnum::PENDING,
            'requested_by' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Adjustment request submitted successfully',
            'adjustment' => $adjustment,
        ]);
    }
}
