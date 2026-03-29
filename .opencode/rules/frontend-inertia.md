# Kıdemli Geliştiriciler İçin Frontend Inertia Kuralları

## Uygulama Yapısı
- Özellik odaklı dizinlerde bileşenleri organize edin, açık sorumluluk ayrımı ile
- Vue/React bağlamı veya özel kütüphaneler kullanarak uygun durum yönetimi uygulayın
- Tutarlı prop arayüzleri ve bileşen sözleşme tanımlarını koruyun
- Gezinme akışı için merkezi yönlendirici yapılandırmaları oluşturun

## Inertia-Özel Kalıplar
- Sorunsuz sayfa-dan-sayfaya geçişler için Inertia ziyaretlerini kullanın
- Uygun sayfa prop'ları ve sunucu-sağlanan veri yönetimi stratejileri uygulayın
- Sunucu tarafından sağlanan prop'lardan istemci tarafı durumunu ayrı tutun
- Inertia'nın gelişmiş form gönderme iş akışı için form yardımcısını kullanın

## Bileşen Mimarisi
- Bakım için akıllı vs aptal bileşen kalıbını uygulayın
- Geliştirilmiş tip güvenliği için TypeScript'i kullanın
- Karmaşık UI'lar için bileşik bileşenler gibi tasarım kalıplarını uygulayın
- Temel bileşenler oluşturun: yeniden kullanılabilir, yapılandırılabilir ve test edilmiş

## Performans Stratejileri
- Paketleme, küçültme ve sıkıştırma teknikleri ile varlıkları optimize edin
- Uygulanabilir yerlerde kod bölme ve dinamik içe aktarmalar uygulayın
- İstemci ve sunucu arasındaki veri serileştirmesini verimli şekilde optimize edin
- İlerici geliştirme ve tembel yükleme kullanın

## Entegrasyon En İyi Uygulamaları
- Uygun istisna oluşturma ile hata sınırları uygulayın
- Yükleme durumlarını ve iyimser güncellemeleri etkili şekilde yönetin
- Sunucu doğrulama hatalarını ilgili form alanlarına senkronize edin
- Kapsayıcı kullanıcı deneyimleri için erişilebilirlik yönergelerini takip edin
