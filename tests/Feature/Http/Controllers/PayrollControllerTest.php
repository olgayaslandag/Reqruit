<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PayrollControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $hrUser;

    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'hr', 'guard_name' => 'web']);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('admin');

        $this->hrUser = User::factory()->create();
        $this->hrUser->assignRole('hr');

        $this->regularUser = User::factory()->create();
    }

    // ============================================================
    // PAYROLL CONTROLLER AUTHORIZATION TESTS
    // ============================================================

    public function test_index_requires_authorization(): void
    {
        // Yetkisiz kullanıcı giriş yapamamalı
        $response = $this->get('/admin/payrolls');
        $response->assertRedirect('/login');

        // Yetkili kullanıcı erişebilmeli
        $response = $this->actingAs($this->adminUser)->get('/admin/payrolls');
        $response->assertOk();
    }

    public function test_show_requires_authorization(): void
    {
        $period = PayrollPeriod::factory()->create();

        $response = $this->get("/admin/payrolls/{$period->id}");
        $response->assertRedirect('/login');

        $response = $this->actingAs($this->adminUser)->get("/admin/payrolls/{$period->id}");
        $response->assertOk();
    }

    public function test_create_requires_admin_or_hr_role(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/payrolls/create');
        $response->assertForbidden();

        $response = $this->actingAs($this->adminUser)->get('/admin/payrolls/create');
        $response->assertOk();

        $response = $this->actingAs($this->hrUser)->get('/admin/payrolls/create');
        $response->assertOk();
    }

    public function test_store_requires_admin_or_hr_role(): void
    {
        $data = [
            'name' => 'Feb 2026',
            'start_date' => '2026-02-01',
            'end_date' => '2026-02-28',
            'payment_frequency' => 'monthly',
        ];

        // Regular kullanıcı yetkili değil
        $response = $this->actingAs($this->regularUser)->post('/admin/payrolls', $data);
        $response->assertForbidden();

        // Admin kullanıcı yetkili
        $response = $this->actingAs($this->adminUser)->post('/admin/payrolls', $data);
        $response->assertSessionHasNoErrors(); // Validation errors hariç
    }

    public function test_edit_requires_auth_and_proper_role(): void
    {
        $period = PayrollPeriod::factory()->create();

        $response = $this->actingAs($this->regularUser)->get("/admin/payrolls/{$period->id}/edit");
        $response->assertForbidden();

        $response = $this->actingAs($this->adminUser)->get("/admin/payrolls/{$period->id}/edit");
        $response->assertOk();
    }

    public function test_update_requires_admin_or_hr_role(): void
    {
        $period = PayrollPeriod::factory()->draft()->create();

        $data = [
            'name' => 'Updated Period Name',
            'start_date' => '2026-02-01',
            'end_date' => '2026-02-28',
            'payment_frequency' => 'monthly',
        ];

        $response = $this->actingAs($this->regularUser)
            ->put("/admin/payrolls/{$period->id}", $data);
        $response->assertForbidden();

        $response = $this->actingAs($this->adminUser)
            ->put("/admin/payrolls/{$period->id}", $data);

        // Redirect after successful update
        $response->assertStatus(302);
    }

    public function test_destroy_requires_admin_or_hr_role(): void
    {
        $period = PayrollPeriod::factory()->draft()->create();

        $response = $this->actingAs($this->regularUser)
            ->delete("/admin/payrolls/{$period->id}");
        $response->assertForbidden();

        $response = $this->actingAs($this->adminUser)
            ->delete("/admin/payrolls/{$period->id}");
    }

    public function test_generate_items_requires_proper_role_and_conditions(): void
    {
        $period = PayrollPeriod::factory()->draft()->create();
        Employee::factory()->create(); // Make sure employee exists

        $response = $this->actingAs($this->regularUser)
            ->post("/admin/payrolls/{$period->id}/generate-items");
        $response->assertForbidden();

        $response = $this->actingAs($this->adminUser)
            ->post("/admin/payrolls/{$period->id}/generate-items");
        // Allow draft status access - check if the response is appropriate
        $response->assertStatus(302); // Should redirect back after action
    }
}
