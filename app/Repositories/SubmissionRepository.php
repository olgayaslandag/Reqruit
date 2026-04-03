<?php

namespace App\Repositories;

use App\Interfaces\ISubmissionRepository;
use App\Models\Submission;
use App\Models\SubmissionDetail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SubmissionRepository extends BaseRepository implements ISubmissionRepository
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
                // Look for fields that might have full name stored
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
        });

        return $submissions;
    }

    /**
     * Get paginated submissions with filters.
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

        $submissionIds = $paginator->getCollection()->pluck('id')->toArray();

        // Fetch comment counts and avg ratings manually
        $commentStats = \DB::table('submission_comments')
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
                // Look for fields that might have full name stored
                $possibleFullNameFields = ['name', 'fullname', 'full_name', 'adsoyad', 'ad_soyad', 'name_surname', 'namesurname', 'namme surname', 'isimsoyisim', 'isim_soyisim'];
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
            $submission->comment_count = $stats?->comment_count ?? 0;
            $submission->avg_rating = $stats?->avg_rating ? round((float) $stats->avg_rating, 1) : null;

            if ($submission->form) {
                $submission->form->name = ucwords(strtolower($submission->form->name));
                if ($submission->form->department) {
                    $submission->form->department->title = ucwords(strtolower($submission->form->department->title));
                }
            }

            return $submission;
        });

        return $paginator;
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
