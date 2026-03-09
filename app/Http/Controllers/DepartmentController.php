<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct(
        protected DepartmentService $departmentService
    ) {}

    public function index()
    {
        $departments = $this->departmentService->getTree();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'emails' => 'nullable|array',
            'emails.*' => 'email',
            'parent_id' => 'nullable|exists:departments,id',
        ]);

        $this->departmentService->create($validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla oluşturuldu.');
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'emails' => 'nullable|array',
            'emails.*' => 'email',
            'parent_id' => 'nullable|exists:departments,id',
        ]);

        $this->departmentService->update($id, $validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla güncellendi.');
    }

    public function destroy(int $id)
    {
        $this->departmentService->delete($id);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla silindi.');
    }
}
