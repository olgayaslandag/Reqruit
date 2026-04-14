<?php

declare(strict_types=1);

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

        $leaveRequests = $this->leaveRequestRepository->getPaginated($filters, [], 15);

        $employees = Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name'])->toArray();
        $leaveTypes = LeaveType::orderBy('name')->get(['id', 'name'])->toArray();

        return Inertia::render('Admin/Leave/LeaveRequests', [
            'leaveRequests' => $leaveRequests,
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
            'filters' => $filters,
        ]);
    }

    public function store(StoreLeaveRequestRequest $request)
    {
        try {
            $data = $request->validated();

            // Start a database transaction to prevent race conditions
            $leaveRequest = DB::transaction(function () use ($data) {
                // Lock the entitlement record to prevent concurrent updates
                $entitlement = LeaveEntitlement::where('employee_id', $data['employee_id'])
                    ->where('leave_type_id', $data['leave_type_id'])
                    ->whereYear('calculation_year_start', date('Y', strtotime($data['start_date'])))
                    ->lockForUpdate() // This ensures atomicity by locking the row during transaction
                    ->first();

                if (! $entitlement) {
                    throw new \Exception('İzin hakkı bulunamadı.');
                }

                // Calculate requested days
                $requestedDays = $this->calculateBusinessDays($data['start_date'], $data['end_date'], $data['is_half_day']);

                // Check if enough leave balance remains
                if ($entitlement->remaining_days < $requestedDays) {
                    throw new \Exception('Yeterli izin hakkınız bulunmamaktadır.');
                }

                // Create the leave request
                $leaveRequest = $this->leaveRequestRepository->create(array_merge($data, [
                    'status' => 'pending',
                ]));

                return $leaveRequest;
            });

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
        // Start transaction with row locking to prevent race conditions
        DB::transaction(function () use ($leaveRequest, $data) {
            // Lock the entitlement record to ensure atomic operations
            $entitlement = LeaveEntitlement::where('employee_id', $leaveRequest->employee_id)
                ->where('leave_type_id', $leaveRequest->leave_type_id)
                ->whereYear('calculation_year_start', date('Y', strtotime($leaveRequest->start_date)))
                ->lockForUpdate()
                ->first();

            if ($entitlement) {
                $usedDays = $this->calculateBusinessDays($leaveRequest->start_date, $leaveRequest->end_date, $leaveRequest->is_half_day);

                // Verify remaining days again during approval in case they changed since submission
                if ($entitlement->remaining_days < $usedDays) {
                    throw new \Exception('İzninizin kullanıldığı süre boyunca izin bakiyeniz değişmiş olabilir. Lütfen tekrar kontrol edin.');
                }

                $entitlement->used_days += $usedDays;
                $entitlement->remaining_days -= $usedDays;  // Update remaining days
                $entitlement->save();
            }

            $this->leaveRequestRepository->update($leaveRequest->id, array_merge($data, [
                'approved_at' => now(),
                'approver_id' => Auth::id(),
            ]));
        });

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
