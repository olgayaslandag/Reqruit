<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_view_departments_index(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/departments');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Departments/Index')
            ->has('departments')
        );
    }

    public function test_authenticated_user_can_create_department(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/departments', [
                'title' => 'Test Department',
                'emails' => ['test@example.com'],
            ]);

        $response->assertRedirect('/admin/departments');
        $this->assertDatabaseHas('departments', [
            'title' => 'Test Department',
        ]);
    }

    public function test_department_requires_title(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/departments', []);

        $response->assertSessionHasErrors('title');
    }

    public function test_authenticated_user_can_update_department(): void
    {
        $department = Department::factory()->create();

        $response = $this->actingAs($this->user)
            ->put("/admin/departments/{$department->id}", [
                'title' => 'Updated Department',
            ]);

        $response->assertRedirect('/admin/departments');
        $this->assertDatabaseHas('departments', [
            'id' => $department->id,
            'title' => 'Updated Department',
        ]);
    }

    public function test_authenticated_user_can_delete_department(): void
    {
        $department = Department::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete("/admin/departments/{$department->id}");

        $response->assertRedirect('/admin/departments');
        $this->assertDatabaseMissing('departments', [
            'id' => $department->id,
        ]);
    }

    public function test_guest_cannot_access_admin_departments(): void
    {
        $response = $this->get('/admin/departments');

        $response->assertRedirect('/login');
    }

    public function test_department_can_have_parent(): void
    {
        $parent = Department::factory()->create();

        $response = $this->actingAs($this->user)
            ->post('/admin/departments', [
                'title' => 'Child Department',
                'parent_id' => $parent->id,
            ]);

        $response->assertRedirect('/admin/departments');
        $this->assertDatabaseHas('departments', [
            'title' => 'Child Department',
            'parent_id' => $parent->id,
        ]);
    }

    public function test_department_slug_is_generated_automatically(): void
    {
        $this->actingAs($this->user)
            ->post('/admin/departments', [
                'title' => 'Test Department Name',
            ]);

        $this->assertDatabaseHas('departments', [
            'slug' => 'test-department-name',
        ]);
    }

    public function test_department_emails_must_be_valid(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/departments', [
                'title' => 'Test Department',
                'emails' => ['invalid-email'],
            ]);

        $response->assertSessionHasErrors('emails.0');
    }

    public function test_department_tree_structure(): void
    {
        $parent = Department::factory()->create(['title' => 'Parent']);
        $child = Department::factory()->create(['title' => 'Child', 'parent_id' => $parent->id]);

        $response = $this->actingAs($this->user)
            ->get('/admin/departments');

        $response->assertOk();
    }
}
