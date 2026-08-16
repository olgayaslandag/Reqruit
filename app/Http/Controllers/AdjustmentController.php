<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\AdjustmentStatusEnum;
use App\Http\Requests\ApproveAdjustmentRequest;
use App\Http\Requests\RejectAdjustmentRequest;
use App\Http\Requests\RequestAdjustmentRequest;
use App\Http\Requests\StoreAdjustmentRequest;
use App\Http\Requests\UpdateAdjustmentRequest;
use App\Http\Requests\UpdateAdjustmentStatusRequest;
use App\Models\AttendanceAdjustment;
use App\Models\Employee;
use App\Services\AttendanceAdjustmentService;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdjustmentController extends Controller
{
    protected AttendanceService $attendanceService;

    protected AttendanceAdjustmentService $attendanceAdjustmentService;

    public function __construct(AttendanceService $attendanceService, AttendanceAdjustmentService $attendanceAdjustmentService)
    {
        $this->attendanceService = $attendanceService;
        $this->attendanceAdjustmentService = $attendanceAdjustmentService;
        $this->authorizeResource(AttendanceAdjustment::class, 'adjustment');
    }

    public function index(Request $request)
    {
        // Manual authorization check
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

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
            $query->where('adjustment_date', '>=', $request->adjustment_date)
                ->where('adjustment_date', '<=', $request->adjustment_date);
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

        $adjustment = $this->attendanceAdjustmentService->create($data);

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

        $updatedAdjustment = $this->attendanceAdjustmentService->update($adjustment->id, $data);

        return redirect()->route('admin.adjustments.index')->with('success', 'Düzeltme başarıyla güncellendi.');
    }

    public function destroy(AttendanceAdjustment $adjustment)
    {
        $deleted = $this->attendanceAdjustmentService->delete($adjustment->id);

        return redirect()->route('admin.adjustments.index')->with('success', 'Düzeltme başarıyla silindi.');
    }

    public function approve(ApproveAdjustmentRequest $request, AttendanceAdjustment $adjustment)
    {
        $this->authorize('approve', $adjustment);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            return response()->json([
                'success' => false,
                'message' => 'Adjustment is not in pending status',
            ], 400);
        }

        try {
            $updatedAdjustment = $this->attendanceAdjustmentService->approve($adjustment->id);

            return response()->json([
                'success' => true,
                'message' => 'Adjustment approved successfully',
                'adjustment' => $updatedAdjustment,
            ]);
        } catch (\Exception $e) {
            \Log::error('Adjustment approval failed', [
                'message' => $e->getMessage(),
                'adjustment_id' => $adjustment->id ?? null,
                'user_id' => auth()->id() ?? null,
                'ip' => request()->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve adjustment',
            ], 500);
        }
    }

    public function reject(RejectAdjustmentRequest $request, AttendanceAdjustment $adjustment)
    {
        $this->authorize('reject', $adjustment);

        if ($adjustment->status !== AdjustmentStatusEnum::PENDING) {
            return response()->json([
                'success' => false,
                'message' => 'Adjustment is not in pending status',
            ], 400);
        }

        $rejectReason = $request->validated()['rejection_reason'];

        $updatedAdjustment = $this->attendanceAdjustmentService->reject($adjustment->id, $rejectReason);

        return response()->json([
            'success' => true,
            'message' => 'Adjustment rejected successfully',
            'adjustment' => $updatedAdjustment,
        ]);
    }

    public function updateStatus(UpdateAdjustmentStatusRequest $request, AttendanceAdjustment $adjustment)
    {
        $this->authorize('update', $adjustment);

        $validated = $request->validated();

        $status = $validated['status'];
        $reason = $validated['status'] === 'rejected' && isset($validated['reason']) ? $validated['reason'] : null;

        $updatedAdjustment = $this->attendanceAdjustmentService->updateStatus($adjustment->id, $status, $reason);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'adjustment' => $updatedAdjustment,
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
            $query->where('adjustment_date', '>=', $request->adjustment_date)
                ->where('adjustment_date', '<=', $request->adjustment_date);
        }

        $adjustments = $query->latest()->paginate(15);

        return inertia('Adjustments/MyRequests', [
            'adjustments' => $adjustments,
        ]);
    }

    public function requestAdjustment(RequestAdjustmentRequest $request)
    {
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

        try {
            $adjustment = $this->attendanceAdjustmentService->requestAdjustment([
                'employee_id' => $request->employee_id,
                'adjustment_date' => $request->adjustment_date,
                'from_time' => $request->from_time,
                'to_time' => $request->to_time,
                'reason' => $request->reason,
                'type' => $request->type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Adjustment request submitted successfully',
                'adjustment' => $adjustment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
