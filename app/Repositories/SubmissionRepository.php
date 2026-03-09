<?php

namespace App\Repositories;

use App\Interfaces\SubmissionInterface;
use App\Models\Submission;
use App\Models\SubmissionDetail;
use Illuminate\Support\Str;

class SubmissionRepository implements SubmissionInterface
{
    public function getAll(array $filters = [])
    {
        $query = Submission::with(['form.department', 'details', 'comments']);

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

        $submissions = $query->orderBy('created_at', 'desc')->get();

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

    public function getById(int $id)
    {
        return Submission::with(['form.department', 'form.fields', 'comments.user'])->findOrFail($id);
    }

    public function getByReferenceNo(string $referenceNo)
    {
        return Submission::with(['form.department', 'details'])->where('reference_no', $referenceNo)->firstOrFail();
    }

    public function create(array $data)
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

    public function update(int $id, array $data)
    {
        $submission = Submission::findOrFail($id);
        $submission->update($data);

        return $submission;
    }

    public function updateStatus(int $id, string $status)
    {
        $submission = Submission::findOrFail($id);
        $submission->update(['status' => $status]);

        return $submission;
    }

    public function updateInvestigation(int $id, string $investigation)
    {
        $submission = Submission::findOrFail($id);
        $submission->update(['investigation' => $investigation]);

        return $submission;
    }

    public function delete(int $id)
    {
        $submission = Submission::findOrFail($id);

        return $submission->delete();
    }

    public function getWithDetails(int $id)
    {
        return Submission::with(['form.department', 'form.fields', 'details', 'comments.user'])->findOrFail($id);
    }
}
