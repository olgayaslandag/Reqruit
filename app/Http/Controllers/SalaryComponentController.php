<?php

namespace App\Http\Controllers;

use App\Models\SalaryComponent;
use App\Services\SalaryComponentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryComponentController extends Controller
{
    public function __construct(
        protected SalaryComponentService $salaryComponentService
    ) {
        $this->authorizeResource(SalaryComponent::class, 'salaryComponent');
    }

    /**
     * Maaş kalemi listesi.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'type',
            'category',
            'is_active',
            'search',
        ]);

        $components = $this->salaryComponentService->getPaginated(
            $filters,
            [],
            $request->get('per_page', 15)
        );

        return Inertia::render('Admin/SalaryComponents/Index', [
            'components' => $components,
            'filters' => $filters,
        ]);
    }

    /**
     * Maaş kalemi oluşturma formu.
     */
    public function create()
    {
        return Inertia::render('Admin/SalaryComponents/Create');
    }

    /**
     * Maaş kalemi kaydeder.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'code' => ['required', 'string', 'max:50', 'unique:salary_components,code'],
            'type' => ['required', 'in:earning,deduction'],
            'category' => ['required', 'in:fixed,variable'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_taxable' => ['boolean'],
            'is_sgk_applicable' => ['boolean'],
            'default_amount' => ['nullable', 'numeric', 'min:0'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        try {
            $component = $this->salaryComponentService->create($validated);

            return redirect()->route('admin.salary-components.index')
                ->with('success', 'Maaş kalemi başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Maaş kalemi detayı.
     */
    public function show(SalaryComponent $salaryComponent)
    {
        $component = $this->salaryComponentService->getById($salaryComponent->id);

        return Inertia::render('Admin/SalaryComponents/Show', [
            'component' => $component,
        ]);
    }

    /**
     * Maaş kalemi düzenleme formu.
     */
    public function edit(SalaryComponent $salaryComponent)
    {
        $component = $this->salaryComponentService->getById($salaryComponent->id);

        return Inertia::render('Admin/SalaryComponents/Edit', [
            'component' => $component,
        ]);
    }

    /**
     * Maaş kalemi günceller.
     */
    public function update(Request $request, SalaryComponent $salaryComponent)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'code' => ['required', 'string', 'max:50', 'unique:salary_components,code,'.$salaryComponent->id],
            'type' => ['required', 'in:earning,deduction'],
            'category' => ['required', 'in:fixed,variable'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_taxable' => ['boolean'],
            'is_sgk_applicable' => ['boolean'],
            'default_amount' => ['nullable', 'numeric', 'min:0'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        try {
            $this->salaryComponentService->update($salaryComponent->id, $validated);

            return redirect()->route('admin.salary-components.index')
                ->with('success', 'Maaş kalemi başarıyla güncellendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Maaş kalemi siler.
     */
    public function destroy(SalaryComponent $salaryComponent)
    {
        try {
            $this->salaryComponentService->delete($salaryComponent->id);

            return redirect()->route('admin.salary-components.index')
                ->with('success', 'Maaş kalemi başarıyla silindi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
