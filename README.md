# IK Başvuru Formu Platformu
### Laravel Fullstack + React (Inertia.js)

> WordPress'ten bağımsız, modern, ölçeklenebilir ve güvenli İnsan Kaynakları Başvuru Yönetim Sistemi.

---

## 📋 İçindekiler
- [Proje Tanımı](#-proje-tanımı)
- [Teknoloji Stack](#-teknoloji-stack)
- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Güvenlik](#-güvenlik)
- [Test](#-test)
- [Klasör Yapısı](#-klasör-yapısı)
- [Widget Kullanımı](#-widget-kullanımı)

---

## 🎯 Proje Tanımı

**IK Başvuru Formu Platformu**, WordPress sitelerine embed edilebilen ancak tamamen **Laravel Fullstack (Inertia.js + React)** mimarisiyle çalışan bağımsız bir iş başvuru yönetim sistemidir.

### Temel Prensipler
- ✅ **Monolithic First:** Frontend ve Backend tek Laravel projesi içinde, Inertia.js ile yönetilir.
- ✅ **WordPress Agnostic:** WP sadece formun gösterildiği bir "container"dır; tüm mantık bu projededir.
- ✅ **Type-Safe:** PHP 8.2+ strict types ve React + TypeScript (opsiyonel) ile güvenli kod.
- ✅ **Performance:** Vite + cache mekanizması, optimize edilmiş asset pipeline.
- ✅ **Security:** Laravel'in yerleşik güvenlik katmanları + Spatie Permission + Policy.

---

## 🛠 Teknoloji Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Backend Framework** | Laravel | 12.x |
| **Frontend Rendering** | Inertia.js | 2.x |
| **Frontend Library** | React | 18.x |
| **Build Tool** | Vite | 7.x |
| **Stil** | Tailwind CSS | 4.x |
| **Auth & Permission** | Laravel Sanctum + Spatie Permission | - |
| **Database** | MySQL / PostgreSQL / SQLite | - |
| **Testing** | PHPUnit | 11.x |

---

## ✨ Özellikler

### 📝 Form Yönetimi
- [x] Departman bazlı dinamik form oluşturma
- [x] Sürükle-bırak form builder
- [x] 10+ alan tipi: `text`, `email`, `textarea`, `select`, `radio`, `checkbox`, `file`, `date`, `tel`, `number`
- [x] Gerçek zamanlı frontend validasyon
- [x] Backend validasyon (FormRequest)

### 📥 Başvuru Yönetimi
- [x] Otomatik başvuru kaydı ve benzersiz referans numarası
- [x] Departman bazlı filtreleme ve gruplama
- [x] Statü yönetimi: `new` → `reviewing` → `interview` → `offer` → `hired` / `rejected`
- [x] Etiketleme sistemi

### ⭐ Değerlendirme Sistemi
- [x] 1-5 yıldız puanlama
- [x] Yönetici yorumları
- [x] Gizli notlar

### 📎 Dosya Yönetimi
- [x] Çoklu dosya yükleme (CV, ön yazı, portfolyo)
- [x] Dosya tipi kısıtlama
- [x] Güvenli depolama (local disk + signed URL)
- [x] Maksimum boyut kontrolü (10MB)

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
```

---

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
composer install
npm install

# 2. Ortam dosyasını oluştur
cp .env.example .env
php artisan key:generate

# 3. Veritabanını ayarla (.env dosyasında)
# DB_CONNECTION=mysql
# DB_DATABASE=reqruit

# 4. Migration ve seed
php artisan migrate --seed

# 5. Frontend derle
npm run build

# 6. Sunucuyu başlat
php artisan serve
```

### Varsayılan Kullanıcı
```
Email: olgayaslandag@gmail.com
Password: 123123123
Role: super_admin
```

---

## 🔐 Güvenlik

### Dosya Yükleme
- Dosyalar `local` diskine kaydedilir (public erişime kapalı)
- Signed URL ile güvenli dosya erişimi
- Dosya tipi ve boyut validasyonu

### Yetkilendirme
- Spatie Permission ile RBAC
- Policy sınıfları ile kaynak bazlı yetkilendirme
- Rate limiting (public form submit: 5/60dk)

### Validasyon
- FormRequest sınıfları ile merkezi validasyon
- Frontend validasyon (Inertia)

---

## 🧪 Test

```bash
# Tüm testleri çalıştır
php artisan test

# Specific test
php artisan test --filter FormTest
```

### Test Coverage
- ✅ Authentication tests
- ✅ Form CRUD tests
- ✅ Submission tests
- ✅ Department tests
- ✅ Authorization tests

---

## 📁 Klasör Yapısı

```
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Request handlers
│   │   ├── Middleware/      # HTTP middleware
│   │   └── Requests/        # FormRequest validation
│   ├── Jobs/                # Queue jobs
│   ├── Models/              # Eloquent models
│   ├── Policies/            # Authorization policies
│   ├── Repositories/        # Data access layer
│   │   └── BaseRepository.php
│   └── Services/            # Business logic
├── database/
│   ├── factories/           # Model factories
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── lang/
│   ├── tr/                  # Turkish translations
│   └── en/                  # English translations
├── resources/
│   └── js/
│       ├── Components/      # React components
│       ├── Layouts/         # Page layouts
│       ├── Pages/           # Inertia pages
│       ├── locales/         # i18n JSON files
│       └── i18n.js          # i18n configuration
├── routes/
│   ├── web.php              # Web routes
│   └── auth.php             # Auth routes
└── tests/
    └── Feature/             # Feature tests
```

---

## 📝 Geliştirme Notları

### Repository Pattern
- `BaseRepository` abstract sınıfından extend edilir
- Interface'ler `App\Interfaces` dizininde
- Binding `AppRepoProvider` içinde

### Service Layer
- Business logic Service sınıflarında
- Controller sadece request/response yönetir

### Queue Jobs
- Email gönderimi async olarak queue'da
- `SendSubmissionNotification` job

### Cache
- Dashboard stats 5 dakika cache'lenir
- Cache key: `dashboard.stats`, `dashboard.weekly_submissions`

---

## 🌐 Widget Kullanımı

Widget, herhangi bir web sitesine eklenebilen bağımsız bir JavaScript bileşenidir. Kullanıcılar hiyerarşik departman yapısında gezinerek başvuru yapabilir.

### Kurulum

Widget'ı sitenize eklemek için aşağıdaki kodu kullanın:

```html
<div id="reqruit-widget"></div>
<script src="https://your-domain.com/widget/reqruit.js"></script>
<script>
  ReqruitWidget.init({
    container: '#reqruit-widget',
    baseUrl: 'https://your-domain.com'
  });
</script>
```

### Tema Özelleştirme

Widget görünümünü özelleştirebilirsiniz:

```javascript
ReqruitWidget.init({
  container: '#reqruit-widget',
  baseUrl: 'https://your-domain.com',
  theme: {
    primaryColor: '#4f46e5',      // Ana renk
    primaryHover: '#4338ca',      // Hover rengi
    borderRadius: '8px',          // Köşe yuvarlaklığı
    fontFamily: 'system-ui, sans-serif',
    bgColor: '#f9fafb',           // Arka plan
    cardBg: '#ffffff',            // Kart arka planı
    textColor: '#111827',         // Metin rengi
    borderColor: '#e5e7eb',       // Kenar rengi
    errorColor: '#dc2626',
    successColor: '#16a34a'
  }
});
```

### Widget Akışı

```
1. Root departmanları gösterilir (parent_id = null)
2. Kullanıcı departman kartını seçer
3. Seçilen departmanın alt departmanları varsa → göster
4. Alt departman yoksa → departmanın formunu göster
5. Form doldurulur → submit → başarı mesajı + referans no
```

### API Endpoints

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/widget/departments` | GET | Root departmanları listeler |
| `/api/widget/departments/{id}` | GET | Departman detayı + children + form |
| `/api/widget/forms/{slug}` | GET | Form yapısı (fields) |
| `/api/widget/forms/{slug}/submit` | POST | Form gönderimi |

### Test

Widget'ı test etmek için:

```
https://your-domain.com/widget/test.html
```

### Dosya Yapısı

```
public/widget/
├── reqruit.js        # Ana widget dosyası
└── test.html         # Test sayfası

app/Http/Controllers/Api/
├── WidgetController.php      # Departman API
└── WidgetFormController.php  # Form API

app/Services/
└── WidgetService.php         # Widget business logic

app/Http/Resources/
├── DepartmentResource.php    # Departman JSON transform
├── FormResource.php          # Form JSON transform
└── FormFieldResource.php     # Form alanı JSON transform
```

---

## 📄 Lisans

MIT License