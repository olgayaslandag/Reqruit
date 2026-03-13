# Modül Oluşturma İş Akışı

## 1. Gereksinim Analizi
- Modülün işlevselliği belirlenir
- Gerekli entity'ler tanımlanır
- Entity arasındaki ilişkiler belirlenir
- Kullanıcı rolleri ve izinleri tanımlanır

## 2. Database Tasarımı
- Migration dosyaları oluşturulur
- Gerekli foreign key tanımlamaları yapılır
- Index ve constraint'ler tanımlanır
- Seeder (test verisi) hazırlanabilir

## 3. Katmanlı Mimari Oluşumu (Domain Bazlı)

### A. Model Katmanı
- Klasör: `app/Models/{Domain}/`
- Dosya: `app/Models/Survey/SurveyModel.php`
- İçerik: İlişkiler, Accessor, Scope

### B. Repository Katmanı
- Klasör: `app/Repositories/{Domain}/`
- Interface: `app/Repositories/Survey/ISurveyRepository.php`
- Class: `app/Repositories/Survey/SurveyRepository.php`

### C. Service Katmanı
- Klasör: `app/Services/{Domain}/`
- Dosya: `app/Services/Survey/SurveyService.php`
- İçerik: Business Logic, Transaction

### D. Controller Katmanı
- Klasör: `app/Http/Controllers/{Domain}/`
- Dosya: `app/Http/Controllers/Survey/SurveyController.php`
- Not: API ise `Api/Survey/` altında olabilir.

## 4. Form/doğrulama Tanımları
- Form Request sınıfları oluşturulur
- Validation kuralları yazılır
- Sanitization işlemleri tanımlanır

## 5. Route ve Middleware Tanımları
- routes/web.php veya routes/api.php dosyaları güncellenir
- Yetkilendirme kuralları belirlenir
- Rate limiting ihtiyaç duyulan endpointlere eklenir

## 6. Frontend Entegrasyonu
- Inertia veya API ile frontend'e bağlantı
- React component'lerin hazırlığı
- Form handler ve validation hatalarının yönetimi

## 7. Test Oluşturma
- Unit test (Service/Repository katmanları)
- Feature test (Controller katmanı)
- Integration test (Tam akış)

## 8. Güvenlik Tetkikası
- SQL Injection kontrolleri
- XSS ve CSRF kontrolleri
- Authentication/Authorization kontrolleri
- Input validation kontrolleri

## 9. Deployment Hazırlığı
- Environment değişkenleri kontrolü
- Cache ve config dosyalarının publish edilmesi
- Queue worker tanımlamaları (varsa)
- Database seed (geliştirme ortamı için)
