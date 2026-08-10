<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\ISubmissionInteractionRepository;
use App\Models\ContactInteraction;

class SubmissionInteractionRepository extends BaseRepository implements ISubmissionInteractionRepository
{
    public function __construct(ContactInteraction $model)
    {
        $this->model = $model;
    }

    /**
     * Create a contact interaction linked to a submission.
     */
    public function createInteraction(int $submissionId, array $data, ?int $userId): ContactInteraction
    {
        return ContactInteraction::create([
            'submission_id' => $submissionId,
            'interaction_type' => $data['interaction_type'],
            'interaction_date' => $data['interaction_date'],
            'description' => $data['description'] ?? null,
            'response' => $data['response'] ?? null,
            'created_by' => $userId,
        ]);
    }
}