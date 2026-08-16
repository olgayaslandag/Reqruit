<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSummary;
use App\Models\Department;
use App\Models\Employee;
use App\Services\AttendanceCalculationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceReportController extends Controller
{
    protected AttendanceCalculationService $calculationService;

    public function __construct(AttendanceCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    private function checkAdminAccess(): void
    {
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }
    }

    public function index(Request $request)
    {
        $this->checkAdminAccess();

        $startOfDay = today()->startOfDay();
        $endOfDay = today()->copy()->endOfDay();

        $todaySummaries = AttendanceSummary::where('date', '>=', $startOfDay->toDateString())
            ->where('date', '<=', $endOfDay->toDateString());

        $statistics = [
            'present_count' => (clone $todaySummaries)->where('status', 'present')->count(),
            'absent_count' => (clone $todaySummaries)->where(function ($q) {
                $q->where('status', 'absent')->orWhere('was_absent', true);
            })->count(),
            'late_count' => (clone $todaySummaries)->where('status', 'late')->count(),
            'overtime_duration' => round((float) (clone $todaySummaries)->sum('overtime_duration'), 2),
        ];

        $recentRecords = AttendanceRecord::with(['employee.department'])
            ->latest()
            ->take(20)
            ->get();

        $employees = Employee::whereNull('termination_date')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return inertia('Admin/AttendanceReports/Index', [
            'statistics' => $statistics,
            'reportsSummary' => [
                'total_records' => AttendanceSummary::count(),
                'period' => 'current_month',
            ],
            'filters' => [
                'period' => 'current_month',
                'date_range' => [],
                'employee_id' => '',
            ],
            'recentRecords' => $recentRecords,
            'employees' => $employees,
        ]);
    }

    public function dashboard(Request $request)
    {
        return $this->index($request);
    }

    public function daily(Request $request)
    {
        $this->checkAdminAccess();

        $date = $request->get('date', today()->toDateString());
        $employeeId = $request->get('employee_id');

        $employeesQuery = Employee::with(['department'])
            ->whereNull('termination_date');

        if ($employeeId) {
            $employeesQuery->where('id', $employeeId);
        }

        $employees = $employeesQuery->get();

        $summaries = AttendanceSummary::where('date', '>=', $date)
            ->where('date', '<=', $date);

        if ($employeeId) {
            $summaries->where('employee_id', $employeeId);
        }

        $summariesByEmployee = $summaries->get()->keyBy('employee_id');

        $dailyData = [];
        $presentCount = 0;
        $lateCount = 0;
        $totalWorkingHours = 0;

        foreach ($employees as $employee) {
            $summary = $summariesByEmployee->get($employee->id);

            $status = $summary?->status ?? 'absent';
            if ($summary && $summary->was_absent && $status === 'present') {
                $status = 'absent';
            }

            if ($status === 'present') {
                $presentCount++;
            }
            if ($status === 'late') {
                $lateCount++;
            }

            $workingHours = $summary?->actual_working_duration ?? 0;
            $totalWorkingHours += (float) $workingHours;

            $dailyData[] = [
                'employee' => [
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'position_title' => $employee->position_title,
                    'department_title' => $employee->department?->title,
                ],
                'status' => $status,
                'clock_in' => $summary?->actual_check_in,
                'clock_out' => $summary?->actual_check_out,
                'working_hours' => $this->formatHours($summary?->actual_working_duration ?? 0),
                'overtime' => round((float) ($summary?->overtime_duration ?? 0), 2),
            ];
        }

        $totalEmployees = $employees->count();

        return inertia('Admin/AttendanceReports/Daily', [
            'dailyReport' => [
                'total_employees' => $totalEmployees,
                'present_count' => $presentCount,
                'absent_count' => max(0, $totalEmployees - $presentCount),
                'late_count' => $lateCount,
                'average_attendance_rate' => $totalEmployees > 0
                    ? round(($presentCount / $totalEmployees) * 100, 2)
                    : 0,
                'avg_working_hours' => $totalEmployees > 0
                    ? round($totalWorkingHours / $totalEmployees, 2)
                    : 0,
                'daily_data' => $dailyData,
            ],
            'filters' => [
                'date' => $date,
                'employee_id' => $employeeId ?? '',
            ],
            'employees' => Employee::whereNull('termination_date')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function monthly(Request $request)
    {
        $this->checkAdminAccess();

        $year = (int) $request->get('year', now()->year);
        $month = (int) $request->get('month', now()->month);
        $employeeId = $request->get('employee_id');

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Günlük agregasyonu DB seviyesinde yap (10K+ satırı PHP belleğine çekme)
        $dailyAggregates = AttendanceSummary::query()
            ->select(
                'date',
                DB::raw('SUM(actual_working_duration) as worked_hours'),
                DB::raw('SUM(overtime_duration) as overtime'),
                DB::raw('MIN(actual_check_in) as clock_in'),
                DB::raw('MAX(actual_check_out) as clock_out'),
                DB::raw('SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_count'),
                DB::raw('SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_count'),
                DB::raw('SUM(CASE WHEN status = "absent" OR was_absent = 1 THEN 1 ELSE 0 END) as absent_count')
            )
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $chartData = [];
        $dailyDetails = [];
        $totalWorkdays = $dailyAggregates->count();
        $attendanceDays = 0;
        $lateArrivals = 0;
        $absences = 0;
        $totalOvertime = 0;
        $totalWorkingHours = 0;

        foreach ($dailyAggregates as $row) {
            $workedHours = round((float) $row->worked_hours, 2);
            $overtime = round((float) $row->overtime, 2);
            $totalWorkingHours += $workedHours;
            $totalOvertime += $overtime;

            $presentOnDay = (int) $row->present_count > 0;
            $lateOnDay = (int) $row->late_count > 0;
            $absentOnDay = (int) $row->absent_count > 0;

            if ($presentOnDay) {
                $attendanceDays++;
            }
            if ($lateOnDay) {
                $lateArrivals++;
            }
            if ($absentOnDay) {
                $absences++;
            }

            $dayOfMonth = Carbon::parse($row->date)->day;

            $chartData[] = [
                'day' => $dayOfMonth,
                'worked_hours' => $workedHours,
                'overtime' => $overtime,
            ];

            $dailyDetails[] = [
                'date' => $row->date->toDateString(),
                'clock_in' => $row->clock_in ? Carbon::parse($row->clock_in) : null,
                'clock_out' => $row->clock_out ? Carbon::parse($row->clock_out) : null,
                'working_hours' => $this->formatHours($workedHours),
                'overtime' => round($overtime, 2),
                'status' => $presentOnDay ? 'present' : ($absentOnDay ? 'absent' : 'late'),
            ];
        }

        return inertia('Admin/AttendanceReports/Monthly', [
            'monthlyReport' => [
                'chart_data' => $chartData,
                'total_workdays' => $totalWorkdays,
                'attendance_rate' => $totalWorkdays > 0
                    ? round(($attendanceDays / $totalWorkdays) * 100, 2)
                    : 0,
                'avg_overtime' => $totalWorkdays > 0
                    ? round($totalOvertime / $totalWorkdays, 2)
                    : 0,
                'total_overtime' => round($totalOvertime, 2),
                'total_working_hours' => round($totalWorkingHours, 2),
                'attendance_days' => $attendanceDays,
                'late_arrivals' => $lateArrivals,
                'absences' => $absences,
                'daily_details' => $dailyDetails,
            ],
            'filters' => [
                'year' => (string) $year,
                'month' => str_pad((string) $month, 2, '0', STR_PAD_LEFT),
                'employee_id' => $employeeId ?? '',
            ],
            'employees' => Employee::whereNull('termination_date')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function overtime(Request $request)
    {
        $this->checkAdminAccess();

        $year = (int) $request->get('year', now()->year);
        $month = $request->get('month') ? (int) $request->get('month') : null;
        $employeeId = $request->get('employee_id');
        $departmentId = $request->get('department_id');

        $startDate = Carbon::createFromDate($year, $month ?? 1, 1)->startOfMonth();
        if ($month) {
            $endDate = $startDate->copy()->endOfMonth();
        } else {
            $startDate = Carbon::createFromDate($year, 1, 1)->startOfYear();
            $endDate = Carbon::createFromDate($year, 12, 31)->endOfYear();
        }

        // Çalışan bazlı mesai toplamlarını DB seviyesinde agrege et (10K+ satırı PHP belleğine çekme)
        $overtimeRows = AttendanceSummary::query()
            ->select(
                'employee_id',
                DB::raw('SUM(overtime_duration) as total_overtime'),
                DB::raw('SUM(CASE WHEN overtime_duration > 0 THEN 1 ELSE 0 END) as overtime_days')
            )
            ->with(['employee:id,first_name,last_name,position_title,department_id', 'employee.department:id,title'])
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->when($departmentId, fn ($q) => $q->whereHas('employee', fn ($q) => $q->where('department_id', $departmentId)))
            ->groupBy('employee_id')
            ->having(DB::raw('SUM(overtime_duration)'), '>', 0)
            ->get();

        $overtimeDetails = [];
        $totalOvertime = 0;
        $overtimeEmployees = 0;

        foreach ($overtimeRows as $row) {
            $employee = $row->employee;
            if (! $employee) {
                continue;
            }

            $employeeTotal = round((float) $row->total_overtime, 2);
            $days = (int) $row->overtime_days;
            $totalOvertime += $employeeTotal;
            $overtimeEmployees++;

            $overtimeDetails[] = [
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'position_title' => $employee->position_title,
                'department_title' => $employee->department?->title,
                'employment_status' => 'full_time',
                'total_overtime' => $employeeTotal,
                'overtime_days' => $days,
                'avg_daily_overtime' => $days > 0 ? round($employeeTotal / $days, 2) : 0,
                'overtime_eligible' => true,
            ];
        }

        usort($overtimeDetails, function ($a, $b) {
            return $b['total_overtime'] <=> $a['total_overtime'];
        });

        // Aylık grafik verisi için ayrı DB agregasyonu
        $chartRows = AttendanceSummary::query()
            ->select(
                DB::raw("DATE_FORMAT(date, '%Y-%m') as month"),
                DB::raw('SUM(overtime_duration) as total_overtime'),
                DB::raw('COUNT(*) as day_count')
            )
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->where('overtime_duration', '>', 0)
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->when($departmentId, fn ($q) => $q->whereHas('employee', fn ($q) => $q->where('department_id', $departmentId)))
            ->groupBy(DB::raw("DATE_FORMAT(date, '%Y-%m')"))
            ->get();

        $chartData = [];
        foreach ($chartRows as $row) {
            $chartData[] = [
                'period' => Carbon::parse($row->month)->format('F'),
                'total_overtime' => round((float) $row->total_overtime, 2),
                'avg_overtime' => $row->day_count > 0
                    ? round((float) $row->total_overtime / $row->day_count, 2)
                    : 0,
            ];
        }

        return inertia('Admin/AttendanceReports/Overtime', [
            'overtimeReport' => [
                'chart_data' => $chartData,
                'total_overtime' => round($totalOvertime, 2),
                'avg_overtime' => $overtimeEmployees > 0
                    ? round($totalOvertime / $overtimeEmployees, 2)
                    : 0,
                'total_employees' => Employee::whereNull('termination_date')->count(),
                'overtime_employees' => $overtimeEmployees,
                'overtime_details' => $overtimeDetails,
                'exceed_employee_count' => 0,
            ],
            'filters' => [
                'year' => (string) $year,
                'month' => $month ? str_pad((string) $month, 2, '0', STR_PAD_LEFT) : '',
                'employee_id' => $employeeId ?? '',
                'department_id' => $departmentId ?? '',
            ],
            'employees' => Employee::whereNull('termination_date')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
            'departments' => Department::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function export(Request $request)
    {
        $this->checkAdminAccess();

        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $summaries = AttendanceSummary::with(['employee.department'])
            ->where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->orderBy('date')
            ->get();

        $filename = 'attendance_report_'.$startDate.'_'.$endDate.'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($summaries) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tarih', 'Çalışan', 'Departman', 'Durum', 'Çalışma Saati', 'Fazla Mesai', 'Gecikme']);

            foreach ($summaries as $summary) {
                fputcsv($handle, [
                    $summary->date,
                    $summary->employee?->first_name.' '.$summary->employee?->last_name,
                    $summary->employee?->department?->title,
                    $summary->status,
                    $summary->actual_working_duration,
                    $summary->overtime_duration,
                    $summary->late_duration,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function formatHours($hours): string
    {
        $hours = (float) $hours;
        $h = floor($hours);
        $m = round(($hours - $h) * 60);

        return sprintf('%02d:%02d', $h, $m);
    }
}
