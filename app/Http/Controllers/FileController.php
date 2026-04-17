<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\SubmissionDetail;
use Illuminate\Http\Request;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{
    private function localDisk(): FilesystemAdapter
    {
        return Storage::disk('local');
    }
    /**
     * Generate a signed URL for file download (valid for 1 hour).
     */
    public function generateSignedUrl(Request $request, string $path): array
    {
        // Prevent path traversal attacks
        if (str_contains($path, '../') || str_contains($path, '..\\')) {
            abort(403, 'Invalid path');
        }

        $realPath = realpath(storage_path('app/private/'.$path));
        $basePath = realpath(storage_path('app/private'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can generate signed URLs
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        $disk = $this->localDisk();

        // Check if file exists
        if (! $disk->exists($path)) {
            abort(404, 'File not found');
        }

        // Generate temporary signed URL (valid for 1 hour)
        $url = $disk->temporaryUrl(
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

        $realPath = realpath(storage_path('app/private/'.$path));
        $basePath = realpath(storage_path('app/private'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can download files
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        $disk = $this->localDisk();

        // Check if file exists
        if (! $disk->exists($path)) {
            abort(404, 'File not found');
        }

        // Get the original filename from path
        $filename = basename($path);

        return $disk->download($path, $filename);
    }

    /**
     * Stream/display a file in browser (for previews - images, PDFs).
     */
    public function show(Request $request, string $path): Response
    {
        $disk = $this->localDisk();
        // Prevent path traversal attacks
        if (str_contains($path, '../') || str_contains($path, '..\\')) {
            abort(403, 'Invalid path');
        }

        $realPath = realpath(storage_path('app/private/'.$path));
        $basePath = realpath(storage_path('app/private'));
        if (! $realPath || ! str_starts_with($realPath, $basePath)) {
            abort(403, 'Invalid path');
        }

        // Only authenticated users can view files
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        // Validate submission ownership
        $this->validateSubmissionOwnership($path);

        $disk = $this->localDisk();

        // Check if file exists
        if (! $disk->exists($path)) {
            abort(404, 'File not found');
        }

        $mimeType = $disk->mimeType($path);

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
            return $disk->download($path);
        }

        return $disk->response($path, null, [
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
            abort(403, 'Access denied: Path must start with submissions/');
        }

        // Find submission details containing this file path
        $submissionDetail = SubmissionDetail::where('field_value', $path)->first();

        if (! $submissionDetail) {
            abort(403, 'File does not belong to any submission. Path: '.$path);
        }

        // Find parent submission
        $submission = $submissionDetail->submission;
        if (! $submission) {
            abort(403, 'Submission not found for this file');
        }

        // Verify user has permission to access this submission via policy
        $currentUser = Auth::user();

        // Apply policy check - this respects the roles defined in SubmissionPolicy
        $this->authorize('view', $submission);
    }
}
