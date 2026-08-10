<?php

declare(strict_types=1);

namespace App\Interfaces;

use App\Models\Candidate;
use App\Models\ContactInteraction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ICandidateRepository extends BaseInterface
{
    /**
     * Get paginated candidates with interaction stats.
     *
     * @param  array  $filters  Filter options (search, status)
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Get a candidate with its interactions (ordered by interaction_date desc).
     */
    public function getWithInteractions(int $id): Candidate;

    /**
     * Create a new candidate.
     */
    public function create(array $data): Candidate;

    /**
     * Update an existing candidate.
     */
    public function update(int $id, array $data): Candidate;

    /**
     * Delete a candidate.
     */
    public function delete(int $id): bool;

    /**
     * Create a contact interaction for a candidate.
     *
     * @param  array  $data  Interaction data (interaction_type, interaction_date, description, response)
     */
    public function createInteraction(int $candidateId, array $data, ?int $userId): ContactInteraction;
}
