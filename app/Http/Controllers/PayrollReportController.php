<?php

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
     * Bordro raporları ana sayfası.
     */
    public function index()
    {
        $periods = PayrollPeriod::orderBy('start_date', 'desc')
            ->where('status', 'published')
            ->limit(12)
            ->get(['id', 'name', 'start_date', 'end_date', 'status']);

        return Inertia::render('Admin/PayrollReports/Index', [
            'periods' => $periods,
        ]);
    }

    /**
     * Bordro özet raporu.
     */
    public function summary(PayrollPeriod $payroll)
    {
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
        $summary = $this->reportService->getDepartmentSummary($payroll);

        return Inertia::render('Admin/PayrollReports/DepartmentSummary', [
            'summary' => $summary,
            'period' => $payroll,
        ]);
    }
}
