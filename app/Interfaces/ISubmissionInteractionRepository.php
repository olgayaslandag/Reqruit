<?php

declare(strict_types=1);

namespace App\Interfaces;

use App\Models\ContactInteraction;

interface ISubmissionInteractionRepository extends BaseInterface
{
    /**
     * Create a contact interaction linked to a submission.
     *
     * @param  array  $data  Interaction data (interaction_type, interaction_date, description, response)
     */
    public function createInteraction(int $submissionId, array $data, ?int $userId): ContactInteraction;
}
