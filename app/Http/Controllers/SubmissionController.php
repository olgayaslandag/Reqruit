<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AddSubmissionCommentRequest;
use App\Http\Requests\StoreContactInteractionRequest;
use App\Http\Requests\UpdateSubmissionStatusRequest;
use App\Jobs\RunAiEvaluation;
use App\Models\ContactInteraction;
use App\Models\Submission;
use App\Services\AiEvaluationService;
use App\Services\CandidateService;
use App\Services\DepartmentService;
use App\Services\FormService;
use App\Services\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function __construct(
        protected SubmissionService $submissionService,
        protected FormService $formService,
        protected DepartmentService $departmentService,
        protected AiEvaluationService $aiEvaluationService,
        protected CandidateService $candidateService
    ) {
        $this->authorizeResource(Submission::class, 'submission');
    }

    public function index(Request $request)
    {
        $filters = $request->only(['form_id', 'status', 'investigation', 'date_from', 'date_to', 'department_id']);

        $submissions = $this->submissionService->getPaginated($filters, 15);
        $forms = $this->formService->getAll();
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'forms' => $forms,
            'departments' => $departments,
            'filters' => $filters,
        ]);
    }

    public function show(Submission $submission)
    {
        $this->authorize('view', $submission);

        $submission = $this->submissionService->getById($submission->id);

        // Filter details further in the controller to ensure only files the user can view are exposed on frontend
        $submission->details = $submission->details->filter(function ($detail) use ($submission) {
            // Allow non-file details to be visible
            if (! $detail->isFile()) {
                return true;
            }

            // For files, check if the user can actually access them
            return auth()->user() && Gate::check('viewFile', $submission);
        });

        // Load intelligence reports for this submission
        $intelligenceReports = $submission->intelligenceReports()->get();

        // Load contact interactions and AI evaluations for this submission
        $interactions = $submission->interactions()
            ->with('creator')
            ->orderBy('interaction_date', 'desc')
            ->get();

        $aiEvaluations = $submission->aiEvaluations()
            ->with('creator')
            ->get();

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => $submission,
            'intelligenceReports' => $intelligenceReports,
            'interactions' => $interactions,
            'aiEvaluations' => $aiEvaluations,
        ]);
    }

    public function storeIntelligenceReport(Request $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,completed,none'],
            'notes' => ['required', 'string', 'max:2000'], // increased max length for more detailed messages
        ]);

        // Create a new intelligence report
        $intelligenceReport = $this->submissionService->createIntelligenceReport(
            $submission->id,
            $validated['status'],
            $validated['notes'],
            now(), // use current timestamp
            auth()->id() // Use the authenticated user as the creator
        );

        return back()->with('success', 'İstihbarat raporu oluşturuldu.');
    }

    public function updateStatus(UpdateSubmissionStatusRequest $request, Submission $submission)
    {
        $this->authorize('review', $submission);

        $this->submissionService->updateStatus($submission->id, $request->validated('status'));

        return back()->with('success', 'Başvuru durumu güncellendi.');
    }

    public function updateInvestigation(Request $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,completed,none'],
            'notes' => ['required', 'string', 'max:1000'],
            'date_of_investigation' => ['required', 'date'],
            'investigation_type' => ['required', 'string', 'in:background,criminal,financial,employment,education,others'],
            'priority_level' => ['required', 'string', 'in:low,medium,high,critical'],
        ]);

        // Create a new intelligence report
        $this->submissionService->createIntelligenceReport(
            $submission->id,
            $validated['status'],
            $validated['notes'],
            $validated['date_of_investigation'],
            auth()->id(),
            $validated['investigation_type'],
            $validated['priority_level']
        );

        return back()->with('success', 'İstihbarat raporu oluşturuldu.');
    }

    public function addComment(AddSubmissionCommentRequest $request, Submission $submission)
    {
        $this->authorize('addComment', $submission);

        $this->submissionService->addComment($submission->id, $request->validated(), Auth::id());

        return back()->with('success', 'Yorum eklendi.');
    }

    public function destroy(Submission $submission)
    {
        $this->submissionService->delete($submission->id);

        return redirect()->route('admin.submissions.index')
            ->with('success', 'Başvuru başarıyla silindi.');
    }

    public function destroyIntelligenceReport(Request $request, $submissionId, $reportId)
    {
        $submission = Submission::findOrFail($submissionId);
        $this->authorize('update', $submission);

        $report = \App\Models\IntelligenceReport::where('id', $reportId)
            ->where('submission_id', $submissionId)
            ->firstOrFail();

        $report->delete();

        return back()->with('success', 'İstihbarat raporu başarıyla silindi.');
    }

    public function storeInteraction(StoreContactInteractionRequest $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        ContactInteraction::create([
            'submission_id' => $submission->id,
            ...$request->validated(),
            'created_by' => auth()->id(),
        ]);

        return back()->with('success', 'Takip kaydı eklendi.');
    }

    public function evaluate(Request $request, Submission $submission)
    {
        $this->authorize('review', $submission);

        RunAiEvaluation::dispatch($submission);

        return back()->with('success', 'AI değerlendirmesi kuyruğa alındı. Sonuç birazdan görünecek.');
    }
}
