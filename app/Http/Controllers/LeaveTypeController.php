<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use App\Interfaces\ILeaveTypeRepository;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    public function __construct(
        protected ILeaveTypeRepository $leaveTypeRepository
    ) {
        $this->authorizeResource(LeaveType::class, 'leaveType');
    }

    public function index(Request $request)
    {
        $leaveTypes = $this->leaveTypeRepository->getAll()->toArray();

        return Inertia::render('Admin/Leave/LeaveTypes', [
            'leaveTypes' => $leaveTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Leave/Create');
    }

    public function store(StoreLeaveTypeRequest $request)
    {
        try {
            $leaveType = $this->leaveTypeRepository->create($request->validated());

            return redirect()->route('admin.leave.types.index')->with('success', 'İzin türü başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(LeaveType $leaveType)
    {
        return response()->json($leaveType);
    }

    public function edit(LeaveType $leaveType)
    {
        return Inertia::render('Admin/Leave/Edit', [
            'leaveType' => $leaveType,
        ]);
    }

    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType)
    {
        try {
            $updated = $this->leaveTypeRepository->update($leaveType->id, $request->validated());

            return redirect()->route('admin.leave.types.index')->with('success', 'İzin türü başarıyla güncellendi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(LeaveType $leaveType)
    {
        try {
            $this->leaveTypeRepository->delete($leaveType->id);

            return redirect()->back()->with('success', 'İzin türü başarıyla silindi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
