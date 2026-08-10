<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\ICandidateRepository;
use App\Models\Candidate;
use App\Models\ContactInteraction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CandidateService
{
    public function __construct(
        protected ICandidateRepository $candidateRepository
    ) {}

    /**
     * Get paginated candidates with interaction stats.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->candidateRepository->getPaginated($filters, $perPage);
    }

    /**
     * Get a candidate with its interactions.
     */
    public function getWithInteractions(int $id): Candidate
    {
        return $this->candidateRepository->getWithInteractions($id);
    }

    /**
     * Create a new candidate.
     */
    public function create(array $data): Candidate
    {
        return $this->candidateRepository->create($data);
    }

    /**
     * Update an existing candidate.
     */
    public function update(int $id, array $data): Candidate
    {
        return $this->candidateRepository->update($id, $data);
    }

    /**
     * Delete a candidate.
     */
    public function delete(int $id): bool
    {
        return $this->candidateRepository->delete($id);
    }

    /**
     * Create a contact interaction for a candidate.
     */
    public function createInteraction(int $candidateId, array $data, ?int $userId): ContactInteraction
    {
        return $this->candidateRepository->createInteraction($candidateId, $data, $userId);
    }
}