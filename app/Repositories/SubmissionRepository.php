<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\ISubmissionRepository;
use App\Models\Submission;
use App\Models\SubmissionDetail;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SubmissionRepository extends BaseRepository implements ISubmissionRepository
{
    /**
     * Cursor key for pagination.
     */
    private const CURSOR_KEY = 'cursor';

    public function __construct(Submission $model)
    {
        $this->model = $model;
    }

    /**
     * Get submissions with optional limit/offset for memory-safe queries.
     *
     * WARNING: Calling without limit will load all records into memory.
     * Use getCursorPaginated() or getPaginated() for large datasets.
     *
     * @param  array  $filters  Filter options
     * @param  int|null  $limit  Maximum records to return (null = no limit, dangerous for 200K+ records)
     * @param  int  $offset  Number of records to skip
     */
    public function getAll(array $filters = [], ?int $limit = null, int $offset = 0): Collection
    {
        $query = Submission::with(['form.department', 'details', 'comments']);

        $this->applyFilters($query, $filters);

        $query->orderBy('created_at', 'desc');

        // Apply limit/offset for memory-safe queries
        if ($limit !== null) {
            $query->limit($limit)->offset($offset);
        }

        $submissions = $query->get();

        // Transform submissions to add computed attributes
        $submissions->transform(function ($submission) {
            return $this->transformSubmission($submission);
        });

        return $submissions;
    }

    /**
     * Get paginated submissions using offset-based pagination.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Submission::with(['form:id,name,department_id', 'form.department:id,title'])
            ->select('id', 'form_id', 'status', 'investigation', 'created_at');

        $this->applyFilters($query, $filters);

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        if ($paginator->isEmpty()) {
            return $paginator;
        }

        return $this->enrichPaginatedSubmissions($paginator);
    }

    /**
     * Get paginated submissions using cursor-based pagination (efficient for large datasets).
     *
     * Cursor-based pagination uses WHERE id < last_id instead of OFFSET,
     * which provides consistent performance even with millions of records.
     *
     * @param  array  $filters  Filter options
     * @param  int  $perPage  Items per page
     * @param  string|null  $cursor  Encoded cursor for next page (base64 encoded 'id,timestamp')
     * @return array Contains 'items' (Collection), 'next_cursor' (string|null), 'has_more' (bool)
     */
    public function getCursorPaginated(array $filters = [], int $perPage = 15, ?string $cursor = null): array
    {
        $query = Submission::with(['form:id,name,department_id', 'form.department:id,title'])
            ->select('id', 'form_id', 'status', 'investigation', 'created_at');

        $this->applyFilters($query, $filters);

        // Decode cursor to get last seen ID
        $lastId = null;
        if ($cursor) {
            $decoded = base64_decode($cursor);
            if ($decoded !== false) {
                $parts = explode(',', $decoded);
                if (count($parts) >= 2) {
                    $lastId = (int) $parts[0];
                }
            }
        }

        // Use cursor-based approach: WHERE id < last_seen_id
        // This is more efficient than OFFSET for large datasets
        if ($lastId !== null) {
            $query->where('id', '<', $lastId);
        }

        // Fetch one extra record to determine if there's a next page
        $submissions = $query->orderBy('id', 'desc')
            ->limit($perPage + 1)
            ->get();

        $hasMore = $submissions->count() > $perPage;
        if ($hasMore) {
            $submissions = $submissions->take($perPage);
        }

        // Generate next cursor from last item
        $nextCursor = null;
        if ($hasMore && $submissions->isNotEmpty()) {
            $lastSubmission = $submissions->last();
            // Cursor encodes the last ID for the next page
            $nextCursor = base64_encode((string) $lastSubmission->id);
        }

        // Enrich submissions with computed fields
        $submissions = $this->enrichSubmissions($submissions);

        return [
            'items' => $submissions,
            'next_cursor' => $nextCursor,
            'has_more' => $hasMore,
        ];
    }

    /**
     * Enrich submissions with computed fields (name, email, ratings).
     */
    private function enrichSubmissions(Collection $submissions): Collection
    {
        if ($submissions->isEmpty()) {
            return $submissions;
        }

        $submissionIds = $submissions->pluck('id')->toArray();

        // Fetch comment stats in a single query
        $commentStats = DB::table('submission_comments')
            ->whereIn('submission_id', $submissionIds)
            ->selectRaw('submission_id, COUNT(*) as comment_count, AVG(rating) as avg_rating')
            ->groupBy('submission_id')
            ->get()
            ->keyBy('submission_id');

        // Fetch all details in a single query
        $details = SubmissionDetail::whereIn('submission_id', $submissionIds)
            ->select('submission_id', 'field_name', 'field_value')
            ->get()
            ->groupBy('submission_id');

        $submissions->transform(function ($submission) use ($details, $commentStats) {
            $submissionDetails = $details->get($submission->id, collect());
            $stats = $commentStats->get($submission->id);

            return $this->buildComputedSubmission($submission, $submissionDetails, $stats);
        });

        return $submissions;
    }

    /**
     * Enrich paginated submissions with computed fields.
     */
    private function enrichPaginatedSubmissions(LengthAwarePaginator $paginator): LengthAwarePaginator
    {
        $submissionIds = $paginator->getCollection()->pluck('id')->toArray();

        // Fetch comment counts and avg ratings manually
        $commentStats = DB::table('submission_comments')
            ->whereIn('submission_id', $submissionIds)
            ->selectRaw('submission_id, COUNT(*) as comment_count, AVG(rating) as avg_rating')
            ->groupBy('submission_id')
            ->get()
            ->keyBy('submission_id');

        $details = SubmissionDetail::whereIn('submission_id', $submissionIds)
            ->select('submission_id', 'field_name', 'field_value')
            ->get()
            ->groupBy('submission_id');

        $paginator->getCollection()->transform(function ($submission) use ($details, $commentStats) {
            $submissionDetails = $details->get($submission->id, collect());
            $stats = $commentStats->get($submission->id);

            return $this->buildComputedSubmission($submission, $submissionDetails, $stats);
        });

        return $paginator;
    }

    /**
     * Build computed submission with transformed details.
     */
    private function buildComputedSubmission($submission, $submissionDetails, $stats): Submission
    {
        // Normalize field names: remove extra spaces, convert to lowercase
        $normalizedNameFields = $submissionDetails->map(function ($detail) {
            $detail->normalized_name = strtolower(str_replace(' ', '', $detail->field_name));

            return $detail;
        });

        // Find name field - support all variations including with spaces
        $nameField = $submissionDetails->firstWhere('field_name', 'adsoyad')
            ?? $submissionDetails->firstWhere('field_name', 'ad_soyad')
            ?? $submissionDetails->firstWhere('field_name', 'ad soyad')
            ?? $submissionDetails->firstWhere('field_name', 'name')
            ?? $submissionDetails->firstWhere('field_name', 'full_name')
            ?? $submissionDetails->firstWhere('field_name', 'name_surname')
            ?? $submissionDetails->firstWhere('field_name', 'namesurname')
            ?? $submissionDetails->firstWhere('field_name', 'name surname')
            ?? $submissionDetails->firstWhere('field_name', 'isim')
            ?? $submissionDetails->firstWhere('field_name', 'ad')
            ?? $submissionDetails->firstWhere('field_name', 'soyad')
            ?? $submissionDetails->firstWhere('field_name', 'soyisim')
            ?? $submissionDetails->firstWhere('field_name', 'surname')
            ?? ($normalizedNameFields->firstWhere('normalized_name', 'adsoyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'adsoyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'adsoyad'));

        // Find surname field for split name/surname scenarios
        $surnameField = $submissionDetails->firstWhere('field_name', 'soyisim')
            ?? $submissionDetails->firstWhere('field_name', 'soyad')
            ?? $submissionDetails->firstWhere('field_name', 'surname')
            ?? $submissionDetails->firstWhere('field_name', 'last_name')
            ?? $submissionDetails->firstWhere('field_name', 'lastname')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'soyisim')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'soyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'surname');

        // Build full name
        $fullName = '';
        if ($nameField && $nameField->field_value) {
            $fullName = trim($nameField->field_value);
        }
        if ($surnameField && $surnameField->field_value) {
            $fullName .= ' '.trim($surnameField->field_value);
        }

        // If we still don't have a name, search for any field that might contain both
        if (empty($fullName) || $fullName === '') {
            $possibleFullNameFields = ['name', 'fullname', 'full_name', 'adsoyad', 'ad_soyad', 'name_surname', 'namesurname', 'name surname', 'isimsoyisim', 'isim_soyisim'];
            foreach ($possibleFullNameFields as $field) {
                $candidate = $submissionDetails->firstWhere('field_name', $field);
                if ($candidate && $candidate->field_value) {
                    $fullName = trim($candidate->field_value);
                    break;
                }
            }
        }

        $emailField = $submissionDetails->firstWhere('field_name', 'email')
            ?? $submissionDetails->firstWhere('field_name', 'e-posta')
            ?? $submissionDetails->firstWhere('field_name', 'e_posta')
            ?? $submissionDetails->firstWhere('field_field', 'eposta')
            ?? $submissionDetails->firstWhere('field_name', 'mail')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'email')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'eposta');

        $submission->applicant_name = trim($fullName) ?: 'Belirtilmemiş';
        $submission->applicant_email = $emailField?->field_value ?? '-';
        $submission->comment_count = $stats?->comment_count ?? 0;
        $submission->avg_rating = $stats?->avg_rating ? round((float) $stats->avg_rating, 1) : null;

        // Capitalize form name and department title
        if ($submission->form) {
            $submission->form->name = ucwords(strtolower($submission->form->name));
            if ($submission->form->department) {
                $submission->form->department->title = ucwords(strtolower($submission->form->department->title));
            }
        }

        return $submission;
    }

    /**
     * Transform submission for getAll() method.
     * Uses eager-loaded relationships so doesn't need extra queries.
     */
    private function transformSubmission(Submission $submission): Submission
    {
        $submissionDetails = $submission->details;

        // Normalize field names: remove extra spaces, convert to lowercase
        $normalizedNameFields = $submissionDetails->map(function ($detail) {
            $detail->normalized_name = strtolower(str_replace(' ', '', $detail->field_name));

            return $detail;
        });

        // Find name field - support all variations including with spaces
        $nameField = $submissionDetails->firstWhere('field_name', 'adsoyad')
            ?? $submissionDetails->firstWhere('field_name', 'ad_soyad')
            ?? $submissionDetails->firstWhere('field_name', 'ad soyad')
            ?? $submissionDetails->firstWhere('field_name', 'name')
            ?? $submissionDetails->firstWhere('field_name', 'full_name')
            ?? $submissionDetails->firstWhere('field_name', 'name_surname')
            ?? $submissionDetails->firstWhere('field_name', 'namesurname')
            ?? $submissionDetails->firstWhere('field_name', 'name surname')
            ?? $submissionDetails->firstWhere('field_name', 'isim')
            ?? $submissionDetails->firstWhere('field_name', 'ad')
            ?? $submissionDetails->firstWhere('field_name', 'soyad')
            ?? $submissionDetails->firstWhere('field_name', 'soyisim')
            ?? $submissionDetails->firstWhere('field_name', 'surname')
            ?? ($normalizedNameFields->firstWhere('normalized_name', 'adsoyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'adsoyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'adsoyad'));

        // Find surname field for split name/surname scenarios
        $surnameField = $submissionDetails->firstWhere('field_name', 'soyisim')
            ?? $submissionDetails->firstWhere('field_name', 'soyad')
            ?? $submissionDetails->firstWhere('field_name', 'surname')
            ?? $submissionDetails->firstWhere('field_name', 'last_name')
            ?? $submissionDetails->firstWhere('field_name', 'lastname')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'soyisim')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'soyad')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'surname');

        // Build full name
        $fullName = '';
        if ($nameField && $nameField->field_value) {
            $fullName = trim($nameField->field_value);
        }
        if ($surnameField && $surnameField->field_value) {
            $fullName .= ' '.trim($surnameField->field_value);
        }

        // If we still don't have a name, search for any field that might contain both
        if (empty($fullName) || $fullName === '') {
            $possibleFullNameFields = ['name', 'fullname', 'full_name', 'adsoyad', 'ad_soyad', 'name_surname', 'namesurname', 'name surname', 'isimsoyisim', 'isim_soyisim'];
            foreach ($possibleFullNameFields as $field) {
                $candidate = $submissionDetails->firstWhere('field_name', $field);
                if ($candidate && $candidate->field_value) {
                    $fullName = trim($candidate->field_value);
                    break;
                }
            }
        }

        $emailField = $submissionDetails->firstWhere('field_name', 'email')
            ?? $submissionDetails->firstWhere('field_name', 'e-posta')
            ?? $submissionDetails->firstWhere('field_name', 'e_posta')
            ?? $submissionDetails->firstWhere('field_name', 'eposta')
            ?? $submissionDetails->firstWhere('field_name', 'mail')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'email')
            ?? $normalizedNameFields->firstWhere('normalized_name', 'eposta');

        $submission->applicant_name = trim($fullName) ?: 'Belirtilmemiş';
        $submission->applicant_email = $emailField?->field_value ?? '-';
        $submission->comment_count = $submission->comments->count();
        $submission->avg_rating = $submission->comments->whereNotNull('rating')->avg('rating');

        // Capitalize form name and department title
        if ($submission->form) {
            $submission->form->name = ucwords(strtolower($submission->form->name));
            if ($submission->form->department) {
                $submission->form->department->title = ucwords(strtolower($submission->form->department->title));
            }
        }

        return $submission;
    }

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
    public function updateInvestigation(int $id, string $investigation, ?string $notes = null): Submission
    {
        $submission = $this->findOrFail($id);
        $submission->update([
            'investigation' => $investigation,
            'investigation_notes' => $notes,
        ]);

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
