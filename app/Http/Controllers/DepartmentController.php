<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct(
        protected DepartmentService $departmentService
    ) {
        $this->authorizeResource(Department::class, 'department');
    }

    public function index()
    {
        $departments = $this->departmentService->getTree();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $departments = $this->departmentService->getTree();

        return Inertia::render('Admin/Departments/Create', [
            'departments' => $departments,
        ]);
    }

    public function edit(Department $department)
    {
        $departments = $this->departmentService->getTree();

        return Inertia::render('Admin/Departments/Edit', [
            'department' => $department,
            'departments' => $departments,
        ]);
    }

    public function store(StoreDepartmentRequest $request)
    {
        $this->departmentService->create($request->validated());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla oluşturuldu.');
    }

    public function update(StoreDepartmentRequest $request, Department $department)
    {
        $this->departmentService->update($department->id, $request->validated());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla güncellendi.');
    }

    public function destroy(Department $department)
    {
        $this->departmentService->delete($department->id);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Departman başarıyla silindi.');
    }
}
