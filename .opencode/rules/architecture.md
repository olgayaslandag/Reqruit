# Katmanlı Mimari Kuralları

## Genel Yapı
```
Controller → Service → Repository → Model
```

Her katmanın belli sorumlulukları vardır, bu sınırlar hiçbir zaman çiğnenmez.

## Katman Sorumlulukları

### 1. Controller Katmanı
- HTTP isteklerini kabul eder
- Form doğrulamaları yapar (Request sınıfları aracılığıyla)
- Service katmanını çağırır
- HTTP yanıtları döner  
- 🔴 Asla business logic barındırmaz
- 🔴 Asla doğrudan repository çağırısı yapmaz

### 2. Service Katmanı
- Tüm business logic burada gerçekleşir
- Authorization kontrolleri yapılır
- Transaction management bu katmanda yürütülür
- Repository katmanını çağırır
- External servis entegrasyonları bu katmana yapılır
- 🔴 Asla HTTP ile ilgili işlem yapmaz

### 3. Repository Katmanı
- CRUD operasyonları bu katmanda gerçekleştirilir
- Query builder veya raw query'ler bu katman içinde yönetilir
- Model ile doğrudan etkileşime geçer
- 🔴 Business logic içermez
- 🔴 HTTP ile ilgili işlem yapmaz

### 4. Model Katmanı
- Aktif kayıt (Active Record) pattern kullanır
- Database ile doğrudan erişim sağlar
- Relationships, attributes, scopes bu katmanda tanımlanır

## Interface Yönetimi
```
// IRepository.php
interface ISurveyRepository {
    public function findById(int $id);
    public function save(SurveyModel $survey);
}

// SurveyRepository.php  
class SurveyRepository implements ISurveyRepository {
    // implementasyon
}
```

Repositoryler mutlaka interface'lerden türemelidir.

## Dependency Injection
- Controller, Service interface'ini injection alır
- Service, Repository interface'ini injection alır
- Hiçbir zaman somut sınıflar (concrete class) injection alınmaz

## DI Container Ayarları
Service provider'da interface ile concrete class eşlemesi yapılmalıdır:
```php
$this->app->bind(ISurveyRepository::class, SurveyRepository::class);
```

## Yanlış Kullanımlar
```php
// ✅ YANLIŞ - Controller doğrudan repository çağırıyor
public function index() {
    $surveys = app(SurveyRepository::class)->all();
}

// ✅ DOĞRU - Controller service'i çağırıyor
public function index() {
    $surveys = $this->surveyService->getAllSurveys();
}
```

## Middleware Entegrasyonu
Yetkilendirme, logging, validation gibi işlevler middleware'ler aracılığıyla yapılır, service katmanında değil.