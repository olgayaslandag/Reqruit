<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Submission;
use App\Services\AiEvaluationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RunAiEvaluation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 2;

    /**
     * The maximum number of seconds the job can run.
     */
    public int $timeout = 120;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * The queue connection to push the job to.
     */
    public string $queue = 'ai';

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Submission $submission
    ) {}

    /**
     * Execute the job.
     */
    public function handle(AiEvaluationService $aiService): void
    {
        $aiService->evaluate($this->submission);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('RunAiEvaluation job failed', [
            'submission_id' => $this->submission->id,
            'error' => $exception->getMessage(),
        ]);
    }
}