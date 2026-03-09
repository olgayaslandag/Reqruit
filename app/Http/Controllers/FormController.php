<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use App\Services\FormService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    public function __construct(
        protected FormService $formService,
        protected DepartmentService $departmentService
    ) {}

    public function index()
    {
        $forms = $this->formService->getAll();
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Forms/Index', [
            'forms' => $forms,
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Forms/Builder', [
            'departments' => $departments,
            'form' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
            'notification_emails' => 'nullable|array',
            'notification_emails.*' => 'nullable|email',
            'fields' => 'nullable|array',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|string|max:50',
            'fields.*.required' => 'nullable|boolean',
            'fields.*.options' => 'nullable|array',
        ]);

        $this->formService->create($validated);

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla oluşturuldu.');
    }

    public function edit(int $id)
    {
        $form = $this->formService->getById($id);
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Forms/Builder', [
            'departments' => $departments,
            'form' => $form,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
            'notification_emails' => 'nullable|array',
            'notification_emails.*' => 'nullable|email',
            'fields' => 'nullable|array',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|string|max:50',
            'fields.*.required' => 'nullable|boolean',
            'fields.*.options' => 'nullable|array',
        ]);

        $this->formService->update($id, $validated);

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla güncellendi.');
    }

    public function destroy(int $id)
    {
        $this->formService->delete($id);

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla silindi.');
    }
}
