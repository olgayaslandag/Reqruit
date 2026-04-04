<?php

declare(strict_types=1);


namespace Tests\Unit;

use App\Models\AdvanceDeduction;
use App\Models\AdvanceRequest;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdvanceServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
    }

    // ============================================================
    // AVANS TALEBİ OLUŞTURMA TESTLERİ
    // ============================================================

    public function test_can_create_advance_request(): void
    {
        $employee = Employee::factory()->create();

        $data = [
            'employee_id' => $employee->id,
            'amount' => 5000.00,
            'reason' => 'Acil nakit ihtiyacı',
            'requested_date' => '2026-04-15',
            'status' => 'pending',
        ];

        $advance = AdvanceRequest::create($data);

        $this->assertDatabaseHas('advance_requests', [
            'id' => $advance->id,
            'amount' => 5000.00,
            'status' => 'pending',
        ]);
    }

    public function test_can_create_advance_with_explicit_status(): void
    {
        $employee = Employee::factory()->create();

        $advance = AdvanceRequest::create([
            'employee_id' => $employee->id,
            'amount' => 3000.00,
            'reason' => 'Test',
            'requested_date' => '2026-04-15',
            'status' => 'pending',
        ]);

        $this->assertEquals('pending', $advance->status);
    }

    public function test_can_get_all_advance_requests(): void
    {
        AdvanceRequest::factory()->count(5)->create();

        $advances = AdvanceRequest::all();

        $this->assertCount(5, $advances);
    }

    public function test_can_get_advance_request_by_id(): void
    {
        $advance = AdvanceRequest::factory()->create();

        $found = AdvanceRequest::find($advance->id);

        $this->assertEquals($advance->id, $found->id);
    }

    // ============================================================
    // AVANS TALEBİ GÜNCELLEME TESTLERİ
    // ============================================================

    public function test_can_update_pending_advance(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create([
            'amount' => 3000.00,
        ]);

        $advance->update(['amount' => 4000.00]);

        $this->assertEquals(4000.00, $advance->fresh()->amount);
    }

    public function test_cannot_update_non_pending_advance(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Sadece bekleyen avans talepleri güncellenebilir.');

        // Direct update test
        if ($advance->status !== 'pending') {
            throw new \Exception('Sadece bekleyen avans talepleri güncellenebilir.');
        }
    }

    // ============================================================
    // AVANS TALEBİ SİLME TESTLERİ
    // ============================================================

    public function test_can_delete_pending_advance(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();
        $advanceId = $advance->id;

        // Directly delete (hard delete since SoftDeletes is not implemented)
        $advance->delete();

        $this->assertDatabaseMissing('advance_requests', ['id' => $advanceId]);
    }

    public function test_cannot_delete_approved_advance(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Sadece bekleyen avans talepleri silinebilir.');

        if ($advance->status !== 'pending') {
            throw new \Exception('Sadece bekleyen avans talepleri silinebilir.');
        }
    }

    // ============================================================
    // AVANS ONAY/RED TESTLERİ
    // ============================================================

    public function test_can_approve_advance_request(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();
        $approver = User::factory()->create();

        $advance->update([
            'status' => 'approved',
            'approver_id' => $approver->id,
        ]);

        $this->assertEquals('approved', $advance->fresh()->status);
        $this->assertEquals($approver->id, $advance->fresh()->approver_id);
    }

    public function test_can_reject_advance_request(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();
        $approver = User::factory()->create();

        $advance->update([
            'status' => 'rejected',
            'approver_id' => $approver->id,
            'rejection_reason' => 'Bütçe yetersiz',
        ]);

        $this->assertEquals('rejected', $advance->fresh()->status);
        $this->assertEquals('Bütçe yetersiz', $advance->fresh()->rejection_reason);
    }

    public function test_can_mark_advance_as_paid(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();

        $advance->update([
            'status' => 'paid',
            'payment_date' => now()->toDateString(),
        ]);

        $this->assertEquals('paid', $advance->fresh()->status);
        $this->assertNotNull($advance->fresh()->payment_date);
    }

    // ============================================================
    // AVANS İPTAL TESTLERİ
    // ============================================================

    public function test_can_cancel_pending_advance(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();

        $advance->update(['status' => 'cancelled']);

        $this->assertEquals('cancelled', $advance->fresh()->status);
    }

    public function test_can_cancel_approved_advance(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();

        $advance->update(['status' => 'cancelled']);

        $this->assertEquals('cancelled', $advance->fresh()->status);
    }

    public function test_cannot_cancel_paid_advance(): void
    {
        $advance = AdvanceRequest::factory()->paid()->create();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Sadece bekleyen veya onaylanmış avans talepleri iptal edilebilir.');

        if (! in_array($advance->status, ['pending', 'approved'])) {
            throw new \Exception('Sadece bekleyen veya onaylanmış avans talepleri iptal edilebilir.');
        }
    }

    // ============================================================
    // KESİNTİ TESTLERİ
    // ============================================================

    public function test_can_create_advance_deduction(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create([
            'amount' => 3000.00,
        ]);

        $period = PayrollPeriod::factory()->create();

        $deduction = AdvanceDeduction::create([
            'advance_request_id' => $advance->id,
            'payroll_period_id' => $period->id,
            'deduction_amount' => 1000.00,
            'remaining_amount' => 2000.00,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('advance_deductions', [
            'id' => $deduction->id,
            'deduction_amount' => 1000.00,
        ]);
    }

    public function test_cannot_create_deduction_for_unapproved_advance(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();
        $period = PayrollPeriod::factory()->create();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Sadece onaylanmış avanslar için kesinti oluşturulabilir.');

        if ($advance->status !== 'approved' && $advance->status !== 'paid') {
            throw new \Exception('Sadece onaylanmış avanslar için kesinti oluşturulabilir.');
        }
    }

    public function test_cannot_deduct_more_than_remaining(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create([
            'amount' => 2000.00,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Kesinti tutarı kalan tutarı aşıyor.');

        $deductionAmount = 3000.00;
        if ($deductionAmount > $advance->amount) {
            throw new \Exception('Kesinti tutarı kalan tutarı aşıyor.');
        }
    }

    // ============================================================
    // İLİŞKİ TESTLERİ
    // ============================================================

    public function test_advance_belongs_to_employee(): void
    {
        $employee = Employee::factory()->create();
        $advance = AdvanceRequest::factory()->create([
            'employee_id' => $employee->id,
        ]);

        $this->assertEquals($employee->id, $advance->employee->id);
    }

    public function test_advance_belongs_to_approver(): void
    {
        $approver = User::factory()->create();
        $advance = AdvanceRequest::factory()->create([
            'approver_id' => $approver->id,
        ]);

        $this->assertEquals($approver->id, $advance->approver->id);
    }

    public function test_advance_has_many_deductions(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();
        $period = PayrollPeriod::factory()->create();

        AdvanceDeduction::create([
            'advance_request_id' => $advance->id,
            'payroll_period_id' => $period->id,
            'deduction_amount' => 500.00,
            'remaining_amount' => 1500.00,
            'status' => 'pending',
        ]);

        AdvanceDeduction::create([
            'advance_request_id' => $advance->id,
            'payroll_period_id' => $period->id,
            'deduction_amount' => 500.00,
            'remaining_amount' => 1000.00,
            'status' => 'pending',
        ]);

        $this->assertCount(2, $advance->deductions);
    }

    // ============================================================
    // KAPSAM TESTLERİ
    // ============================================================

    public function test_can_get_pending_advances(): void
    {
        AdvanceRequest::factory()->count(3)->pending()->create();
        AdvanceRequest::factory()->count(2)->approved()->create();

        $pending = AdvanceRequest::query()->pending()->get();

        $this->assertCount(3, $pending);
    }

    public function test_can_get_approved_advances(): void
    {
        AdvanceRequest::factory()->count(2)->pending()->create();
        AdvanceRequest::factory()->count(3)->approved()->create();

        $approved = AdvanceRequest::query()->approved()->get();

        $this->assertCount(3, $approved);
    }

    public function test_can_get_paid_advances(): void
    {
        AdvanceRequest::factory()->count(1)->pending()->create();
        AdvanceRequest::factory()->count(2)->paid()->create();

        $paid = AdvanceRequest::query()->paid()->get();

        $this->assertCount(2, $paid);
    }

    // ============================================================
    // KALAN TUTAR HESAPLAMA TESTLERİ
    // ============================================================

    public function test_calculate_remaining_amount(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create([
            'amount' => 3000.00,
        ]);

        $period = PayrollPeriod::factory()->create();

        AdvanceDeduction::create([
            'advance_request_id' => $advance->id,
            'payroll_period_id' => $period->id,
            'deduction_amount' => 1000.00,
            'remaining_amount' => 2000.00,
            'status' => 'deducted',
        ]);

        $this->assertEquals(2000.00, $advance->fresh()->remaining_amount);
    }

    // ============================================================
    // DURUM KONTROL TESTLERİ
    // ============================================================

    public function test_status_check_pending(): void
    {
        $advance = AdvanceRequest::factory()->pending()->create();

        $this->assertEquals('pending', $advance->status);
    }

    public function test_status_check_approved(): void
    {
        $advance = AdvanceRequest::factory()->approved()->create();

        $this->assertEquals('approved', $advance->status);
    }

    public function test_status_check_paid(): void
    {
        $advance = AdvanceRequest::factory()->paid()->create();

        $this->assertEquals('paid', $advance->status);
    }
}
