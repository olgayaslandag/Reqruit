# IK Başvuru Formu Platformu
### Laravel Fullstack + React (Inertia.js)

> WordPress'ten bağımsız, modern, ölçeklenebilir ve güvenli İnsan Kaynakları Başvuru Yönetim Sistemi.

---

## 📋 İçindekiler
- [Proje Tanımı](#-proje-tanımı)
- [Teknoloji Stack](#-teknoloji-stack)
- [Özellikler](#-özellikler)
- [Mimari Akış](#-mimari-akış)
- [Veritabanı Şeması](#-veritabanı-şeması)
- [WordPress Entegrasyonu](#-wordpress-entegrasyonu)
- [Kurulum](#-kurulum)
- [Klasör Yapısı](#-klasör-yapısı)
- [Güvenlik](#-güvenlik)
- [Komutlar](#-komutlar)

---

## 🎯 Proje Tanımı

**IK Başvuru Formu Platformu**, WordPress sitelerine embed edilebilen ancak tamamen **Laravel Fullstack (Inertia.js + React)** mimarisiyle çalışan bağımsız bir iş başvuru yönetim sistemidir.

### Temel Prensipler
- ✅ **Monolithic First:** Frontend ve Backend tek Laravel projesi içinde, Inertia.js ile yönetilir.
- ✅ **WordPress Agnostic:** WP sadece formun gösterildiği bir "container"dır; tüm mantık bu projededir.
- ✅ **Type-Safe:** PHP 8.2+ strict types ve React + TypeScript (opsiyonel) ile güvenli kod.
- ✅ **Performance:** Vite + SSR desteği, optimize edilmiş asset pipeline.
- ✅ **Security:** Laravel'in yerleşin güvenlik katmanları + ek validasyon katmanları.

### Hedef Kitle
- İK departmanları
- İşe alım süreçlerini dijitalleştirmek isteyen firmalar
- WordPress kullanan ancak form yönetimini profesyonelleştirmek isteyen geliştiriciler

---

## 🛠 Teknoloji Stack

| Katman | Teknoloji | Versiyon | Açıklama |
|--------|-----------|----------|----------|
| **Backend Framework** | Laravel | 11.x | PHP MVC Framework |
| **Frontend Rendering** | Inertia.js | 1.x | Laravel ↔ React köprüsü |
| **Frontend Library** | React | 18.x | UI bileşen kütüphanesi |
| **Build Tool** | Vite | 5.x | Asset derleme ve HMR |
| **Stil** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Components** | shadcn/ui | - | Akseslibl React bileşenler |
| **Form Yönetimi** | react-hook-form + zod | - | Form state ve validasyon |
| **Database** | MySQL / PostgreSQL | 8+ / 15+ | İlişkisel veritabanı |
| **Cache** | Redis | 7.x | Session ve cache yönetimi |
| **Queue** | Laravel Horizon | - | Async job yönetimi |
| **Auth & Permission** | Laravel Sanctum + Spatie | - | API auth ve RBAC |
| **File Storage** | Laravel Storage (S3/Local) | - | Güvenli dosya yönetimi |
| **Testing** | Pest PHP + React Testing Library | - | Unit ve Feature testleri |
| **Deployment** | Docker / Laravel Forge | - | Production ortamı |

---

## ✨ Özellikler

### 📝 Form Yönetimi
- [x] Departman bazlı dinamik form oluşturma
- [x] Sürükle-bırak form builder (React DnD)
- [x] 15+ alan tipi: `text`, `email`, `textarea`, `select`, `radio`, `checkbox`, `file`, `date`, `phone`, `url`, `number`, `range`, `color`, `hidden`, `custom`
- [x] Conditional logic: Alanlar arası bağımlılık kuralları
- [x] Çoklu dil desteği (i18n) için form etiketleri
- [x] Form şablonları: Kopyala/özelleştir/yayınla
- [x] Gerçek zamanlı frontend validasyon (zod schema)
- [x] Backend validasyon (Laravel FormRequest)

### 📥 Başvuru Yönetimi
- [x] Otomatik başvuru kaydı ve benzersiz referans numarası
- [x] Departman bazlı filtreleme ve gruplama
- [x] Gelişmiş arama: isim, email, telefon, anahtar kelime
- [x] Statü yönetimi: `new` → `reviewing` → `interview` → `offer` → `hired` / `rejected`
- [x] Etiketleme sistemi: `urgent`, `referral`, `junior`, `remote` vb.
- [x] Toplu işlem: Seçili başvuruları toplu statü güncelleme
- [x] CSV/Excel export (Laravel Excel)
- [x] Başvuru zaman çizelgesi ve aktivite geçmişi

### ⭐ Değerlendirme Sistemi
- [x] 1-5 yıldız puanlama (React rating komponenti)
- [x] Yönetici yorumları (rich text editor)
- [x] Çoklu değerlendirici: Ortalama puan hesaplama
- [x] Değerlendirme kriterleri: Teknik, İletişim, Kültür Uyumu vb.
- [x] Gizli notlar: Sadece İK yöneticileri görebilir
- [x] Revizyon talebi: Adaydan ek belge isteme akışı
- [x] Değerlendirme şablonları: Departmana özel kriter setleri

### 📎 Dosya Yönetimi
- [x] Çoklu dosya yükleme (CV, ön yazı, portfolyo, sertifika)
- [x] Dosya tipi kısıtlama: `pdf`, `doc`, `docx`, `png`, `jpg`
- [x] Maksimum boyut kontrolü (örn: 10MB)
- [x] Virus tarama entegrasyonu (ClamAV opsiyonel)
- [x] Güvenli depolama: `storage/app/private` + signed URL
- [x] Önizleme: PDF ve görseller için inline preview
- [x] Otomatik isimlendirme: `{date}_{candidate}_{original}`

### 👥 Kullanıcı ve Yetki Yönetimi
```php
// Roller (Spatie Permission)
'roles' => [
    'super_admin',    // Tüm sisteme erişim
    'ik_manager',     // Tüm departmanları görür, onay verir
    'recruiter',      // Atandığı departmanlarda işlem yapar
    'department_head',// Sadece kendi departmanının başvuruları
    'observer',       // Sadece okuma yetkisi
];

// İzinler (Policies)
'permissions' => [
    'view-applications',
    'create-applications', 
    'update-applications',
    'delete-applications',
    'review-applications',
    'manage-forms',
    'export-data',
    'manage-users',
];