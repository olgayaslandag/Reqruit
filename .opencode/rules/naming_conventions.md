# İsimlendirme Kuralları

## Genel Kurallar
- Tüm sınıf isimleri `UpperCamelCase` formatındadır
- Değişken ve fonksiyon isimleri `lowerCamelCase` formatındadır
- Dosya isimleri Class ismiyle birebir aynı olmalıdır
- Namespace, fiziksel klasör yapısıyla uyumlu olmalıdır

## Model İsimlendirme
✅ DOĞRU:
- `SurveyModel`
- `QuestionModel`
- `OptionModel`
- `SurveyResponseModel`
- `AnswerModel`
- `VerificationSessionModel`

❌ YANLIŞ:
- `Survey`
- `Poll` (jenerik kelime)
- `Question`
- `Survey_response`

## Repository İsimlendirme
✅ DOĞRU:
- `SurveyRepository`
- `QuestionRepository`
- `IEntityRepository` interface

📌 Her zaman `Repository` suffix'ini kullan

## Service İsimlendirme
✅ DOĞRU:
- `SurveyService`
- `QuestionService`
- `UserService`

📌 Her zaman `Service` suffix'ini kullan

## Controller İsimlendirme
✅ DOĞRU:
- `SurveyController`
- `UserController`
- `AdminController`

## Interface İsimlendirme
✅ DOĞRU:
- `ISurveyRepository`
- `IQuestionService`

📌 Interface'ler `I` prefix'iyle başlar

## Diğer Kurallar
- Trait isimleri `Trait` suffix ile biter
- Exception sınıfları `Exception` suffix ile biter
- Helper fonksiyonlar `_` ile başlamaz
- Konfigürasyon dosyalarında sadece küçük harf ve `-` kullanılır (`cors.php`)