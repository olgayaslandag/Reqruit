<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use App\Services\FormService;
use App\Services\SubmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function __construct(
        protected SubmissionService $submissionService,
        protected FormService $formService,
        protected DepartmentService $departmentService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['form_id', 'status', 'investigation', 'date_from', 'date_to', 'department_id']);

        $submissions = $this->submissionService->getAll($filters);
        $forms = $this->formService->getAll();
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'forms' => $forms,
            'departments' => $departments,
            'filters' => $filters,
        ]);
    }

    public function show(int $id)
    {
        $submission = $this->submissionService->getById($id);

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewing,interview,offer,hired,rejected',
        ]);

        $this->submissionService->updateStatus($id, $validated['status']);

        return back()->with('success', 'Başvuru durumu güncellendi.');
    }

    public function updateInvestigation(Request $request, int $id)
    {
        $validated = $request->validate([
            'investigation' => 'required|in:pending,completed,none',
        ]);

        $this->submissionService->updateInvestigation($id, $validated['investigation']);

        return back()->with('success', 'İstihbarat durumu güncellendi.');
    }

    public function addComment(Request $request, int $id)
    {
        $validated = $request->validate([
            'comment' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_private' => 'nullable|boolean',
        ]);

        $this->submissionService->addComment($id, $validated, auth()->id());

        return back()->with('success', 'Yorum eklendi.');
    }

    public function destroy(int $id)
    {
        $this->submissionService->delete($id);

        return redirect()->route('admin.submissions.index')
            ->with('success', 'Başvuru başarıyla silindi.');
    }
}
