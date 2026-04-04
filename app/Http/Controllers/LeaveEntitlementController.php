<?php

declare(strict_types=1);
namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveEntitlementRequest;
use App\Http\Requests\UpdateLeaveEntitlementRequest;
use App\Interfaces\IEmployeeRepository;
use App\Interfaces\ILeaveEntitlementRepository;
use App\Interfaces\ILeaveTypeRepository;
use App\Models\LeaveEntitlement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveEntitlementController extends Controller
{
    public function __construct(
        protected ILeaveEntitlementRepository $leaveEntitlementRepository,
        protected IEmployeeRepository $employeeRepository,
        protected ILeaveTypeRepository $leaveTypeRepository
    ) {
        $this->authorizeResource(LeaveEntitlement::class, 'leaveEntitlement');
    }

    public function index(Request $request)
    {
        $filters = $request->only(['employee_id', 'leave_type_id', 'year', 'has_remaining']);

        $entitlements = $this->leaveEntitlementRepository->getPaginated($filters, [], 15);

        $employees = $this->employeeRepository->getActiveForDropdown()->toArray();
        $leaveTypes = $this->leaveTypeRepository->getAll()->toArray();

        return Inertia::render('Admin/Leave/LeaveEntitlements', [
            'entitlements' => $entitlements,
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $employees = $this->employeeRepository->getActiveForDropdown()->toArray();
        $leaveTypes = $this->leaveTypeRepository->getAll()->toArray();
        $currentYear = date('Y');

        return Inertia::render('Admin/Leave/CreateEntitlement', [
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
            'currentYear' => $currentYear,
        ]);
    }

    public function store(StoreLeaveEntitlementRequest $request)
    {
        try {
            $entitlement = $this->leaveEntitlementRepository->create($request->validated());

            return redirect()->route('admin.leave.entitlements.index')->with('success', 'İzin hakkı başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(LeaveEntitlement $leaveEntitlement)
    {
        return response()->json($leaveEntitlement->load('employee', 'leaveType'));
    }

    public function edit(LeaveEntitlement $leaveEntitlement)
    {
        $employees = $this->employeeRepository->getActiveForDropdown()->toArray();
        $leaveTypes = $this->leaveTypeRepository->getAll()->toArray();

        return Inertia::render('Admin/Leave/EditEntitlement', [
            'entitlement' => $leaveEntitlement,
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
        ]);
    }

    public function update(UpdateLeaveEntitlementRequest $request, LeaveEntitlement $leaveEntitlement)
    {
        try {
            $entitlement = $this->leaveEntitlementRepository->update($leaveEntitlement->id, $request->validated());

            return redirect()->route('admin.leave.entitlements.index')->with('success', 'İzin hakkı başarıyla güncellendi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(LeaveEntitlement $leaveEntitlement)
    {
        try {
            $this->leaveEntitlementRepository->delete($leaveEntitlement->id);

            return redirect()->back()->with('success', 'İzin hakkı başarıyla silindi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
