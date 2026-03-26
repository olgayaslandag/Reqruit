<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;
use App\Models\Shift;
use App\Services\ShiftService;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    protected ShiftService $shiftService;

    public function __construct(ShiftService $shiftService)
    {
        $this->shiftService = $shiftService;
    }

    public function index(Request $request)
    {
        $query = Shift::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $shifts = $query->paginate(15);

        return inertia('Admin/Shifts/Index', [
            'shifts' => $shifts,
        ]);
    }

    public function show(Shift $shift)
    {
        return inertia('Admin/Shifts/Show', [
            'shift' => $shift,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Shifts/Create');
    }

    public function store(StoreShiftRequest $request)
    {
        $data = $request->validated();

        $shift = $this->shiftService->createShift($data);

        return redirect()->route('admin.shifts.index')->with('success', 'Vardiya başarıyla oluşturuldu.');
    }

    public function edit(Shift $shift)
    {
        return inertia('Admin/Shifts/Edit', [
            'shift' => $shift,
        ]);
    }

    public function update(UpdateShiftRequest $request, Shift $shift)
    {
        $data = $request->validated();

        $updatedShift = $this->shiftService->updateShift($shift, $data);

        return redirect()->route('admin.shifts.index')->with('success', 'Vardiya başarıyla güncellendi.');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();

        return redirect()->route('admin.shifts.index')->with('success', 'Vardiya başarıyla silindi.');
    }

    public function assignToEmployee(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:shifts,id',
            'date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        try {
            $shiftAssignment = $this->shiftService->assignShiftToEmployee(
                $request->employee_id,
                $request->shift_id,
                $request->date,
                $request->note
            );

            return response()->json([
                'success' => true,
                'message' => 'Shift assigned successfully',
                'assignment' => $shiftAssignment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign shift: '.$e->getMessage(),
            ], 500);
        }
    }

    public function assignBulk(Request $request)
    {
        $request->validate([
            'employee_ids' => 'required|array',
            'employee_ids.*' => 'exists:employees,id',
            'shift_id' => 'required|exists:shifts,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'recurrence' => 'nullable|string|in:daily,weekly',
        ]);

        try {
            $assignments = $this->shiftService->bulkAssignShift(
                $request->employee_ids,
                $request->shift_id,
                $request->start_date,
                $request->end_date ?? $request->start_date,
                $request->recurrence
            );

            return response()->json([
                'success' => true,
                'message' => 'Shifts assigned successfully',
                'assignments' => $assignments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign shifts: '.$e->getMessage(),
            ], 500);
        }
    }

    public function getEmployeeSchedule(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
        ]);

        $shift = $this->shiftService->getEmployeeShiftForDate(
            $request->employee_id,
            \Carbon\Carbon::parse($request->date)
        );

        return response()->json([
            'success' => true,
            'shift' => $shift,
        ]);
    }

    public function schedules(Request $request)
    {
        $query = \App\Models\ShiftSchedule::with(['employee', 'shift']);

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $schedules = $query->orderBy('date', 'desc')->paginate(20);

        return inertia('Admin/Shifts/Schedules', [
            'schedules' => $schedules,
        ]);
    }
}
