<?php

declare(strict_types=1);
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Services\WidgetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetFormController extends Controller
{
    public function __construct(
        protected WidgetService $widgetService
    ) {}

    public function show(string $slug): JsonResponse
    {
        $form = $this->widgetService->getFormBySlug($slug);

        if (! $form) {
            return response()->json([
                'success' => false,
                'message' => 'Form bulunamadı.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new FormResource($form),
        ]);
    }

    public function submit(Request $request, string $slug): JsonResponse
    {
        $form = $this->widgetService->getFormBySlug($slug);

        if (! $form) {
            return response()->json([
                'success' => false,
                'message' => 'Form bulunamadı.',
            ], 404);
        }

        $rules = $this->widgetService->buildValidationRules($form);

        $validated = $request->validate($rules);

        $submission = $this->widgetService->handleSubmission(
            $form,
            $validated,
            $request->file()
        );

        return response()->json([
            'success' => true,
            'message' => 'Başvurunuz başarıyla gönderildi.',
            'data' => [
                'reference_no' => $submission->reference_no,
            ],
        ], 201);
    }
}
