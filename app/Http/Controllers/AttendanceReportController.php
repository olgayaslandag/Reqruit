<?php

declare(strict_types=1);
namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSummary;
use App\Models\Employee;
use App\Services\AttendanceCalculationService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceReportController extends Controller
{
    protected AttendanceCalculationService $calculationService;

    public function __construct(AttendanceCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    public function index(Request $request)
    {
        $this->authorize('view-reports', \App\Models\AttendanceRecord::class);

        $summary = [
            'total_employees' => Employee::whereNull('termination_date')->count(),
            'today_present' => AttendanceRecord::whereDate('created_at', today())
                ->where('type', 'check_in')
                ->distinct('employee_id')
                ->count('employee_id'),
            'today_absent' => 0,
            'total_overtime_hours' => AttendanceSummary::sum('overtime_hours') ?? 0,
            'total_late_minutes' => AttendanceSummary::sum('late_minutes') ?? 0,
        ];

        $recentRecords = AttendanceRecord::with(['employee.department'])
            ->latest()
            ->take(20)
            ->get();

        return inertia('Admin/AttendanceReports/Index', [
            'summary' => $summary,
            'recentRecords' => $recentRecords,
        ]);
    }

    public function daily(Request $request)
    {
        $this->authorize('view-reports', \App\Models\AttendanceRecord::class);

        $date = $request->get('date', today()->toDateString());

        $recordsData = AttendanceRecord::select(['employee_id', 'time', 'type', 'late_minutes'])
            ->whereDate('date', $date)
            ->orderBy('time')
            ->get();

        $employeeRecords = $recordsData->groupBy('employee_id');

        $employees = Employee::with(['department', 'shiftSchedules' => function ($query) use ($date) {
            $query->where('date', $date);
        }])
            ->whereNull('termination_date')
            ->get();

        $summary = [];
        foreach ($employees as $employee) {
            $employeeRecordCollection = $employeeRecords->get($employee->id, collect());
            $checkIn = $employeeRecordCollection->where('type', 'check_in')->first();
            $checkOut = $employeeRecordCollection->where('type', 'check_out')->last();

            $summary[] = [
                'employee' => $employee,
                'check_in' => $checkIn ? $checkIn['time'] : null,
                'check_out' => $checkOut ? $checkOut['time'] : null,
                'status' => $checkIn ? 'present' : 'absent',
                'late_minutes' => $checkIn ? ($checkIn['late_minutes'] ?? 0) : 0,
            ];
        }

        return inertia('Admin/AttendanceReports/Daily', [
            'date' => $date,
            'summary' => $summary,
        ]);
    }

    public function monthly(Request $request)
    {
        $this->authorize('view-reports', \App\Models\AttendanceRecord::class);

        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Eager load employees with department
        $employees = Employee::with(['department'])
            ->whereNull('termination_date')
            ->get();

        // Get all attendance summaries with minimal fields for calculations
        $summaries = AttendanceSummary::select([
            'employee_id',
            'worked_hours',
            'overtime_hours',
            'late_minutes',
            'early_leave_minutes',
            'status',
        ])
            ->whereBetween('date', [$startDate, $endDate])
            ->get()
            ->groupBy('employee_id');

        $monthlyData = [];
        foreach ($employees as $employee) {
            $employeeSummaries = $summaries->get($employee->id, collect());

            $monthlyData[] = [
                'employee' => $employee,
                'total_worked_hours' => $employeeSummaries->sum('worked_hours'),
                'total_overtime_hours' => $employeeSummaries->sum('overtime_hours'),
                'total_late_minutes' => $employeeSummaries->sum('late_minutes'),
                'total_early_leave_minutes' => $employeeSummaries->sum('early_leave_minutes'),
                'present_days' => $employeeSummaries->where('status', 'present')->count(),
                'absent_days' => $employeeSummaries->where('status', 'absent')->count(),
                'late_days' => $employeeSummaries->where('status', 'late')->count(),
            ];
        }

        return inertia('Admin/AttendanceReports/Monthly', [
            'month' => $month,
            'year' => $year,
            'monthlyData' => $monthlyData,
        ]);
    }

    public function overtime(Request $request)
    {
        $this->authorize('view-reports', \App\Models\AttendanceRecord::class);

        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $summaries = AttendanceSummary::with(['employee.department'])
            ->whereBetween('date', [$startDate, $endDate])
            ->where('overtime_hours', '>', 0)
            ->get()
            ->groupBy('employee_id');

        $overtimeData = [];
        foreach ($summaries as $employeeId => $employeeSummaries) {
            $employee = $employeeSummaries->first()->employee;
            $totalOvertime = $employeeSummaries->sum('overtime_hours');

            $overtimeData[] = [
                'employee' => $employee,
                'total_overtime_hours' => $totalOvertime,
                'overtime_days' => $employeeSummaries->count(),
            ];
        }

        usort($overtimeData, function ($a, $b) {
            return $b['total_overtime_hours'] <=> $a['total_overtime_hours'];
        });

        return inertia('Admin/AttendanceReports/Overtime', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'overtimeData' => $overtimeData,
        ]);
    }

    public function export(Request $request)
    {
        $this->authorize('view-reports', \App\Models\AttendanceRecord::class);

        $type = $request->get('type', 'daily');
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $summaries = AttendanceSummary::with(['employee.department'])
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $filename = 'attendance_report_'.$type.'_'.$startDate.'_'.$endDate.'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($summaries) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tarih', 'Çalışan', 'Departman', 'Durum', 'Çalışma Saati', 'Fazla Mesai', 'Gecikme (dk)']);

            foreach ($summaries as $summary) {
                fputcsv($handle, [
                    $summary->date,
                    $summary->employee?->first_name.' '.$summary->employee?->last_name,
                    $summary->employee?->department?->title,
                    $summary->status,
                    $summary->worked_hours,
                    $summary->overtime_hours,
                    $summary->late_minutes,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AttendanceRecord::class);

        $summary = [
            'total_employees' => Employee::whereNull('termination_date')->count(),
            'today_present' => AttendanceRecord::whereDate('created_at', today())
                ->where('type', 'check_in')
                ->distinct('employee_id')
                ->count('employee_id'),
            'today_absent' => 0,
            'total_overtime_hours' => AttendanceSummary::sum('overtime_hours') ?? 0,
            'total_late_minutes' => AttendanceSummary::sum('late_minutes') ?? 0,
        ];

        $recentRecords = AttendanceRecord::with(['employee.department'])
            ->latest()
            ->take(20)
            ->get();

        return inertia('Admin/AttendanceReports/Index', [
            'summary' => $summary,
            'recentRecords' => $recentRecords,
        ]);
    }

    public function daily(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AttendanceRecord::class);

        $date = $request->get('date', today()->toDateString());

        $recordsData = AttendanceRecord::select(['employee_id', 'time', 'type', 'late_minutes'])
            ->whereDate('date', $date)
            ->orderBy('time')
            ->get();

        $employeeRecords = $recordsData->groupBy('employee_id');

        $employees = Employee::with(['department', 'shiftSchedules' => function ($query) use ($date) {
            $query->where('date', $date);
        }])
            ->whereNull('termination_date')
            ->get();

        $summary = [];
        foreach ($employees as $employee) {
            $employeeRecordCollection = $employeeRecords->get($employee->id, collect());
            $checkIn = $employeeRecordCollection->where('type', 'check_in')->first();
            $checkOut = $employeeRecordCollection->where('type', 'check_out')->last();

            $summary[] = [
                'employee' => $employee,
                'check_in' => $checkIn ? $checkIn['time'] : null,
                'check_out' => $checkOut ? $checkOut['time'] : null,
                'status' => $checkIn ? 'present' : 'absent',
                'late_minutes' => $checkIn ? ($checkIn['late_minutes'] ?? 0) : 0,
            ];
        }

        return inertia('Admin/AttendanceReports/Daily', [
            'date' => $date,
            'summary' => $summary,
        ]);
    }

    public function monthly(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AttendanceRecord::class);

        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Eager load employees with department
        $employees = Employee::with(['department'])
            ->whereNull('termination_date')
            ->get();

        // Get all attendance summaries with minimal fields for calculations
        $summaries = AttendanceSummary::select([
            'employee_id',
            'worked_hours',
            'overtime_hours',
            'late_minutes',
            'early_leave_minutes',
            'status',
        ])
            ->whereBetween('date', [$startDate, $endDate])
            ->get()
            ->groupBy('employee_id');

        $monthlyData = [];
        foreach ($employees as $employee) {
            $employeeSummaries = $summaries->get($employee->id, collect());

            $monthlyData[] = [
                'employee' => $employee,
                'total_worked_hours' => $employeeSummaries->sum('worked_hours'),
                'total_overtime_hours' => $employeeSummaries->sum('overtime_hours'),
                'total_late_minutes' => $employeeSummaries->sum('late_minutes'),
                'total_early_leave_minutes' => $employeeSummaries->sum('early_leave_minutes'),
                'present_days' => $employeeSummaries->where('status', 'present')->count(),
                'absent_days' => $employeeSummaries->where('status', 'absent')->count(),
                'late_days' => $employeeSummaries->where('status', 'late')->count(),
            ];
        }

        return inertia('Admin/AttendanceReports/Monthly', [
            'month' => $month,
            'year' => $year,
            'monthlyData' => $monthlyData,
        ]);
    }

    public function overtime(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AttendanceRecord::class);

        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $summaries = AttendanceSummary::with(['employee.department'])
            ->whereBetween('date', [$startDate, $endDate])
            ->where('overtime_hours', '>', 0)
            ->get()
            ->groupBy('employee_id');

        $overtimeData = [];
        foreach ($summaries as $employeeId => $employeeSummaries) {
            $employee = $employeeSummaries->first()->employee;
            $totalOvertime = $employeeSummaries->sum('overtime_hours');

            $overtimeData[] = [
                'employee' => $employee,
                'total_overtime_hours' => $totalOvertime,
                'overtime_days' => $employeeSummaries->count(),
            ];
        }

        usort($overtimeData, function ($a, $b) {
            return $b['total_overtime_hours'] <=> $a['total_overtime_hours'];
        });

        return inertia('Admin/AttendanceReports/Overtime', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'overtimeData' => $overtimeData,
        ]);
    }

    public function export(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AttendanceRecord::class);

        $type = $request->get('type', 'daily');
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $summaries = AttendanceSummary::with(['employee.department'])
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $filename = 'attendance_report_'.$type.'_'.$startDate.'_'.$endDate.'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($summaries) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tarih', 'Çalışan', 'Departman', 'Durum', 'Çalışma Saati', 'Fazla Mesai', 'Gecikme (dk)']);

            foreach ($summaries as $summary) {
                fputcsv($handle, [
                    $summary->date,
                    $summary->employee?->first_name.' '.$summary->employee?->last_name,
                    $summary->employee?->department?->title,
                    $summary->status,
                    $summary->worked_hours,
                    $summary->overtime_hours,
                    $summary->late_minutes,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
