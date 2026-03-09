<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Services\WidgetService;
use Illuminate\Http\JsonResponse;

class WidgetController extends Controller
{
    public function __construct(
        protected WidgetService $widgetService
    ) {}

    public function departments(): JsonResponse
    {
        $departments = $this->widgetService->getRootDepartments();

        return response()->json([
            'success' => true,
            'data' => DepartmentResource::collection($departments),
        ]);
    }

    public function department(int $id): JsonResponse
    {
        $department = $this->widgetService->getDepartmentWithDetails($id);

        if (! $department) {
            return response()->json([
                'success' => false,
                'message' => 'Departman bulunamadı.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new DepartmentResource($department),
        ]);
    }
}
