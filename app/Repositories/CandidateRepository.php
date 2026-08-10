<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\ICandidateRepository;
use App\Models\Candidate;
use App\Models\ContactInteraction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CandidateRepository extends BaseRepository implements ICandidateRepository
{
    public function __construct(Candidate $model)
    {
        $this->model = $model;
    }

    /**
     * Get paginated candidates with interaction stats.
     *
     * Each candidate is enriched with `interaction_count` and `last_interaction_date`
     * computed from the contact_interactions table.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->withCount('interactions as interaction_count')
            ->withMax('interactions as last_interaction_date', 'interaction_date');

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get a candidate with its interactions (ordered by interaction_date desc).
     */
    public function getWithInteractions(int $id): Candidate
    {
        return $this->model->query()
            ->with([
                'interactions' => fn ($q) => $q->orderBy('interaction_date', 'desc'),
                'interactions.creator',
            ])
            ->findOrFail($id);
    }

    /**
     * Create a new candidate.
     */
    public function create(array $data): Candidate
    {
        return parent::create($data);
    }

    /**
     * Update an existing candidate.
     */
    public function update(int $id, array $data): Candidate
    {
        return parent::update($id, $data);
    }

    /**
     * Delete a candidate.
     */
    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    /**
     * Create a contact interaction for a candidate.
     */
    public function createInteraction(int $candidateId, array $data, ?int $userId): ContactInteraction
    {
        return ContactInteraction::create([
            'candidate_id' => $candidateId,
            'interaction_type' => $data['interaction_type'],
            'interaction_date' => $data['interaction_date'],
            'description' => $data['description'] ?? null,
            'response' => $data['response'] ?? null,
            'created_by' => $userId,
        ]);
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters(mixed $query, array $filters): void
    {
        if (isset($filters['search']) && ! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('current_employer', 'like', "%{$search}%")
                    ->orWhere('current_position', 'like', "%{$search}%");
            });
        }

        if (isset($filters['status']) && ! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
    }
}