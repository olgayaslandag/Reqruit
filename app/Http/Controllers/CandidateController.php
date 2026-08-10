<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\StoreContactInteractionRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Models\Candidate;
use App\Services\CandidateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function __construct(
        protected CandidateService $candidateService
    ) {
        $this->authorizeResource(Candidate::class, 'candidate');
    }

    /**
     * Candidate listesi (paginated).
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $candidates = $this->candidateService->getPaginated($filters, 15);

        return Inertia::render('Admin/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => $filters,
        ]);
    }

    /**
     * Candidate oluşturma formu.
     */
    public function create()
    {
        return Inertia::render('Admin/Candidates/Create');
    }

    /**
     * Yeni candidate kaydeder.
     */
    public function store(StoreCandidateRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        $this->candidateService->create($data);

        return redirect()->route('admin.candidates.index')
            ->with('success', 'Kalifiye eleman eklendi.');
    }

    /**
     * Candidate detayını gösterir.
     */
    public function show(Candidate $candidate)
    {
        $candidate = $this->candidateService->getWithInteractions($candidate->id);

        return Inertia::render('Admin/Candidates/Show', [
            'candidate' => $candidate,
            'interactions' => $candidate->interactions,
        ]);
    }

    /**
     * Candidate düzenleme formu.
     */
    public function edit(Candidate $candidate)
    {
        return Inertia::render('Admin/Candidates/Edit', [
            'candidate' => $candidate,
        ]);
    }

    /**
     * Candidate günceller.
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        $this->candidateService->update($candidate->id, $request->validated());

        return back()->with('success', 'Kalifiye eleman güncellendi.');
    }

    /**
     * Candidate siler.
     */
    public function destroy(Candidate $candidate)
    {
        $this->candidateService->delete($candidate->id);

        return redirect()->route('admin.candidates.index')
            ->with('success', 'Kalifiye eleman silindi.');
    }

    /**
     * Candidate için takip kaydı ekler.
     */
    public function storeInteraction(StoreContactInteractionRequest $request, Candidate $candidate)
    {
        $this->candidateService->createInteraction(
            $candidate->id,
            $request->validated(),
            auth()->id()
        );

        return back()->with('success', 'Takip kaydı eklendi.');
    }
}