<?php

declare(strict_types=1);


namespace Database\Seeders;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveRequestsSeeder extends Seeder
{
    public function run(): void
    {
        // Make sure employees and leave types exist
        $employees = Employee::all();
        $leaveTypes = LeaveType::all();

        if ($employees->isEmpty() || $leaveTypes->isEmpty()) {
            $this->command->warn('Skipping leave requests seeding - Employees or leave types not found');

            return;
        }

        // Create leave requests with different statuses
        $requests = [];
        $now = now();

        foreach ($employees as $employee) {
            // Each employee gets 0-3 leave requests
            $requestCount = rand(0, 3);

            for ($i = 0; $i < $requestCount; $i++) {
                // Select a random leave type
                $leaveType = $leaveTypes->random();

                // Create dates for the request
                $requestDateOffset = rand(-30, 60); // Request date from last month to 2 months ahead
                $requestDate = now()->addDays($requestDateOffset);

                // For approved/pending requests: start from tomorrow or next week
                $startDateOffset = max(rand(1, 21), $requestDateOffset + 1); // Start after request date
                $startDate = $now->copy()->addDays($startDateOffset);

                // Duration varies by leave type
                $maxDuration = $leaveType->max_duration_days ?? 30;
                $durationDays = min(rand(1, 14), $maxDuration);
                $endDate = $startDate->copy()->addDays($durationDays);

                // Status based on timing and probability
                $possibleStatuses = ['approved', 'pending', 'rejected', 'cancelled'];

                // Probability distribution:
                // Past requests are usually approved or rejected
                // Future requests could be pending, approved, or cancelled
                $status = 'pending';
                if ($endDate->isPast()) {
                    $status = rand(1, 10) <= 8 ? 'approved' : 'rejected'; // 80% approved, 20% rejected for past requests
                } else {
                    $pick = rand(1, 10);
                    if ($pick <= 6) {
                        $status = 'pending';      // 60%
                    } elseif ($pick <= 9) {
                        $status = 'approved';     // 30%
                    } else {
                        $status = 'cancelled';    // 10%
                    }
                }

                // Determine if it's half day
                $isHalfDay = rand(1, 10) <= 2; // 20% chance of half day

                // Add some probability that the end result is different based on type
                if ($leaveType->requires_document && $status === 'pending') {
                    // Leave requests requiring documents have higher chance of rejection if documents not provided
                    if (rand(1, 10) <= 1) { // 10% chance of rejection for document-requiring requests
                        $status = 'rejected';
                    }
                }

                // Approver selection - might be null if pending/rejected
                $approverId = null;
                if (in_array($status, ['approved', 'rejected', 'cancelled'])) {
                    // Find potential approvers (could be managers or HR)
                    $potentialApprovers = $employees->filter(function ($emp) use ($employee) {
                        // Exclude self, consider managers or random employees as approvers
                        return $emp->id !== $employee->id && rand(1, 10) <= 3; // 30% chance to be eligible as approver
                    });

                    if ($potentialApprovers->count() > 0) {
                        $approver = $potentialApprovers->random();
                        $approverId = $approver->id;
                    } else {
                        $approverId = $employees->except([$employee->id])->random()?->id;
                    }
                }

                $approvedAt = null;
                if (in_array($status, ['approved', 'rejected']) && $approverId) {
                    $hoursOffset = rand(1, 72); // Approve/reject within 3 days (up to 72 hours) after request
                    $approvedAt = $requestDate->copy()->addHours($hoursOffset);
                }

                $requests[] = [
                    'employee_id' => $employee->id,
                    'leave_type_id' => $leaveType->id,
                    'approver_id' => $approverId,
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                    'is_half_day' => $isHalfDay,
                    'status' => $status,
                    'reason' => $this->generateReason($leaveType, $status),
                    'rejection_reason' => in_array($status, ['rejected']) ? $this->generateRejectionReason() : null,
                    'approved_at' => $approvedAt?->toISOString(),
                    'requires_hr_approval' => in_array($leaveType->code, ['UCRETSIZ']), // Free leave may need extra approval
                    'created_at' => $requestDate->toISOString(),
                    'updated_at' => $now->toISOString(),
                ];
            }
        }

        // Insert in chunks to avoid memory limit
        $chunks = array_chunk($requests, 50);

        foreach ($chunks as $chunk) {
            DB::table('leave_requests')->insert($chunk);
        }

        $this->command->info(count($requests).' leave requests created.');
    }

    private function generateReason($leaveType, $status): string
    {
        $commonReasons = [
            'Personal matters',
            'Health reasons',
            'Family visit',
            'Medical appointment',
            'Vacation planning',
            'Emergency situation',
            'Wedding anniversary',
            'Religious holiday',
            'Moving house',
            'Car maintenance',
        ];

        $reasonsByType = [
            'YILLIK' => array_merge($commonReasons, [
                'Annual vacation',
                'Rest and relaxation',
                'Family vacation trip',
                'Personal development',
            ]),
            'MAZERET' => [
                'Family emergency',
                'Wedding ceremony',
                'Death in family',
                'Birth of child',
                'Medical procedures',
                'Court appearance',
            ],
            'HASTALIK' => [
                'Doctor appointment',
                'Sick recovery',
                'Medical examination',
                'Rehabilitation process',
                'Treatment requirement',
            ],
            'ANALIK' => [
                'Post-natal recovery',
                'Childcare',
                'Baby care needs',
                'Postpartum rest',
                'Infant medical appointments',
            ],
            'BABALIK' => [
                'Newborn care support',
                'Partner assistance',
                'Family bonding',
                'Parental responsibilities',
            ],
            'UCRETSIZ' => [
                'Personal circumstances',
                'Extended personal time',
                'Family responsibilities',
                'Health considerations',
                'Personal obligations',
            ],
        ];

        return collect($reasonsByType[$leaveType->code] ?? $commonReasons)->random();
    }

    private function generateRejectionReason(): string
    {
        $rejectionReasons = [
            'Insufficient documentation provided',
            'Conflict with company events',
            'Peak workload period',
            'Unresolved conflicts with others',
            'Requested dates overlap with critical project deadlines',
            'Not enough notice period',
            'Inadequate coverage during absence',
            'Duplicate leave request submitted',
            'Management approval needed',
            'Policy violations identified',
        ];

        return collect($rejectionReasons)->random();
    }
}
