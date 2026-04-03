<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeService $employeeService
    ) {
        $this->authorizeResource(Employee::class, 'employee');
    }

    /**
     * Employee listesi (paginated).
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'status',
            'department_id',
            'employment_type',
            'contract_type',
            'manager_id',
            'hire_date_from',
            'hire_date_to',
            'position',
            'search',
        ]);

        $employees = $this->employeeService->getPaginated(
            $filters,
            ['department', 'manager'],
            $request->get('per_page', 15)
        );


        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'filters' => $filters,
            'departments' => \App\Models\Department::orderBy('title')->get(['id', 'title']),
            'employeeTree' => $this->employeeService->getTree(),
        ]);
    }

    /**
     * Employee oluşturma formu.
     */
    public function create()
    {
        return Inertia::render('Admin/Employees/Create', [
            'departments' => \App\Models\Department::orderBy('title')->get(['id', 'title']),
            'managers' => Employee::whereNull('deleted_at')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
            'allowedMimeTypes' => $this->employeeService->getAllowedMimeTypes(),
            'maxFileSize' => $this->employeeService->getMaxFileSize(),
        ]);
    }

    /**
     * Yeni employee kaydeder.
     */
    public function store(StoreEmployeeRequest $request)
    {
        try {
            $data = $request->validated();

            // Eğitim bilgilerini ayır
            $educationData = $data['education'] ?? [];
            unset($data['education']);

            // Employee oluştur
            $employee = $this->employeeService->createWithEducation($data, $educationData);

            return redirect()->route('admin.employees.index')
                ->with('success', 'Çalışan başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Employee detay sayfası.
     */
    public function show(Employee $employee)
    {
        $employee = $this->employeeService->getById($employee->id);

        return Inertia::render('Admin/Employees/Show', [
            'employee' => $employee,
            'all_departments' => \App\Models\Department::orderBy('title')->get(['id', 'title']),
        ]);
    }

    /**
     * Employee düzenleme formu.
     */
    public function edit(Employee $employee)
    {
        $employee = $this->employeeService->getById($employee->id);

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => $employee,
            'departments' => \App\Models\Department::orderBy('title')->get(['id', 'title']),
            'managers' => Employee::whereNull('deleted_at')
                ->where('id', '!=', $employee->id)
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
            'allowedMimeTypes' => $this->employeeService->getAllowedMimeTypes(),
            'maxFileSize' => $this->employeeService->getMaxFileSize(),
        ]);
    }

    /**
     * Employee günceller.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        try {
            $data = $request->validated();

            // Eğitim bilgilerini ayır
            $educationData = $data['education'] ?? [];
            unset($data['education']);

            // Employee güncelle
            $this->employeeService->updateWithEducation($employee->id, $data, $educationData);

            return redirect()->route('admin.employees.index')
                ->with('success', 'Çalışan başarıyla güncellendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Employee siler (soft delete).
     */
    public function destroy(Employee $employee)
    {
        try {
            $this->employeeService->delete($employee->id);

            return redirect()->route('admin.employees.index')
                ->with('success', 'Çalışan başarıyla silindi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Employee doküman yükleme.
     */
    public function uploadDocument(Request $request, Employee $employee): JsonResponse
    {
        $this->authorize('uploadDocument', $employee);

        $request->validate([
            'file' => ['required', 'file', 'max:5120'], // 5MB max
            'document_type' => ['required', 'string'],
        ]);

        try {
            $document = $this->employeeService->uploadDocument(
                $employee->id,
                $request->file('file'),
                $request->input('document_type')
            );

            return response()->json([
                'success' => true,
                'message' => 'Doküman başarıyla yüklendi.',
                'document' => $document,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Employee doküman silme.
     */
    public function deleteDocument(Request $request, Employee $employee, int $documentId): JsonResponse
    {
        $this->authorize('deleteDocument', $employee);

        try {
            $this->employeeService->deleteDocument($documentId);

            return response()->json([
                'success' => true,
                'message' => 'Doküman başarıyla silindi.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Pozisyon geçmişi ekleme.
     */
    public function addPosition(Request $request, Employee $employee)
    {
        $this->authorize('addPosition', $employee);

        $request->validate([
            'position_title' => ['required', 'string', 'max:200'],
            'department_id' => ['required', 'exists:departments,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->employeeService->addPosition($employee->id, $request->validated());

            return back()->with('success', 'Pozisyon geçmişi başarıyla eklendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Employee işten çıkarma.
     */
    public function terminate(Request $request, Employee $employee)
    {
        $request->validate([
            'termination_date' => ['required', 'date', 'before_or_equal:today'],
            'termination_reason' => ['required', 'string', 'max:1000'],
        ]);

        try {
            $this->employeeService->terminate($employee->id, $request->validated());

            return redirect()->route('admin.employees.index')
                ->with('success', 'Çalışan işten çıkarıldı.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Employee araması (API).
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'keyword' => ['required', 'string', 'min:2'],
        ]);

        $employees = $this->employeeService->search($request->input('keyword'));

        return response()->json([
            'employees' => $employees,
        ]);
    }
}
