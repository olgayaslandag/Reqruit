<?php

declare(strict_types=1);
namespace App\Http\Controllers;

use App\Http\Requests\RejectAdvanceRequest;
use App\Http\Requests\StoreAdvanceRequest;
use App\Http\Requests\UpdateAdvanceRequest;
use App\Models\AdvanceRequest;
use App\Services\AdvanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdvanceController extends Controller
{
    public function __construct(
        protected AdvanceService $advanceService
    ) {
        $this->authorizeResource(AdvanceRequest::class, 'advance');
    }

    /**
     * Avans talep listesi.
     */
    public function index(Request $request)
    {
        // authorizeResource zaten viewAny kontrolü yapıyor, bu yüzden manuel tekrar authorize'e gerek yok

        $filters = $request->only([
            'status',
            'employee_id',
            'amount_min',
            'amount_max',
            'requested_date_from',
            'requested_date_to',
            'search',
        ]);

        $statusCounts = $this->advanceService->getStatusCounts();

        $advances = $this->advanceService->getPaginated(
            $filters,
            ['employee'],
            $request->get('per_page', 15)
        );

        return Inertia::render('Admin/Advances/Index', [
            'advances' => $advances,
            'filters' => $filters,
            'pendingCount' => $statusCounts['pending'],
            'approvedCount' => $statusCounts['approved'],
            'rejectedCount' => $statusCounts['rejected'],
        ]);
    }

    /**
     * Avans talebi oluşturma formu.
     */
    public function create()
    {
        return Inertia::render('Admin/Advances/Create', [
            'employees' => \App\Models\Employee::whereNull('deleted_at')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Avans talebi kaydeder.
     */
    public function store(StoreAdvanceRequest $request)
    {
        try {
            $advance = $this->advanceService->create($request->validated());

            return redirect()->route('admin.advances.index')
                ->with('success', 'Avans talebi başarıyla oluşturuldu.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Avans talebi detayı.
     */
    public function show(AdvanceRequest $advance)
    {
        $advance = $this->advanceService->getById($advance->id);

        return Inertia::render('Admin/Advances/Show', [
            'advance' => $advance,
        ]);
    }

    /**
     * Avans talebi düzenleme formu.
     */
    public function edit(AdvanceRequest $advance)
    {
        $advance = $this->advanceService->getById($advance->id);

        return Inertia::render('Admin/Advances/Edit', [
            'advance' => $advance,
            'employees' => \App\Models\Employee::whereNull('deleted_at')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Avans talebi günceller.
     */
    public function update(UpdateAdvanceRequest $request, AdvanceRequest $advance)
    {
        try {
            $this->advanceService->update($advance->id, $request->validated());

            return redirect()->route('admin.advances.index')
                ->with('success', 'Avans talebi başarıyla güncellendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Avans talebi siler.
     */
    public function destroy(AdvanceRequest $advance)
    {
        try {
            $this->advanceService->delete($advance->id);

            return redirect()->route('admin.advances.index')
                ->with('success', 'Avans talebi başarıyla silindi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Avans talebini onaylar.
     */
    public function approve(ApproveAdvanceRequest $request, AdvanceRequest $advance)
    {
        $this->authorize('approve', $advance);

        try {
            $this->advanceService->approve($advance->id, auth()->id());

            return back()->with('success', 'Avans talebi onaylandı.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Avans talebini reddeder.
     */
    public function reject(RejectAdvanceRequest $request, AdvanceRequest $advance)
    {
        $this->authorize('reject', $advance);

        $validated = $request->validated();

        try {
            $this->advanceService->reject($advance->id, auth()->id(), $validated['reason']);

            return back()->with('success', 'Avans talebi reddedildi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Avansı ödenmiş olarak işaretler.
     */
    public function markAsPaid(Request $request, AdvanceRequest $advance)
    {
        $this->authorize('markAsPaid', $advance);

        try {
            $this->advanceService->markAsPaid($advance->id, $request->input('payment_date'));

            return back()->with('success', 'Avans ödendi olarak işaretlendi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Avans talebini iptal eder.
     */
    public function cancel(AdvanceRequest $advance)
    {
        $this->authorize('cancel', $advance);

        try {
            $this->advanceService->cancel($advance->id);

            return back()->with('success', 'Avans talebi iptal edildi.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
