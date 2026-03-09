# Base Repository
- all(), find(), store(), update(), delete() gibi CRUD işlemleri BaseRepository içinde.
- Tüm repository bu sınıftan extend eder.

# Service Layer
- Karmaşık hesaplama ve veri formatlama işlemleri burada.
- Kullanıcı ağacı, belirli raporlar vs.

# Repository
- Interface implement edilir
- TenantScope ve diğer trait’ler kullanılır

# Provider
- Tüm repository-interface binding tek provider içinde
- Yeni repository eklenirse array’e ekle

# Validation
- FormRequest kullan

# Testing
- Feature, API, Validation testleri
