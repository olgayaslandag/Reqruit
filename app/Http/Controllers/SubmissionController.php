<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AddSubmissionCommentRequest;
use App\Http\Requests\UpdateSubmissionStatusRequest;
use App\Models\Submission;
use App\Services\DepartmentService;
use App\Services\FormService;
use App\Services\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function __construct(
        protected SubmissionService $submissionService,
        protected FormService $formService,
        protected DepartmentService $departmentService
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
        $submission = $this->submissionService->getById($submission->id);

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => $submission,
        ]);
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
            'investigation' => ['required', 'string', 'in:pending,completed,none'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->submissionService->updateInvestigation(
            $submission->id,
            $validated['investigation'],
            $validated['notes'] ?? null
        );

        return back()->with('success', 'İstihbarat durumu güncellendi.');
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
}
