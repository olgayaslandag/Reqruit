# 🔍 Reqruit HRMS — Uçtan Uca Sistem Analizi

**Tarih:** 2026-04-04  
**Stack:** Laravel 12 + Inertia.js 2.x + React 18 + SQLite  
**Kapsam:** Backend (Performans + Güvenlik + Mimari), Frontend (UI/UX + Performans), Database (Seeder Analizi)

---

## İÇİNDEKİLER

1. [Backend — Performans](#1-backend--performans)
2. [Backend — Güvenlik](#2-backend--güvenlik)
3. [Backend — Mimari](#3-backend--mimari)
4. [Frontend — UI/UX](#4-frontend--uiux)
5. [Frontend — Performans](#5-frontend--performans)
6. [Frontend — Kod Kalitesi](#6-frontend--kod-kalitesi)
7. [Database — Seeder Analizi](#7-database--seeder-analizi)
8. [Öncelikli Aksiyon Planı](#8-öncelikli-aksiyon-planı)

---

## 1. BACKEND — PERFORMANS

### Kritik

| # | Sorun | Dosya | Satır | Etki |
|---|-------|-------|-------|------|
| P1 | **N+1 sorgu cehennemi — Monthly Report** | `AttendanceReportController.php` | 82-119 | 500 çalışan × 30 gün = 15.000 kayıt belleğe yükleniyor |
| P2 | **N+1 sorgu — Daily Report** | `AttendanceReportController.php` | 45-79 | Tüm çalışanlar + tüm kayıtlar PHP loop'unda işleniyor |
| P3 | **N+1 sorgu — Payroll Tax Summary** | `PayrollReportService.php` | 156-193 | 200 çalışan = 600+ sorgu |
| P4 | **N+1 sorgu — Payroll Compare/Annual** | `PayrollReportService.php` | 88-151 | `whereHas()` Collection üzerinde sorgu tetikliyor |
| P5 | **N+1 sorgu — Payroll Generation** | `PayrollService.php` | 104-122 | Her çalışan için ayrı sorgu |
| P6 | **N+1 sorgu — Advance Deductions** | `AdvanceService.php` | 50-54 | Her advance için deductions sorgusu |

### Yüksek

| # | Sorun | Dosya | Satır |
|---|-------|-------|-------|
| P7 | Departman sorguları her istekte tekrarlanıyor, cache yok | `EmployeeController.php` | 48, 59, 99, 112 |
| P8 | Employee/LeaveType sorguları cache'siz tekrarlanıyor | `LeaveEntitlementController.php` | 28-29, 41-42, 70-71 |
| P9 | `getStatusCounts()` — 3 ayrı COUNT sorgusu yerine GROUP BY kullanılmalı | `AdvanceService.php` | 223-234 |
| P10 | `EmployeeRepository::getTree()` — Tüm tablo belleğe yükleniyor | `EmployeeRepository.php` | 114-150 |
| P11 | `SubmissionRepository::getAll()` — 200K+ kayıt PHP'de transform ediliyor | `SubmissionRepository.php` | 22-116 |
| P12 | Holiday check her clock-in/out'ta sorgu yapıyor, cache yok | `AttendanceService.php` | 88-97 |
| P13 | Vergi parametreleri hardcoded — 2026'da kod değişimi gerekir | `SalaryCalculationService.php` | 22-51 |

### Düzeltme Önerileri

```php
// P1-P2: Database-level aggregation kullan
AttendanceSummary::selectRaw('employee_id, SUM(total_hours) as total_hours, COUNT(*) as days')
    ->whereBetween('date', [$start, $end])
    ->groupBy('employee_id')
    ->get();

// P4: Eager load + in-memory filter
$items->load('salaryComponent');
$totalGross = $items->where('salaryComponent.type', 'earning')->sum('amount');

// P5: Batch load
EmployeeSalary::whereIn('employee_id', $employeeIds)
    ->activeOn($startDate)
    ->with('salaryComponent')
    ->get()
    ->groupBy('employee_id');

// P7: Cache
Cache::remember('departments.list', 3600, fn() => Department::orderBy('title')->get(['id', 'title']));
```

---

## 2. BACKEND — GÜVENLİK

### Kritik

| # | Sorun | Dosya | Satır | Risk |
|---|-------|-------|-------|------|
| S1 | **SubmissionPolicy `before()` tüm auth kullanıcılara TAM yetki veriyor** | `SubmissionPolicy.php` | 17 | Herkes başvuru silebilir, durum değiştirebilir |
| S2 | **UserController'de sıfır yetkilendirme** — Ayrıcalık yükseltme açık | `UserController.php` | 12-99 | Herkes rol değiştirebilir, kullanıcı silebilir |
| S3 | **Clock-in/out herhangi bir `employee_id` kabul ediyor** | `AttendanceController.php` | 119-185 | Herkes başkası için giriş/çıkış yapabilir |
| S4 | **FileController path traversal** — `../../.env` okunabilir | `FileController.php` | 41-94 | Hassas dosya sızıntısı |
| S5 | **Race condition — İzin talepleri transaction içinde değil** | `LeaveRequestController.php` | 47-70 | Çift talep onayı, negatif `remaining_days` |

### Yüksek

| # | Sorun | Dosya | Satır |
|---|-------|-------|-------|
| S6 | Password validation sadece `min:8`, karmaşıklık yok | `UserController.php` | 41-47 |
| S7 | 6 controller'da `authorizeResource` yok (Shift, Calendar, Attendance, Adjustment, AttendanceReport, PayrollReport) | Tüm ilgili controllers | — |
| S8 | TC Kimlik No (`identity_no`) açıkça gösteriliyor | `AttendanceController.php` | 263 |
| S9 | Exception mesajları kullanıcıya doğrudan gösteriliyor | 5+ controller | — |
| S10 | Sadece public form throttle'lu, clock-in/out ve diğer endpoint'ler korumasız | `routes/web.php` | — |

### Orta

| # | Sorun | Detay |
|---|-------|-------|
| S11 | 6 controller'da Form Request yerine inline validation | Advance, Payroll, SalaryComponent |
| S12 | File upload'larda MIME type validation eksik | `EmployeeController.php:166` |
| S13 | Submission/Widget service'lerinde transaction yok | `SubmissionService:37-82`, `WidgetService:92-127` |
| S14 | `declare(strict_types=1)` hiçbir PHP dosyasında yok | Tüm codebase |
| S15 | Leave entitlement update + request status change ayrı işlemler, transaction yok | `LeaveRequestController.php:124-144` |
| S16 | Employee terminate action'ında authorization yok | `EmployeeController.php:240-255` |
| S17 | Adjustment approve/reject'te authorization yok | `AdjustmentController.php:114-185` |

### Düzeltme Önerileri

```php
// S1: SubmissionPolicy — before() metodunu kaldır veya kısıtla
public function before(User $user, string $ability): ?bool
{
    if ($user->hasRole(['admin', 'ik_manager'])) {
        return true;
    }
    return null;
}

// S2: UserController — constructor'a ekle
public function __construct()
{
    $this->authorizeResource(User::class, 'user');
}

// S3: Clock-in/out — yetki kontrolü
$employee = Employee::findOrFail($request->employee_id);
$this->authorize('clock', $employee);

// S4: Path traversal koruması
$realPath = realpath(storage_path('app/' . $path));
$basePath = realpath(storage_path('app'));
if (!str_starts_with($realPath, $basePath)) {
    abort(403, 'Invalid path');
}

// S5: Transaction + lock
DB::transaction(function () use ($employeeId, $leaveTypeId, $requestedDays) {
    $entitlement = LeaveEntitlement::where('employee_id', $employeeId)
        ->where('leave_type_id', $leaveTypeId)
        ->lockForUpdate()
        ->first();
    // ...
});
```

---

## 3. BACKEND — MİMARİ

| # | Sorun | Dosya | Detay |
|---|-------|-------|-------|
| A1 | Business logic controller'da | `LeaveRequestController.php` | `calculateBusinessDays()`, `approveLeaveRequest()` private metodlar |
| A2 | Direct model manipulation — Service layer bypass | 10+ controller | `$model->delete()`, `Model::create()` doğrudan çağrılıyor |
| A3 | Repository pattern eksik | Shift, Calendar, Attendance, Adjustment | Direkt Eloquent model kullanılıyor |
| A4 | Dashboard logic route closure içinde | `routes/web.php` | 48-80 satır iş mantığı |
| A5 | SubmissionRepository'de 200+ satır PHP-side transformation | `SubmissionRepository.php` | 22-234 |
| A6 | Eksik database indexleri | Migrations | `submissions.form_id`, `advance_requests.status`, `leave_entitlements` |
| A7 | 14 model'de `$table` property eksik | Tüm Models | Laravel convention ile çalışıyor ama explicit olması gerekir |

---

## 4. FRONTEND — UI/UX

### Kritik

| # | Sorun | Dosya | Satır | Etki |
|---|-------|-------|-------|------|
| U1 | **Test butonu production'da** — `handleDocumentDelete(123)` hardcoded | `Employees/Show.jsx` | 120-125 | Veri kaybı riski |
| U2 | **Employee Show sayfası placeholder** — Tüm sekmeler boş | `Employees/Show.jsx` | 164-182 | Kırık görünüm |
| U3 | **Bootstrap + Tailwind çakışması** — Yüzlerce Tailwind class çalışmıyor | Tüm Pages | — | Tutarsız görünüm |
| U4 | **Departments/Edit submit butonu form dışında** | `Departments/Edit.jsx` | 138-152 | Kırık form |

### Yüksek

| # | Sorun | Dosya | Satır |
|---|-------|-------|-------|
| U5 | TypeScript yok — Runtime hatalar, null reference'lar | Tüm `.jsx` dosyaları | — |
| U6 | Error Boundary yok — Tek hata tüm app'i çökertiyor | `app.jsx` | — |
| U7 | 9+ sayfada `usePage().props.flash` tekrarı | Tüm index sayfaları | — |
| U8 | `prompt()` kullanımı — Reddetme nedenleri için native prompt | `LeaveRequests.jsx:105`, `Advances/Index.jsx:46` | — |
| U9 | Form'larda loading state yok — Double submit riski | Tüm formlar | — |
| U10 | Axios + Inertia karışık kullanım | `Employees/Show.jsx` | 58-92 |

### Orta

| # | Sorun | Dosya | Detay |
|---|-------|-------|-------|
| U11 | 30+ satır inline style — Theming imkansız | `AuthenticatedLayout.jsx` | 370-418 |
| U12 | `key={index}` React anti-pattern | Dashboard, Reports, Form Builder | — |
| U13 | İkon butonlarda `aria-label` yok | Tüm sayfalar | Erişilebilirlik ihlali |
| U14 | Empty state'ler sadece metin — İlüstrasyon/CTA yok | Tüm index sayfaları | — |
| U15 | Skeleton loading yok | Tüm sayfalar | — |
| U16 | i18n kurulu ama hiçbir yerde kullanılmıyor | `i18n.js`, `locales/` | Dead code |
| U17 | `eventBus.js` ve `PageActionContext` kullanılmıyor | Utils, Context | Dead code |
| U18 | 3 farklı modal implementasyonu | Modal, Bootstrap, inline | Tutarlı değil |

---

## 5. FRONTEND — PERFORMANS

| # | Sorun | Dosya | Satır | Etki |
|---|-------|-------|-------|------|
| FP1 | **Global `preserveScroll: true`** — Her navigasyonda scroll korunuyor | `app.jsx` | 13-15 | Tüm navigasyon UX'i bozuk |
| FP2 | **moment.js** — 300KB+ bundle şişliği | `attendanceHelpers.jsx` | 2 | İlk yükleme yavaş |
| FP3 | Code splitting yok — Tüm sayfalar tek bundle'da | `app.jsx` | — | Büyük initial bundle |
| FP4 | `html5-qrcode` dynamic import yok | `Attendance/Scan.jsx` | 6 | ~200KB gereksiz yükleme |
| FP5 | Inertia `only: []` partial reload kullanılmıyor | Tüm filtreli sayfalar | — | Gereksiz veri transferi |
| FP6 | Inline pagination 3 farklı yerde tekrarlanmış | Payroll, Shifts, Advances | — | Kod tekrarı |

---

## 6. FRONTEND — KOD KALİTESİ

| # | Sorun | Dosya | Detay |
|---|-------|-------|-------|
| CQ1 | `flattenDepartments` 3 dosyada kopyalanmış | `Departments/Index`, `Create`, `Edit` | DRY ihlali |
| CQ2 | Status badge/label fonksiyonları 4 dosyada tekrarlanmış | Payroll, Leave, Advances, Shifts | DRY ihlali |
| CQ3 | `useEffect` flash dependency her ziyarette fire ediyor | 9+ sayfa | Stale toast mesajları |
| CQ4 | Modal ESC kapatmıyor, focus trap yok | `Modal.jsx` | Erişilebilirlik |
| CQ5 | Dropdown dış tıklamayla kapanmıyor | `Dropdown.jsx` | UX sorunu |
| CQ6 | Gereksiz `React` import'ları | 5+ component | Modern JSX transform gereksiz |
| CQ7 | `NavLink` ve `ResponsiveNavLink` identical | İki component | Dead duplicate |
| CQ8 | `Flash` component tanımlı ama kullanılmıyor | `Components/Flash.jsx` | Dead code |

---

## 7. DATABASE — SEEDER ANALİZİ

### Mevcut Seeder Yapısı

```
DatabaseSeeder
├── PermissionSeeder ✅ (permissions)
├── ImportAllDataSeeder ✅ (departments, forms, form_fields, submissions, submission_details, submission_comments)
├── UserSeeder ✅ (users)
├── EmployeeSeeder ✅ (employees + alt tabloları)
├── SubmissionSeeder ✅ (submissions)
├── PayrollSeeder ✅ (salary_components, employee_salaries, payroll_periods, payroll_items, payroll_approvals, salary_adjustments, bonus_payments)
├── AdvanceRequestSeeder ✅ (advance_requests, advance_deductions)
└── PDKS/PDKSSeeder
    ├── ShiftsSeeder ✅ (shifts)
    ├── WorkCalendarsSeeder ✅ (work_calendars)
    ├── HolidaysSeeder ✅ (holidays)
    ├── ShiftSchedulesSeeder ✅ (shift_schedules)
    ├── AttendanceRecordsSeeder ✅ (attendance_records)
    └── AttendanceAdjustmentsSeeder ✅ (attendance_adjustments)
```

### ❌ BOŞ Kalacak Tablolar

| Tablo | Durum | Aksiyon |
|-------|-------|---------|
| **leave_types** | Seeder var ama **ÇAĞRILMIYOR** | `DatabaseSeeder`'a ekle |
| **leave_entitlements** | Seeder **YOK** | Yeni oluştur |
| **leave_requests** | Seeder **YOK** | Yeni oluştur |
| **attendance_summaries** | Muhtemelen AttendanceRecordsSeeder dolduruyor | Kontrol et |
| **submission_comments** | ImportAllDataSeeder'da var ama bağımlı (user_id, submission_id) | FK validasyonu ekle |

### ⚠️ Sorunlar

| # | Sorun | Detay |
|---|-------|-------|
| D1 | `LeaveTypesTableSeeder` tanımlı ama `DatabaseSeeder`'da çağrılmıyor | `leave_types` tablosu boş kalıyor |
| D2 | `leave_entitlements` için seeder yok — İzin sistemi çalışmaz | Çalışanların izin hakkı olmaz |
| D3 | `leave_requests` için seeder yok — İzin talepleri test edilemez | UI boş görünür |
| D4 | Seeder'lar arasında bağımlılık sırası riskli | `submission_comments` → `users` + `submissions` var olmalı |
| D5 | `ImportAllDataSeeder` JSON dosyalarına bağımlı — dosya yoksa sessizce atlıyor | Hata mesajı yetersiz |

### Önerilen Yeni Seeder'lar

```php
// database/seeders/LeaveEntitlementsSeeder.php
// Her aktif çalışana her izin türü için entitlement oluştur
// Örnek: Yıllık izin = 14 gün, Mazeret = 7 gün, vb.

// database/seeders/LeaveRequestsSeeder.php
// Örnek izin talepleri oluştur (pending, approved, rejected)
// Entitlement'lardan remaining_days düş

// DatabaseSeeder.php düzeltmesi:
$this->call([
    PermissionSeeder::class,
    ImportAllDataSeeder::class,
    LeaveTypesTableSeeder::class,     // ← EKLE
    LeaveEntitlementsSeeder::class,   // ← EKLE
    LeaveRequestsSeeder::class,       // ← EKLE
    UserSeeder::class,
    EmployeeSeeder::class,
    SubmissionSeeder::class,
    PayrollSeeder::class,
    AdvanceRequestSeeder::class,
    PDKS\PDKSSeeder::class,
]);
```

---

## 8. ÖNCELİKLİ AKSİYON PLANI

### 🔴 Acil (1-3 gün)

| Öncelik | Aksiyon | Dosya | Süre |
|---------|---------|-------|------|
| 1 | **SubmissionPolicy `before()` kaldır/kısıtla** | `app/Policies/SubmissionPolicy.php` | 15dk |
| 2 | **UserController'e UserPolicy + authorizeResource ekle** | `app/Http/Controllers/UserController.php` | 30dk |
| 3 | **Clock-in/out yetkilendirmesi ekle** | `app/Http/Controllers/AttendanceController.php` | 30dk |
| 4 | **FileController path traversal düzelt** | `app/Http/Controllers/FileController.php` | 30dk |
| 5 | **Leave request race condition → transaction** | `app/Http/Controllers/LeaveRequestController.php` | 30dk |
| 6 | **Global `preserveScroll` interceptor'ı kaldır** | `resources/js/app.jsx` | 5dk |
| 7 | **Test butonunu sil** | `resources/js/Pages/Admin/Employees/Show.jsx` | 5dk |
| 8 | **Departments/Edit submit butonunu forma taşı** | `resources/js/Pages/Admin/Departments/Edit.jsx` | 5dk |

### 🟠 Yüksek Öncelik (1 hafta)

| Öncelik | Aksiyon | Dosya | Süre |
|---------|---------|-------|------|
| 9 | N+1 sorguları düzelt (AttendanceReport, PayrollReport, PayrollService) | 3 dosya | 4 saat |
| 10 | Departman/çalışan listelerini cache'le | `EmployeeController.php` | 30dk |
| 11 | Password validation güçlendir | `UserController.php` | 15dk |
| 12 | 6 controller'a `authorizeResource` ekle | Shift, Calendar, Attendance, Adjustment, vb. | 2 saat |
| 13 | TC Kimlik No maskele | `AttendanceController.php`, `PayrollController.php` | 30dk |
| 14 | Exception mesajlarını gizle, log'la | 5+ controller | 1 saat |
| 15 | Employee Show sayfasını tamamla veya gizle | `Employees/Show.jsx` | 2 saat |
| 16 | Bootstrap/Tailwind kararını uygula | Tüm Pages | 4 saat |
| 17 | Error Boundary ekle | `app.jsx` | 30dk |
| 18 | moment.js → date-fns geçişi | `attendanceHelpers.jsx`, `formatters.jsx` | 2 saat |

### 🟡 Orta Öncelik (2 hafta)

| Öncelik | Aksiyon | Detay |
|---------|---------|-------|
| 19 | Form Request validation ekle | Advance, Payroll, SalaryComponent |
| 20 | Service layer'a taşı | Direct model manipulation yapan controller metodları |
| 21 | Database indexleri ekle | `submissions.form_id`, `advance_requests.status`, `leave_entitlements` |
| 22 | `declare(strict_types=1)` ekle | Tüm PHP dosyaları |
| 23 | Transaction ekle | SubmissionService, WidgetService, EmployeeService |
| 24 | Rate limiting ekle | Clock-in/out, shift assignment endpoint'leri |
| 25 | Vergi parametrelerini config'e taşı | `SalaryCalculationService.php` |
| 26 | Seeder'ları tamamla | LeaveTypes, LeaveEntitlements, LeaveRequests |
| 27 | Loading state ekle | Tüm formlar |
| 28 | `prompt()` → Modal | LeaveRequests, Advances |
| 29 | Inline style'ları CSS class'a taşı | AuthenticatedLayout, tüm Pages |
| 30 | Empty state component'ı oluştur | Reusable `<EmptyState />` |
| 31 | `key={index}` düzelt | Dashboard, Reports, Form Builder |
| 32 | `aria-label` ekle | Tüm ikon butonlar |
| 33 | i18n kullan veya kaldır | `i18n.js`, `locales/` |
| 34 | Dead code temizle | `eventBus.js`, `PageActionContext`, `Flash.jsx` |
| 35 | Code splitting ekle | `app.jsx`, Vite config |
| 36 | `html5-qrcode` dynamic import | `Attendance/Scan.jsx` |
| 37 | Inertia partial reload ekle | Filtreli sayfalar |
| 38 | Status badge utility oluştur | DRY — 4 dosyada tekrarlanan kod |
| 39 | `flattenDepartments` utility'ye taşı | DRY — 3 dosyada tekrarlanan kod |
| 40 | Modal ESC + focus trap | `Modal.jsx` |

---

## ÖZET TABLO

| Kategori | Kritik | Yüksek | Orta | Toplam |
|----------|--------|--------|------|--------|
| **Backend Performans** | 6 | 7 | — | 13 |
| **Backend Güvenlik** | 5 | 5 | 7 | 17 |
| **Backend Mimari** | — | 2 | 5 | 7 |
| **Frontend UI/UX** | 4 | 6 | 8 | 18 |
| **Frontend Performans** | 1 | 2 | 3 | 6 |
| **Frontend Kod Kalitesi** | — | 1 | 7 | 8 |
| **Database Seeder** | — | 1 | 5 | 6 |
| **TOPLAM** | **16** | **24** | **35** | **75** |

---

## METRİKLER

| Metrik | Değer |
|--------|-------|
| Toplam PHP dosyası (app/) | ~200+ |
| Toplam React/JS dosyası | ~80+ |
| Migration sayısı | 40 |
| Model sayısı | 32 |
| Controller sayısı | 23 |
| Policy sayısı | 14 |
| Service sayısı | 16 |
| Repository sayısı | 12 |
| Enum sayısı | 23 |
| Form Request sayısı | 24 |
| Seeder sayısı (mevcut) | 9 (+ 3 PDKS) |
| Seeder sayısı (eksik) | 3 |
| Test dosyası | 15 |
| **Tahmini düzeltme süresi** | **3-4 hafta (1 kişi)** |
