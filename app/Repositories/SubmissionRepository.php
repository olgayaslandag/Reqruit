<?php

namespace App\Repositories;

use App\Interfaces\SubmissionInterface;
use App\Models\Submission;
use App\Models\SubmissionDetail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SubmissionRepository extends BaseRepository implements SubmissionInterface
{
    public function __construct(Submission $model)
    {
        $this->model = $model;
    }

    /**
     * Get all submissions with filters.
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Submission::with(['form.department', 'details', 'comments']);

        $this->applyFilters($query, $filters);

        $submissions = $query->orderBy('created_at', 'desc')->get();

        // Transform submissions to add computed attributes
        $submissions->transform(function ($submission) {
            $nameDetail = $submission->details->firstWhere('field_name', 'name');
            $emailDetail = $submission->details->firstWhere('field_name', 'email');

            $submission->applicant_name = $nameDetail?->field_value ?? '-';
            $submission->applicant_email = $emailDetail?->field_value ?? '-';
            $submission->comment_count = $submission->comments->count();
            $submission->avg_rating = $submission->comments->whereNotNull('rating')->avg('rating');

            return $submission;
        });

        return $submissions;
    }

    /**
     * Get paginated submissions with filters.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Submission::with(['form.department', 'details', 'comments']);

        $this->applyFilters($query, $filters);

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform submissions to add computed attributes
        $paginator->getCollection()->transform(function ($submission) {
            $nameDetail = $submission->details->firstWhere('field_name', 'name');
            $emailDetail = $submission->details->firstWhere('field_name', 'email');

            $submission->applicant_name = $nameDetail?->field_value ?? '-';
            $submission->applicant_email = $emailDetail?->field_value ?? '-';
            $submission->comment_count = $submission->comments->count();
            $submission->avg_rating = $submission->comments->whereNotNull('rating')->avg('rating');

            return $submission;
        });

        return $paginator;
    }

    /**
     * Get submission by ID.
     */
    public function getById(int $id): Submission
    {
        return Submission::with(['form.department', 'form.fields', 'comments.user'])->findOrFail($id);
    }

    /**
     * Get submission by reference number.
     */
    public function getByReferenceNo(string $referenceNo): Submission
    {
        return Submission::with(['form.department', 'details'])
            ->where('reference_no', $referenceNo)
            ->firstOrFail();
    }

    /**
     * Create a new submission with details.
     */
    public function create(array $data): Submission
    {
        $data['reference_no'] = $data['reference_no'] ?? 'APP-'.strtoupper(Str::random(8));

        $submission = Submission::create($data);

        if (isset($data['details'])) {
            foreach ($data['details'] as $detail) {
                SubmissionDetail::create([
                    'submission_id' => $submission->id,
                    'field_name' => $detail['field_name'],
                    'field_label' => $detail['field_label'] ?? null,
                    'field_value' => $detail['field_value'],
                ]);
            }
        }

        return $submission->fresh(['form.department', 'details']);
    }

    /**
     * Update submission status.
     */
    public function updateStatus(int $id, string $status): Submission
    {
        $submission = $this->findOrFail($id);
        $submission->update(['status' => $status]);

        return $submission;
    }

    /**
     * Update submission investigation status.
     */
    public function updateInvestigation(int $id, string $investigation): Submission
    {
        $submission = $this->findOrFail($id);
        $submission->update(['investigation' => $investigation]);

        return $submission;
    }

    /**
     * Get submission with details.
     */
    public function getWithDetails(int $id): Submission
    {
        $submission = Submission::with(['form.department', 'form.fields', 'details', 'comments.user'])
            ->findOrFail($id);

        // Add file URLs to details
        $submission->details->transform(function ($detail) {
            $detail->is_file = $detail->isFile();
            $detail->file_url = $detail->file_url;
            $detail->download_url = $detail->download_url;
            $detail->file_extension = $detail->file_extension;
            $detail->file_name = $detail->file_name;

            return $detail;
        });

        return $submission;
    }

    /**
     * Apply filters to query.
     */
    protected function applyFilters(mixed $query, array $filters): void
    {
        if (isset($filters['form_id'])) {
            $query->where('form_id', $filters['form_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['investigation'])) {
            $query->where('investigation', $filters['investigation']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (isset($filters['department_id'])) {
            $query->whereHas('form', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }
    }
}
