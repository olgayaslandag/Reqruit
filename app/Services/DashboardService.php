<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    private const CACHE_TTL = 300; // 5 minutes

    /**
     * Get all dashboard data with caching.
     */
    public function getDashboardData(): array
    {
        return [
            'recruitment' => $this->getRecruitmentStats(),
            'employees' => $this->getEmployeeStats(),
            'attendance' => $this->getAttendanceStats(),
            'leave' => $this->getLeaveStats(),
            'payroll' => $this->getPayrollStats(),
            'weeklySubmissions' => $this->getWeeklySubmissionsByWeeks(),
        ];
    }

    /**
     * Get recruitment statistics with caching.
     */
    public function getRecruitmentStats(): array
    {
        return Cache::remember('dashboard.recruitment', self::CACHE_TTL, function () {
            $total = \DB::table('submissions')->count();

            $grouped = \DB::table('submissions')
                ->select('status', \DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->orderBy('status')
                ->get();

            $counts = $grouped->pluck('count', 'status');

            $stats = ['total' => $total];

            foreach (['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'] as $status) {
                $stats[$status] = (int) ($counts[$status] ?? 0);
            }

            $stats['conversionRate'] = $total > 0 ? round(($stats['hired'] / $total) * 100, 1) : 0.0;

            $stats['statusDistribution'] = $grouped
                ->map(fn ($row) => ['status' => $row->status, 'count' => (int) $row->count])
                ->values()
                ->all();

            return $stats;
        });
    }

    /**
     * Get employee statistics with caching.
     */
    public function getEmployeeStats(): array
    {
        return Cache::remember('dashboard.employees', self::CACHE_TTL, function () {
            $active = \DB::table('employees')->whereNull('termination_date')->count();

            $newHiresThisMonth = \DB::table('employees')
                ->whereBetween('hire_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                ->count();

            $terminationsThisMonth = \DB::table('employees')
                ->whereBetween('termination_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                ->count();

            $byDepartment = \DB::table('employees')
                ->join('departments', 'employees.department_id', '=', 'departments.id')
                ->select('departments.title as department', \DB::raw('COUNT(*) as count'))
                ->whereNull('employees.termination_date')
                ->groupBy('departments.title')
                ->orderBy('departments.title')
                ->get()
                ->map(fn ($row) => ['department' => $row->department, 'count' => (int) $row->count])
                ->values()
                ->all();

            $genderDistribution = \DB::table('employees')
                ->select('gender', \DB::raw('COUNT(*) as count'))
                ->groupBy('gender')
                ->orderBy('gender')
                ->get()
                ->map(fn ($row) => ['gender' => $row->gender, 'count' => (int) $row->count])
                ->values()
                ->all();

            $monthlyHires = [];

            for ($i = 5; $i >= 0; $i--) {
                $month = now()->subMonths($i);

                $monthlyHires[] = [
                    'month' => $month->locale('tr')->isoFormat('MMM Y'),
                    'count' => \DB::table('employees')
                        ->whereYear('hire_date', $month->year)
                        ->whereMonth('hire_date', $month->month)
                        ->count(),
                ];
            }

            return [
                'total' => \DB::table('employees')->count(),
                'active' => $active,
                'newHiresThisMonth' => $newHiresThisMonth,
                'terminationsThisMonth' => $terminationsThisMonth,
                'byDepartment' => $byDepartment,
                'genderDistribution' => $genderDistribution,
                'monthlyHires' => $monthlyHires,
            ];
        });
    }

    /**
     * Get attendance statistics with caching.
     */
    public function getAttendanceStats(): array
    {
        return Cache::remember('dashboard.attendance', self::CACHE_TTL, function () {
            $today = now()->toDateString();

            $todayPresent = \DB::table('attendance_summaries')
                ->where('date', $today)
                ->where('status', 'present')
                ->count();

            $todayAbsent = \DB::table('attendance_summaries')
                ->where('date', $today)
                ->where('status', 'absent')
                ->count();

            $todayLate = \DB::table('attendance_summaries')
                ->where('date', $today)
                ->where('late_duration', '>', 0)
                ->count();

            $monthlyOvertimeHours = (float) \DB::table('attendance_summaries')
                ->whereYear('date', now()->year)
                ->whereMonth('date', now()->month)
                ->sum('overtime_duration');

            $weeklyAttendance = [];

            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->toDateString();

                $weeklyAttendance[] = [
                    'day' => now()->subDays($i)->locale('tr')->isoFormat('dddd'),
                    'date' => $date,
                    'present' => \DB::table('attendance_summaries')->where('date', $date)->where('status', 'present')->count(),
                    'absent' => \DB::table('attendance_summaries')->where('date', $date)->where('status', 'absent')->count(),
                    'late' => \DB::table('attendance_summaries')->where('date', $date)->where('late_duration', '>', 0)->count(),
                ];
            }

            return [
                'todayPresent' => $todayPresent,
                'todayAbsent' => $todayAbsent,
                'todayLate' => $todayLate,
                'monthlyOvertimeHours' => $monthlyOvertimeHours,
                'weeklyAttendance' => $weeklyAttendance,
            ];
        });
    }

    /**
     * Get leave statistics with caching.
     */
    public function getLeaveStats(): array
    {
        return Cache::remember('dashboard.leave', self::CACHE_TTL, function () {
            $today = now()->toDateString();

            $pending = \DB::table('leave_requests')->where('status', 'pending')->count();

            $active = \DB::table('leave_requests')
                ->where('status', 'approved')
                ->where('start_date', '<=', $today)
                ->where('end_date', '>=', $today)
                ->count();

            $approvedThisMonth = \DB::table('leave_requests')
                ->where('status', 'approved')
                ->whereBetween('start_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                ->count();

            $rejected = \DB::table('leave_requests')->where('status', 'rejected')->count();

            $typeDistribution = \DB::table('leave_requests')
                ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
                ->select('leave_types.name as type', \DB::raw('COUNT(*) as count'))
                ->groupBy('leave_types.name')
                ->orderBy('leave_types.name')
                ->get()
                ->map(fn ($row) => ['type' => $row->type, 'count' => (int) $row->count])
                ->values()
                ->all();

            return [
                'pending' => $pending,
                'active' => $active,
                'approvedThisMonth' => $approvedThisMonth,
                'rejected' => $rejected,
                'typeDistribution' => $typeDistribution,
            ];
        });
    }

    /**
     * Get payroll statistics with caching.
     */
    public function getPayrollStats(): array
    {
        return Cache::remember('dashboard.payroll', self::CACHE_TTL, function () {
            $latestPeriod = \DB::table('payroll_periods')->latest('id')->first();

            $latestPeriodTotal = $latestPeriod
                ? (float) \DB::table('payroll_items')->where('payroll_period_id', $latestPeriod->id)->sum('amount')
                : 0.0;

            $pendingApprovals = \DB::table('payroll_periods')
                ->whereIn('status', ['draft', 'manager_approved'])
                ->count();

            $pendingAdvances = \DB::table('advance_requests')->where('status', 'pending')->count();

            $paidAdvancesThisMonth = (float) \DB::table('advance_requests')
                ->where('status', 'paid')
                ->whereBetween('updated_at', [now()->startOfMonth(), now()->endOfMonth()])
                ->sum('amount');

            $monthlyPayrollTrend = [];

            for ($i = 2; $i >= 0; $i--) {
                $month = now()->subMonths($i);

                $periodIds = \DB::table('payroll_periods')
                    ->whereYear('start_date', $month->year)
                    ->whereMonth('start_date', $month->month)
                    ->pluck('id');

                $total = $periodIds->isNotEmpty()
                    ? (float) \DB::table('payroll_items')->whereIn('payroll_period_id', $periodIds)->sum('amount')
                    : 0.0;

                $monthlyPayrollTrend[] = [
                    'month' => $month->locale('tr')->isoFormat('MMM Y'),
                    'total' => $total,
                ];
            }

            return [
                'latestPeriodTotal' => $latestPeriodTotal,
                'pendingApprovals' => $pendingApprovals,
                'pendingAdvances' => $pendingAdvances,
                'paidAdvancesThisMonth' => $paidAdvancesThisMonth,
                'monthlyPayrollTrend' => $monthlyPayrollTrend,
            ];
        });
    }

    /**
     * Get weekly submissions data for last 7 weeks.
     */
    public function getWeeklySubmissionsByWeeks(): array
    {
        $weeklySubmissions = Cache::remember('dashboard.weekly_submissions_by_weeks', self::CACHE_TTL, function () {
            $connection = \DB::connection()->getDriverName();

            if ($connection === 'sqlite') {
                // SQLite için strftime kullan
                return \DB::table('submissions')
                    ->select(
                        \DB::raw('strftime("%Y", created_at) as year'),
                        \DB::raw('strftime("%W", created_at) as week'), // Week number (Monday first)
                        \DB::raw('COUNT(*) as count')
                    )
                    ->where('created_at', '>=', now()->subWeeks(7))
                    ->groupBy('year', 'week')
                    ->orderBy('year')
                    ->orderBy('week')
                    ->get();
            } else {
                // MySQL/PostgreSQL için standart fonksiyonlar
                return \DB::table('submissions')
                    ->select(
                        \DB::raw('YEAR(created_at) as year'),
                        \DB::raw('WEEK(created_at, 1) as week'),
                        \DB::raw('COUNT(*) as count')
                    )
                    ->where('created_at', '>=', now()->subWeeks(7))
                    ->groupBy('year', 'week')
                    ->orderBy('year')
                    ->orderBy('week')
                    ->get();
            }
        });

        return $this->formatWeeklyDataByWeeks($weeklySubmissions);
    }

    /**
     * Format weekly data for the last 7 weeks.
     */
    private function formatWeeklyDataByWeeks(Collection $weeklySubmissions): array
    {
        $weeks = [];
        $now = now();

        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subWeeks($i);
            $year = $date->year;
            $week = $date->week; // ISO-8601 week number

            $count = $weeklySubmissions->firstWhere('year', $year)
                ? $weeklySubmissions->firstWhere('week', $week)?->count ?? 0
                : 0;

            // Get Monday date of the week for label (Turkish locale)
            $monday = $date->copy()->startOfWeek()->locale('tr')->isoFormat('d MMM');
            $sunday = $date->copy()->endOfWeek()->locale('tr')->isoFormat('d MMM');
            $label = "$monday - $sunday";

            $weeks[] = [
                'label' => $label,
                'count' => $count,
                'year' => $year,
                'week' => $week,
            ];
        }

        return $weeks;
    }

    /**
     * Clear dashboard cache (useful after data changes).
     */
    public function clearCache(): void
    {
        Cache::forget('dashboard.recruitment');
        Cache::forget('dashboard.employees');
        Cache::forget('dashboard.attendance');
        Cache::forget('dashboard.leave');
        Cache::forget('dashboard.payroll');
        Cache::forget('dashboard.weekly_submissions_by_weeks');
    }
}
