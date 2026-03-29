<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use App\Interfaces\ILeaveRequestRepository;
use App\Models\Employee;
use App\Models\LeaveEntitlement;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public function __construct(
        protected ILeaveRequestRepository $leaveRequestRepository
    ) {
        $this->authorizeResource(LeaveRequest::class, 'leaveRequest');
    }

    public function index(Request $request)
    {
        $filters = $request->only(['employee_id', 'leave_type_id', 'status', 'approver_id', 'start_date_from', 'start_date_to', 'year']);
        $with = ['employee', 'leaveType', 'approver'];

        $leaveRequests = $this->leaveRequestRepository->getAll($filters, $with);

        $employees = Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name'])->toArray();
        $leaveTypes = LeaveType::orderBy('name')->get(['id', 'name'])->toArray();

        return Inertia::render('Admin/Leave/LeaveRequests', [
            'leaveRequests' => $leaveRequests->toArray(),
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
            'filters' => $filters,
        ]);
    }

    public function store(StoreLeaveRequestRequest $request)
    {
        try {
            $data = $request->validated();

            // Izin hakkı kontrolü
            $entitlement = LeaveEntitlement::where('employee_id', $data['employee_id'])
                ->where('leave_type_id', $data['leave_type_id'])
                ->whereYear('calculation_year_start', date('Y', strtotime($data['start_date'])))
                ->first();

            if (! $entitlement) {
                return redirect()->back()->with('error', 'İzin hakkı bulunamadı.');
            }

            // Izin kullanılabilir mi kontrolü
            $requestedDays = $this->calculateBusinessDays($data['start_date'], $data['end_date'], $data['is_half_day']);
            if ($entitlement->remaining_days < $requestedDays) {
                return redirect()->back()->with('error', 'Yeterli izin hakkınız bulunmamaktadır.');
            }

            $leaveRequest = $this->leaveRequestRepository->create(array_merge($data, [
                'status' => 'pending',
            ]));

            return redirect()->back()->with('success', 'İzin talebiniz başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return response()->json($leaveRequest->load('employee', 'leaveType', 'approver'));
    }

    public function update(UpdateLeaveRequestRequest $request, LeaveRequest $leaveRequest)
    {
        try {
            $data = $request->validated();

            // Status değişikliklerini özel olarak ele al
            if (isset($data['status']) && $data['status'] !== $leaveRequest->status) {
                return $this->handleStatusChange($leaveRequest, $data);
            }

            $updatedLeaveRequest = $this->leaveRequestRepository->update($leaveRequest->id, $data);

            return redirect()->back()->with('success', 'İzin talebi başarıyla güncellendi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        try {
            // Sadece bekleyen izinler silinebilir
            if ($leaveRequest->status !== 'pending') {
                return redirect()->back()->with('error', 'Sadece bekleyen izin talepleri silinebilir.');
            }

            $this->leaveRequestRepository->delete($leaveRequest->id);

            return redirect()->back()->with('success', 'İzin talebi başarıyla silindi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    private function handleStatusChange(LeaveRequest $leaveRequest, array $data)
    {
        if ($data['status'] === 'approved') {
            return $this->approveLeaveRequest($leaveRequest, $data);
        } elseif ($data['status'] === 'rejected') {
            return $this->rejectLeaveRequest($leaveRequest, $data);
        } elseif ($data['status'] === 'cancelled') {
            return $this->cancelLeaveRequest($leaveRequest);
        }

        return redirect()->back()->with('error', 'Geçersiz izin durumu.');
    }

    private function approveLeaveRequest(LeaveRequest $leaveRequest, array $data)
    {
        // Kalan izin hakkını güncelle
        $entitlement = LeaveEntitlement::where('employee_id', $leaveRequest->employee_id)
            ->where('leave_type_id', $leaveRequest->leave_type_id)
            ->whereYear('calculation_year_start', date('Y', strtotime($leaveRequest->start_date)))
            ->first();

        if ($entitlement) {
            $usedDays = $this->calculateBusinessDays($leaveRequest->start_date, $leaveRequest->end_date, $leaveRequest->is_half_day);
            $entitlement->used_days += $usedDays;
            $entitlement->save();
        }

        $updated = $this->leaveRequestRepository->update($leaveRequest->id, array_merge($data, [
            'approved_at' => now(),
            'approver_id' => Auth::id(),
        ]));

        return redirect()->back()->with('success', 'İzin talebi başarıyla onaylandı.');
    }

    private function rejectLeaveRequest(LeaveRequest $leaveRequest, array $data)
    {
        $updated = $this->leaveRequestRepository->update($leaveRequest->id, $data);

        return redirect()->back()->with('success', 'İzin talebi reddedildi.');
    }

    private function cancelLeaveRequest(LeaveRequest $leaveRequest)
    {
        $updated = $this->leaveRequestRepository->update($leaveRequest->id, ['status' => 'cancelled']);

        return redirect()->back()->with('success', 'İzin talebi iptal edildi.');
    }

    private function calculateBusinessDays(string $startDate, string $endDate, bool $isHalfDay): int
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $interval = new \DateInterval('P1D');
        $period = new \DatePeriod($start, $interval, $end);

        $businessDays = 0;
        foreach ($period as $date) {
            $dayOfWeek = $date->format('N'); // 1=Monday, 7=Sunday
            if ($dayOfWeek < 6) { // Monday to Friday
                $businessDays++;
            }
        }

        // Include the end date if it's a business day
        if ($end->format('N') < 6) {
            $businessDays++;
        }

        return $isHalfDay ? $businessDays / 2 : $businessDays;
    }
}
