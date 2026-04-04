<?php

declare(strict_types=1);


namespace Tests\Feature;

use App\Models\Department;
use App\Models\Form;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_view_forms_index(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/forms');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Forms/Index')
            ->has('forms')
            ->has('departments')
        );
    }

    public function test_authenticated_user_can_view_create_form_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/forms/create');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Forms/Builder')
            ->has('departments')
        );
    }

    public function test_authenticated_user_can_create_form(): void
    {
        $department = Department::factory()->create();

        $response = $this->actingAs($this->user)
            ->post('/admin/forms', [
                'name' => 'Test Form',
                'department_id' => $department->id,
                'description' => 'Test description',
                'fields' => [
                    [
                        'label' => 'Name',
                        'name' => 'name',
                        'type' => 'text',
                        'required' => true,
                    ],
                ],
            ]);

        $response->assertRedirect('/admin/forms/1/edit');
        $this->assertDatabaseHas('forms', [
            'name' => 'Test Form',
            'department_id' => $department->id,
        ]);
    }

    public function test_form_requires_name_and_department(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/forms', []);

        $response->assertSessionHasErrors(['name', 'department_id']);
    }

    public function test_authenticated_user_can_view_edit_form_page(): void
    {
        $form = Form::factory()->create();

        $response = $this->actingAs($this->user)
            ->get("/admin/forms/{$form->id}/edit");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Forms/Builder')
            ->where('form.id', $form->id)
        );
    }

    public function test_authenticated_user_can_update_form(): void
    {
        $form = Form::factory()->create();
        $department = Department::factory()->create();

        $response = $this->actingAs($this->user)
            ->put("/admin/forms/{$form->id}", [
                'name' => 'Updated Form',
                'department_id' => $department->id,
                'description' => 'Updated description',
            ]);

        $response->assertRedirect('/');
        $this->assertDatabaseHas('forms', [
            'id' => $form->id,
            'name' => 'Updated Form',
        ]);
    }

    public function test_authenticated_user_can_delete_form(): void
    {
        $form = Form::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete("/admin/forms/{$form->id}");

        $response->assertRedirect('/admin/forms');
        $this->assertDatabaseMissing('forms', [
            'id' => $form->id,
        ]);
    }

    public function test_guest_cannot_access_admin_forms(): void
    {
        $response = $this->get('/admin/forms');

        $response->assertRedirect('/login');
    }

    public function test_form_slug_is_generated_automatically(): void
    {
        $department = Department::factory()->create();

        $this->actingAs($this->user)
            ->post('/admin/forms', [
                'name' => 'Test Form Name',
                'department_id' => $department->id,
            ]);

        $this->assertDatabaseHas('forms', [
            'slug' => 'test-form-name',
        ]);
    }

    public function test_duplicate_slugs_are_handled(): void
    {
        $department = Department::factory()->create();
        Form::factory()->create(['slug' => 'test-form']);

        $this->actingAs($this->user)
            ->post('/admin/forms', [
                'name' => 'Test Form',
                'department_id' => $department->id,
            ]);

        $this->assertDatabaseHas('forms', [
            'slug' => 'test-form-1',
        ]);
    }
}
