# Kod İnceleme (Code Review) Süreci

## 1. Başlangıç Kontrolü
- Pull request açıklandığı forma uygun olmalı
- Değişikliklerin işlevsel tanımı belirtilmeli
- Test kapsamı belirtilmeli (unit/integration/e2e)

## 2. Mimari Uygunluk Kontrolü
- Controller → Service → Repository akışı korunmuş mu?
- Interface kullanımı doğru mu?
- Sınıf ve dosya isimleri kurallarına uygun mu? (PollModel, SurveyService vs.)
- Bağımlılık inversiyonu (DI) doğru uygulanmış mı?

## 3. Security Audit
- XSS, SQL injection, CSRF gibi genel açıklar var mı?
- Auth kontrolü gerekli yerlerde yapılmış mı?
- Secret bilgiler hardcode bırakılmış mı?
- Input validation ve sanitization doğru yapılmış mı?

## 4. Performance Assessment
- N+1 sorgu problemi var mı?
- Index eksikliği olabilir mi?
- Gereksiz veri yüklemeleri var mı?
- Cache stratejisi uygun mu?

## 5. Code Quality
- DRY (Don't Repeat Yourself) ilkesi korunmuş mu?
- SOLID prensiplerine uygunluk?
- Method/class uzunlukları makul mu?
- Naming convention kurallarına uyulmuş mu?

## 6. Test Coverage
- Critical path'ler test edilmiş mi?
- Edge case'ler kapsanmış mı?
- Negative scenario'lar test edilmiş mi?
- Mevcut testler hala geçerli ve mantıklı mı?

## 7. Documentation Requirements
- Public method'lar için PHPDoc yeterli mi?
- Complex business logic açıklanmış mı?
- Configuration değişiklikleri varsa dokumente edilmiş mi?

## 8. Git ve Workflow Best Practices
- Atomic commit mesajları uygun mu?
- PR başlığı ve açıklaması anlaşılır mı?
- Gerekli etiketler ve assignee'ler atanmış mı?

## 9. Review Süreci
- En az 1 kişi tarafından onaylanmalı (2 kişilik projelerde)
- Approve'den önce başka bir developer tarafından test edilmeli
- Conflict varsa merge öncesi çözülmeli
- Automated testlerin tümü passing olmalı

## 10. Post-Approval Kontrolü
- CI pipeline testleri başarılı mı?
- Code quality tool sonuçları kontrol edilmeli
- Security scan sonuçları incelenmeli
- Pre-deploy checklist kontrol edilmeli