<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormRequest;
use App\Http\Requests\UpdateFormRequest;
use App\Models\Form;
use App\Services\DepartmentService;
use App\Services\FormService;
use Inertia\Inertia;

class FormController extends Controller
{
    public function __construct(
        protected FormService $formService,
        protected DepartmentService $departmentService
    ) {
        $this->authorizeResource(Form::class, 'form');
    }

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

    public function store(StoreFormRequest $request)
    {
        $this->formService->create($request->validated());

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla oluşturuldu.');
    }

    public function edit(Form $form)
    {
        $this->authorize('update', $form);

        $form->load('fields');
        $departments = $this->departmentService->getAll();

        return Inertia::render('Admin/Forms/Builder', [
            'departments' => $departments,
            'form' => $form,
        ]);
    }

    public function update(UpdateFormRequest $request, Form $form)
    {
        $this->formService->update($form->id, $request->validated());

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla güncellendi.');
    }

    public function destroy(Form $form)
    {
        $this->formService->delete($form->id);

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form başarıyla silindi.');
    }
}
