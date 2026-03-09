<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Form;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->assignRole('super_admin');
    }

    public function test_authenticated_user_can_view_submissions_index(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/submissions');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Submissions/Index')
            ->has('submissions')
            ->has('forms')
            ->has('departments')
        );
    }

    public function test_authenticated_user_can_view_submission_detail(): void
    {
        $submission = Submission::factory()->create();

        $response = $this->actingAs($this->user)
            ->get("/admin/submissions/{$submission->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Submissions/Show')
            ->where('submission.id', $submission->id)
        );
    }

    public function test_authenticated_user_can_update_submission_status(): void
    {
        $submission = Submission::factory()->create(['status' => 'new']);

        $response = $this->actingAs($this->user)
            ->put("/admin/submissions/{$submission->id}/status", [
                'status' => 'reviewing',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'reviewing',
        ]);
    }

    public function test_status_must_be_valid(): void
    {
        $submission = Submission::factory()->create();

        $response = $this->actingAs($this->user)
            ->put("/admin/submissions/{$submission->id}/status", [
                'status' => 'invalid',
            ]);

        $response->assertSessionHasErrors('status');
    }

    public function test_authenticated_user_can_add_comment(): void
    {
        $submission = Submission::factory()->create();

        $response = $this->actingAs($this->user)
            ->post("/admin/submissions/{$submission->id}/comments", [
                'comment' => 'Test comment',
                'rating' => 4,
                'is_private' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('submission_comments', [
            'submission_id' => $submission->id,
            'comment' => 'Test comment',
            'rating' => 4,
        ]);
    }

    public function test_authenticated_user_can_delete_submission(): void
    {
        $submission = Submission::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete("/admin/submissions/{$submission->id}");

        $response->assertRedirect('/admin/submissions');
        $this->assertDatabaseMissing('submissions', [
            'id' => $submission->id,
        ]);
    }

    public function test_guest_cannot_access_admin_submissions(): void
    {
        $response = $this->get('/admin/submissions');

        $response->assertRedirect('/login');
    }

    public function test_submissions_can_be_filtered_by_status(): void
    {
        Submission::factory()->create(['status' => 'new']);
        Submission::factory()->create(['status' => 'reviewing']);
        Submission::factory()->create(['status' => 'hired']);

        $response = $this->actingAs($this->user)
            ->get('/admin/submissions?status=new');

        $response->assertOk();
    }

    public function test_submissions_can_be_filtered_by_department(): void
    {
        $department = Department::factory()->create();
        $form = Form::factory()->create(['department_id' => $department->id]);
        Submission::factory()->create(['form_id' => $form->id]);
        Submission::factory()->create();

        $response = $this->actingAs($this->user)
            ->get("/admin/submissions?department_id={$department->id}");

        $response->assertOk();
    }

    public function test_reference_no_is_generated_automatically(): void
    {
        $submission = Submission::factory()->create();

        $this->assertNotNull($submission->reference_no);
        $this->assertStringStartsWith('APP-', $submission->reference_no);
    }
}
