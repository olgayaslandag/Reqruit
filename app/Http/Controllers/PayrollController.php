<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PayrollStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\PayrollPeriod;
use App\Services\PayrollApprovalService;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function __construct(
        protected PayrollService $payrollService,
        protected PayrollApprovalService $approvalService
    ) {
        $this->authorizeResource(PayrollPeriod::class, 'payroll');
    }

    /**
     * Bordro listesi
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'status',
            'payment_frequency',
            'start_date_from',
            'start_date_to',
            'search',
        ]);

        $periods = $this->payrollService->getPaginated(
            $filters,
            ['creator'],
            $request->get('per_page', 15)
        );

        return Inertia::render('Admin/Payroll/Index', [
            'periods' => $periods,
            'filters' => $filters,
        ]);
    }

    /**
     * Bordro oluşturma formu.
     */
    public function create()
    {
        return Inertia::render('Admin/Payroll/Create');
    }

    /**
     * Bordro kaydeder.
     */
    public function store(StorePayrollRequest $request)
    {
        try {
            $period = $this->payrollService->create($request->validated());

            return redirect()->route('admin.payrolls.index')
                ->with('success', 'Bordro dönemi başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Bordro detayı.
     */
    public function show(PayrollPeriod $payroll)
    {
        $period = $this->payrollService->getById($payroll->id, [
            'creator',
            'approvals.approver',
            'payrollItems.employee:id,first_name,last_name,identity_no,marital_status,children_count',
            'payrollItems.salaryComponent:id,name,type,is_taxable,is_sgk_applicable',
        ]);

        // PayrollItems'dan employees ve salaryComponents oluştur (minimum kolonlarla)
        $employees = $period->payrollItems->map(function ($item) {
            $employee = $item->employee;

            return [
                'id' => $employee->id,
                'name' => $employee->first_name.' '.$employee->last_name,
                'identity_no' => $this->maskIdentityNumber($employee->identity_no),
                'gross_salary' => $employee->gross_salary,
                'marital_status' => $employee->marital_status,
                'children_count' => $employee->children_count,
                'meal_allowance' => $item->meal_allowance,
                'transport_allowance' => $item->transport_allowance,
                'housing_allowance' => $item->housing_allowance,
            ];
        });

        $salaryComponents = $period->payrollItems->pluck('salaryComponent')
            ->filter()
            ->unique('id')
            ->values()
            ->map(function ($component) {
                return [
                    'id' => $component->id,
                    'name' => $component->name,
                    'type' => $component->type,
                    'is_taxable' => $component->is_taxable,
                    'is_sgk_applicable' => $component->is_sgk_applicable,
                ];
            });

        return Inertia::render('Admin/Payroll/Show', [
            'period' => $period,
            'employees' => $employees,
            'salaryComponents' => $salaryComponents,
        ]);
    }

    /**
     * Bordro düzenleme formu.
     */
    public function edit(PayrollPeriod $payroll)
    {
        $period = $this->payrollService->getById($payroll->id);

        return Inertia::render('Admin/Payroll/Edit', [
            'period' => $period,
        ]);
    }

    /**
     * Bordro günceller.
     */
    public function update(UpdatePayrollRequest $request, PayrollPeriod $payroll)
    {
        try {
            $this->payrollService->update($payroll->id, $request->validated());

            return redirect()->route('admin.payrolls.index')
                ->with('success', 'Bordro dönemi başarıyla güncellendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Bordro siler.
     */
    public function destroy(PayrollPeriod $payroll)
    {
        try {
            $this->payrollService->delete($payroll->id);

            return redirect()->route('admin.payrolls.index')
                ->with('success', 'Bordro dönemi başarıyla silindi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Bordro kalemlerini oluşturur.
     */
    public function generateItems(PayrollPeriod $payroll)
    {
        $this->authorize('generateItems', $payroll);

        try {
            $items = $this->payrollService->generatePayrollItems($payroll->id);

            return back()->with('success', count($items).' bordro kalemi oluşturuldu.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Bordro onaylar.
     */
    public function approve(ApprovePayrollRequest $request, PayrollPeriod $payroll)
    {
        $this->authorize('approve', $payroll);

        try {
            $this->payrollService->approve(
                $payroll->id,
                Auth::id(),
                $this->resolveApprovalRole($payroll),
                $request->validated()['comment'] ?? null
            );

            return back()->with('success', 'Bordro başarıyla onaylandı.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Bordro yayınlar.
     */
    public function publish(PayrollPeriod $payroll)
    {
        $this->authorize('publish', $payroll);

        try {
            $this->approvalService->publish($payroll->id);

            return back()->with('success', 'Bordro başarıyla yayınlandı.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Onay rolünü istemciden değil, oturum açmış kullanıcının gerçek rolünden türetir.
     */
    private function resolveApprovalRole(PayrollPeriod $payroll): string
    {
        $user = Auth::user();

        $enumToRole = [
            UserRoleEnum::ADMIN->value => 'admin',
            UserRoleEnum::IK_MANAGER->value => 'hr',
            UserRoleEnum::DEPARTMENT_HEAD->value => 'manager',
        ];

        $role = $enumToRole[$user->rank_id?->value ?? $user->rank_id ?? 0] ?? null;

        if (! $role && $user->hasRole('accounting')) {
            $role = 'accounting';
        }

        // Admin her aşamada onaylayabilir: mevcut duruma göre sıradaki onay rolünü seç
        if ($role === 'admin') {
            $role = match (PayrollStatusEnum::from($payroll->status)) {
                PayrollStatusEnum::DRAFT => 'manager',
                PayrollStatusEnum::MANAGER_APPROVED => 'hr',
                PayrollStatusEnum::HR_APPROVED => 'accounting',
                default => 'admin',
            };
        }

        if (! $role) {
            throw new \Exception('Bu bordroyu onaylamak için yetkiniz bulunmuyor.');
        }

        return $role;
    }

    private function maskIdentityNumber(?string $identityNo): ?string
    {
        if (! $identityNo || strlen($identityNo) !== 11) {
            return $identityNo;
        }

        // Show only last 4 digits, mask others with X
        return 'XXXXX'.substr($identityNo, -4);
    }
}
