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
        $stats = $this->getStats();
        $weeklySubmissions = $this->getWeeklySubmissionsByWeeks();

        return [
            'stats' => $stats,
            'weeklySubmissions' => $weeklySubmissions,
        ];
    }

    /**
     * Get dashboard statistics with caching.
     */
    public function getStats(): array
    {
        return Cache::remember('dashboard.stats', self::CACHE_TTL, function () {
            return [
                'totalSubmissions' => \DB::table('submissions')->count(),
                'pendingSubmissions' => \DB::table('submissions')->where('status', 'new')->count(),
                'activeForms' => \DB::table('forms')->count(),
                'departments' => \DB::table('departments')->count(),
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
            $monday = $date->copy()->startOfWeek()->locale('tr')->format('d M');
            $sunday = $date->copy()->endOfWeek()->locale('tr')->format('d M');
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
     * Get weekly submissions data.
     *
     * @deprecated Use getWeeklySubmissionsByWeeks() for weekly data
     */
    public function getWeeklySubmissions(): array
    {
        $weeklySubmissions = Cache::remember('dashboard.weekly_submissions', self::CACHE_TTL, function () {
            return \DB::table('submissions')
                ->select(\DB::raw('DATE(created_at) as date'), \DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        });

        return $this->formatWeeklyData($weeklySubmissions);
    }

    /**
     * Format weekly data for the last 7 days.
     *
     * @deprecated Use formatWeeklyDataByWeeks()
     */
    private function formatWeeklyData(Collection $weeklySubmissions): array
    {
        $days = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->locale('tr')->dayName;
            $count = $weeklySubmissions->firstWhere('date', $date)?->count ?? 0;

            $days[] = [
                'date' => $date,
                'day' => $dayName,
                'count' => $count,
            ];
        }

        return $days;
    }

    /**
     * Clear dashboard cache (useful after data changes).
     */
    public function clearCache(): void
    {
        Cache::forget('dashboard.stats');
        Cache::forget('dashboard.weekly_submissions');
    }
}
