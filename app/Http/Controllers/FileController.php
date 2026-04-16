<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\SubmissionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{
    /**
     * Generate a signed URL for file download (valid for 1 hour).
     */
    public function generateSignedUrl(Request $request, string $path): array
    {
        // Prevent path traversal attacks
        if (str_contains($path, '../') || str_contains($path, '..\\')) {
            abort(403, 'Invalid path');
        }

        $realPath = realpath(storage_path('app/'.$path));
        $basePath = realpath(storage_path('app'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can generate signed URLs
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        // Check if file exists
        if (! Storage::disk('local')->exists($path)) {
            abort(404, 'File not found');
        }

        // Generate temporary signed URL (valid for 1 hour)
        $url = Storage::disk('local')->temporaryUrl(
            $path,
            now()->addHour()
        );

        return [
            'url' => $url,
            'expires_at' => now()->addHour()->toIso8601String(),
        ];
    }

    /**
     * Download a file directly (requires authentication).
     */
    public function download(Request $request, string $path): Response
    {
        // Prevent path traversal attacks
        if (str_contains($path, '../') || str_contains($path, '..\\')) {
            abort(403, 'Invalid path');
        }

        $realPath = realpath(storage_path('app/'.$path));
        $basePath = realpath(storage_path('app'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can download files
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        // Check if file exists
        if (! Storage::disk('local')->exists($path)) {
            abort(404, 'File not found');
        }

        // Get the original filename from path
        $filename = basename($path);

        return Storage::disk('local')->download($path, $filename);
    }

    /**
     * Stream/display a file in browser (for previews - images, PDFs).
     */
    public function show(Request $request, string $path): Response
    {
        // Prevent path traversal attacks
        if (str_contains($path, '../') || str_contains($path, '..\\')) {
            abort(403, 'Invalid path');
        }

        $realPath = realpath(storage_path('app/'.$path));
        $basePath = realpath(storage_path('app'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can view files
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        // Check if file exists
        if (! Storage::disk('local')->exists($path)) {
            abort(404, 'File not found');
        }

        $mimeType = Storage::disk('local')->mimeType($path);

        // Only allow safe file types for inline viewing
        $allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];

        if (! in_array($mimeType, $allowedMimeTypes)) {
            // For non-previewable files, force download
            return Storage::disk('local')->download($path);
        }

        return Storage::disk('local')->response($path, null, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * Validate that the requested file path belongs to a submission
     * owned by the authenticated user
     */
    private function validateSubmissionOwnership(string $path): void
    {
        // Check if path belongs to submissions directory
        if (! str_starts_with($path, 'submissions/')) {
            abort(403, 'Access denied: Invalid file type');
        }

        // Find submission details containing this file path
        $submissionDetail = SubmissionDetail::where('field_value', $path)->first();

        if (! $submissionDetail) {
            abort(403, 'File does not belong to any submission');
        }

        // Find parent submission
        $submission = $submissionDetail->submission;
        if (! $submission) {
            abort(403, 'Submission not found for this file');
        }

        // Verify user has permission to access this submission via policy
        $currentUser = Auth::user();

        // Apply policy check - this respects the roles defined in SubmissionPolicy
        Gate::authorize('view', $submission);
    }
}
