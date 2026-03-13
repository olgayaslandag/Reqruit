# Güvenlik Kuralları

## Genel Prensipler
- Varsayılan olarak "her şey yasak" yaklaşımıyla hareket et
- Güvenlik açıklarını önlemek için "defense in depth" stratejisi uygula
- En az ayrıcalık ilkesini (least privilege) benimse

## Web Güvenliği (OWASP Top 10)

### 1. SQL Injection Prevention
```
// ✅ DOĞRU
User::where('email', $request->email)->first();
DB::table('users')->where('status', '=', $status);

// ❌ YANLIŞ  
DB::select("SELECT * FROM users WHERE email = '{$request->email}'");
```
- Raw query yazarken parametre bind edilmesi zorunludur
- Input doğrulaması yapıldıktan sonra kullanıma açılır

### 2. Cross-Site Scripting (XSS) Prevention
```
// ✅ DOĞRU - Blade template escaping
{{ $user->name }} // otomatik escape eder

// ✅ DOĞRU - Explicit escaping
{{ e($user->bio) }}

// ❌ YANLIŞ
{!! $user->input !!}
```
- Raw HTML output gerekiyorsa HTML Purifier gibi kütüphane kullan
- CKEditor gibi WYSIWYG editörlerde içerik filtreleme zorunludur

### 3. Cross-Site Request Forgery (CSRF) Prevention
- Tüm state-changing isteklerde mutlaka CSRF token kontrolü yapılmalı
- Laravel otomatik olarak `VerifyCsrfToken` middleware ile kontrol eder
- AJAX isteklerinde header'a token eklenmelidir

### 4. Authentication & Session Security
```
// ✅ DOĞRU 
Auth::guard('web')->attempt($credentials);

// Güvenli session ayarları
SESSION_DRIVER=database
SESSION_LIFETIME=60
SESSION_SECURE_COOKIE=true (HTTPS için)
SESSION_SAMESITE=lax
```
- Session fixation saldırılarına karşı koruma alınmalı
- Çok faktörlü kimlik doğrulama (MFA) önerilir

### 5. Authorization & Access Control
- RBAC (Role-Based Access Control) veya ABAC (Attribute-Based Access Control) uygulanmalı
- Route başına izin kontrolleri yapılmalı
```
// ✅ DOĞRU
Gate::define('update-post', function ($user, $post) {
    return $user->id === $post->user_id;
});
```

### 6. Input Validation & Sanitization
```
// ✅ DOĞRU - Form Request ile
class StorePostRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => 'required|email|max:255',
            'phone' => 'required|regex:/^[\+][\d]{11,13}$/',
        ];
    }
}
```
- Validasyon kuralları strict şekilde tanımlanmalı
- Upload edilecek dosyalarda MIME type ve dosya uzantısı kontrolleri yapılmalı

## Cryptographic Controls

### 7. Password Handling
```
// ✅ DOĞRU
$hashedPassword = Hash::make($password);

// ❌ YANLIŞ
$passwordHash = md5($plainTextPassword);
```
- Parolalar bcrypt veya argon2 ile hashlenmeli
- Password complexity kuralları uygulanmalı

### 8. Data Encryption at Rest
```
// ✅ DOĞRU - Config'de encryption key
'cipher' => 'AES-256-CBC',

// Sensitive field encryption
return encrypt($socialSecureNumber);
return decrypt($encryptedValue);
```

### 9. API Security
- API isteklerinde mutlaka authentication (JWT veya API Token) kullanılmalı
- Rate limiting tüm API endpointlerine konmalı
- CORS politikası严格的 olarak tanımlanmalı

## Configuration Security

### 10. Secret Management
```
// ✅ DOĞRU - .env dosyasında tutulur
MAIL_PASSWORD=env('MAIL_PASSWORD');

// ❌ YANLIŞ - Kod içinde hardcoded
$mailPassword = 'mySecretPassword';
```
- `.env` dosyası versiyon kontrolüne alınmaz (gitignore)
- Production ortamında env değişkenleri güvenli şekilde saklanır

### 11. Error Handling & Logging
- Production ortamında detaylı hata mesajları gösterilmez
- Log dosyaları yetkisiz erişime karşı korunur
- Log içeriklerinde sensitive data (parola, CC vs.) barındırmaz

## Additional Security Measures
- `composer audit` ile dependency checker yapılır
- `php artisan security:check` benzeri araçlarla güvenlik açıkları taranır
- Regular penetration testing uygulanır
- Automated security scanning CI/CD pipeline'e entegre edilir