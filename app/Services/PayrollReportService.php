<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Employee;
use App\Models\PayrollPeriod;
use Illuminate\Http\Request;

class PayrollReportService
{
    public function __construct(
        protected SalaryCalculationService $salaryCalculationService
    ) {}

    /**
     * Bordro özet raporu oluşturur.
     */
    public function getPayrollSummary(PayrollPeriod $period): array
    {
        $items = $period->payrollItems()->with('salaryComponent')->get();

        $totalEarnings = 0;
        $totalDeductions = 0;

        $byComponent = [];

        foreach ($items as $item) {
            $componentType = $item->salaryComponent->type;

            if ($componentType === 'earning') {
                $totalEarnings += $item->amount;
            } else {
                $totalDeductions += $item->amount;
            }

            // Component bazlı toplam
            $componentId = $item->salary_component_id;
            if (! isset($byComponent[$componentId])) {
                $byComponent[$componentId] = [
                    'component' => $item->salaryComponent,
                    'total_amount' => 0,
                    'employee_count' => 0,
                ];
            }
            $byComponent[$componentId]['total_amount'] += $item->amount;
            $byComponent[$componentId]['employee_count']++;
        }

        return [
            'period' => $period,
            'total_employees' => $items->pluck('employee_id')->unique()->count(),
            'total_earnings' => $totalEarnings,
            'total_deductions' => $totalDeductions,
            'net_total' => $totalEarnings - $totalDeductions,
            'by_component' => array_values($byComponent),
        ];
    }

    /**
     * Çalışan bazlı bordro raporu oluşturur.
     */
    public function getEmployeePayrollReport(PayrollPeriod $period, int $employeeId): array
    {
        $employee = Employee::findOrFail($employeeId);
        $items = $period->payrollItems()
            ->where('employee_id', $employeeId)
            ->with('salaryComponent')
            ->get();

        $calculations = $this->salaryCalculationService->calculateAllDeductions($employee, $period->start_date);

        $earnings = $items->filter(fn ($item) => $item->salaryComponent->type === 'earning');
        $deductions = $items->filter(fn ($item) => $item->salaryComponent->type === 'deduction');

        return [
            'period' => $period,
            'employee' => $employee,
            'items' => [
                'earnings' => $earnings,
                'deductions' => $deductions,
            ],
            'calculations' => $calculations,
        ];
    }

    /**
     * Dönemler arası karşılaştırmalı rapor.
     */
    public function comparePeriods(array $periodIds): array
    {
        $periods = PayrollPeriod::whereIn('id', $periodIds)
            ->with('payrollItems.salaryComponent')
            ->get()
            ->sortBy('start_date');

        $comparison = [];

        foreach ($periods as $period) {
            $items = $period->payrollItems;

            $earnings = 0;
            $deductions = 0;
            $employeeCount = 0;

            foreach ($items as $item) {
                if ($item->salaryComponent->type === 'earning') {
                    $earnings += $item->amount;
                } else {
                    $deductions += $item->amount;
                }
                $employeeCount = max($employeeCount, $item->employee_id);
            }

            // Alternative approach to get unique employee count
            $employeeCount = $items->pluck('employee_id')->unique()->count();

            $comparison[] = [
                'period' => $period,
                'total_gross' => $earnings,
                'total_deductions' => $deductions,
                'employee_count' => $employeeCount,
            ];
        }

        return $comparison;
    }

    /**
     * Yıllık maaş özeti raporu.
     */
    public function getAnnualSummary(int $year): array
    {
        $periods = PayrollPeriod::whereYear('start_date', $year)
            ->where('status', 'published')
            ->with('payrollItems.salaryComponent')
            ->get();

        $monthlyData = [];
        $totalGross = 0;
        $totalNet = 0;

        foreach ($periods as $period) {
            $items = $period->payrollItems;

            $gross = 0;
            $deductions = 0;

            foreach ($items as $item) {
                if ($item->salaryComponent->type === 'earning') {
                    $gross += $item->amount;
                } else {
                    $deductions += $item->amount;
                }
            }

            $employeeCount = $items->pluck('employee_id')->unique()->count();
            $net = $gross - $deductions;

            $monthlyData[] = [
                'period' => $period->name,
                'month' => $period->start_date->format('m'),
                'gross' => $gross,
                'deductions' => $deductions,
                'net' => $net,
                'employee_count' => $employeeCount,
            ];

            $totalGross += $gross;
            $totalNet += $net;
        }

        return [
            'year' => $year,
            'monthly_data' => $monthlyData,
            'total_gross' => $totalGross,
            'total_net' => $totalNet,
            'average_monthly' => $totalGross / max(1, count($periods)),
        ];
    }

    /**
     * SGK ve vergi özet raporu.
     */
    public function getTaxSummary(PayrollPeriod $period): array
    {
        $employees = $period->employeesInPeriod()->get();

        $calculationsBatch = [];
        foreach ($employees as $employee) {
            $calculations = $this->salaryCalculationService->calculateAllDeductions($employee, $period->start_date);
            $calculationsBatch[$employee->id] = $calculations;
        }

        $totalSgkEmployee = 0;
        $totalSgkEmployer = 0;
        $totalIncomeTax = 0;
        $totalStampTax = 0;
        $totalGross = 0;

        foreach ($calculationsBatch as $calculation) {
            $totalGross += $calculation['gross_salary'];
            $totalSgkEmployee += $calculation['sgk_employee']['total'];
            $totalIncomeTax += $calculation['income_tax'];
            $totalStampTax += $calculation['stamp_tax'];

            // İşveren payı (ayrı hesaplanır)
            $employerCost = $this->salaryCalculationService->calculateEmployerCost($calculation['gross_salary']);
            $totalSgkEmployer += $employerCost['sgk_employer']['total'];
        }

        return [
            'period' => $period,
            'total_gross' => $totalGross,
            'sgk' => [
                'employee_share' => $totalSgkEmployee,
                'employer_share' => $totalSgkEmployer,
                'total' => $totalSgkEmployee + $totalSgkEmployer,
            ],
            'income_tax' => $totalIncomeTax,
            'stamp_tax' => $totalStampTax,
            'total_deductions' => $totalSgkEmployee + $totalIncomeTax + $totalStampTax,
            'total_net' => $totalGross - ($totalSgkEmployee + $totalIncomeTax + $totalStampTax),
            'total_employer_cost' => $totalGross + $totalSgkEmployer,
        ];
    }

    public function getMonthlyComparison(Request $request)
    {
        // Get monthly comparison data
        $startDate = $request->get('start_date', now()->startOfYear()->toDateString());
        $endDate = $request->get('end_date', now()->endOfYear()->toDateString());

        $periods = PayrollPeriod::whereBetween('start_date', [$startDate, $endDate])
            ->orderBy('start_date')
            ->get();

        $comparison = [];
        foreach ($periods as $period) {
            $summary = $this->getTaxSummary($period);
            $comparison[] = [
                'period' => $period,
                'total_gross' => $summary['total_gross'],
                'sgk' => $summary['sgk'],
                'income_tax' => $summary['income_tax'],
                'stamp_tax' => $summary['stamp_tax'],
                'total_deductions' => $summary['total_deductions'],
                'total_net' => $summary['total_net'],
                'total_employer_cost' => $summary['total_employer_cost'],
            ];
        }

        return $comparison;
    }

    /**
     * Departman bazlı maaş raporu.
     */
    public function getDepartmentSummary(PayrollPeriod $period): array
    {
        $items = $period->payrollItems()
            ->with(['employee.department', 'salaryComponent'])
            ->get()
            ->groupBy('employee.department_id');

        $summary = [];

        foreach ($items as $departmentId => $departmentItems) {
            $firstItem = $departmentItems->first();
            $department = $firstItem->employee->department;

            $earnings = $departmentItems
                ->filter(fn ($item) => $item->salaryComponent->type === 'earning')
                ->sum('amount');

            $deductions = $departmentItems
                ->filter(fn ($item) => $item->salaryComponent->type === 'deduction')
                ->sum('amount');

            $summary[] = [
                'department' => $department,
                'employee_count' => $departmentItems->pluck('employee_id')->unique()->count(),
                'total_gross' => $earnings,
                'total_deductions' => $deductions,
                'total_net' => $earnings - $deductions,
                'average_gross' => $earnings / $departmentItems->pluck('employee_id')->unique()->count(),
            ];
        }

        return $summary;
    }
}
