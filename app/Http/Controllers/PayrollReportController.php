<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\PayrollPeriod;
use App\Services\PayrollReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollReportController extends Controller
{
    public function __construct(
        protected PayrollReportService $reportService
    ) {}

    /**
     * Check permissions for accessing payroll reports
     */
    public function __call($method, $parameters)
    {
        // This helps control all method access
        if (in_array($method, ['index', 'summary', 'employeeReport', 'compare', 'annual', 'taxSummary', 'departmentSummary'])) {
            $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);
        }

        return parent::__call($method, $parameters);
    }

    /**
     * Bordro raporları ana sayfası.
     */
    public function index(Request $request)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $filters = $request->only(['status', 'start_date', 'end_date']);

        $query = PayrollPeriod::query();
        // Status filter handling:
        // - If status param is not present at all: show only published (default)
        // - If status param is present:
        //     - If it's a non-empty string: filter by that status
        //     - If it's empty string: show all statuses (no status filter)
        if (! array_key_exists('status', $filters)) {
            // Default: only published
            $query->where('status', 'published');
        } elseif ($filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }
        // else status is empty string: no status filter (show all)

        if (! empty($filters['start_date'])) {
            $query->where('start_date', '>=', $filters['start_date']);
        }
        if (! empty($filters['end_date'])) {
            $query->where('end_date', '<=', $filters['end_date']);
        }
        $periods = $query->orderBy('start_date', 'desc')->get(['id', 'name', 'start_date', 'end_date', 'status']);

        return Inertia::render('Admin/PayrollReports/Index', [
            'periods' => $periods,
            'filters' => $filters,
        ]);
    }

    /**
     * Bordro özet raporu.
     */
    public function summary(PayrollPeriod $payroll)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $summary = $this->reportService->getPayrollSummary($payroll);

        return Inertia::render('Admin/PayrollReports/Summary', [
            'summary' => $summary,
        ]);
    }

    /**
     * Çalışan bazlı bordro raporu.
     */
    public function employeeReport(Request $request, PayrollPeriod $payroll)
    {
        $this->authorize('generate-payroll-report', \App\Models\PayrollPeriod::class);

        $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
        ]);

        $report = $this->reportService->getEmployeePayrollReport(
            $payroll,
            $request->input('employee_id')
        );

        return response()->json($report);
    }

    /**
     * Dönem karşılaştırma raporu.
     */
    public function compare(Request $request)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $request->validate([
            'periods' => ['required', 'array', 'min:2'],
            'periods.*' => ['exists:payroll_periods,id'],
        ]);

        $comparison = $this->reportService->comparePeriods($request->input('periods'));

        return Inertia::render('Admin/PayrollReports/Compare', [
            'comparison' => $comparison,
        ]);
    }

    /**
     * Yıllık özet rapor.
     */
    public function annual(Request $request)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $request->validate([
            'year' => ['required', 'integer', 'min:2020', 'max:2030'],
        ]);

        $year = $request->input('year');
        $summary = $this->reportService->getAnnualSummary($year);

        return Inertia::render('Admin/PayrollReports/Annual', [
            'summary' => $summary,
            'year' => $year,
        ]);
    }

    /**
     * Vergi ve SGK özet raporu.
     */
    public function taxSummary(PayrollPeriod $payroll)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $summary = $this->reportService->getTaxSummary($payroll);

        return Inertia::render('Admin/PayrollReports/TaxSummary', [
            'summary' => $summary,
        ]);
    }

    /**
     * Departman bazlı özet rapor.
     */
    public function departmentSummary(PayrollPeriod $payroll)
    {
        $this->authorize('view-any-payroll-report', \App\Models\PayrollPeriod::class);

        $summary = $this->reportService->getDepartmentSummary($payroll);

        return Inertia::render('Admin/PayrollReports/DepartmentSummary', [
            'summary' => $summary,
            'period' => $payroll,
        ]);
    }
}
