# Reqruit HRMS — İnsan Kaynakları Yönetim Sistemi

## 1. Genel Bakış

**Reqruit**, şirketlerin tüm insan kaynakları süreçlerini tek bir platform üzerinden yönettiği modern bir İnsan Kaynakları Yönetim Sistemi'dir (HRMS). Platform; işe alımdan maaş hesaplamaya, personel devam takibinden izin yönetimine kadar İK departmanının operasyonel yükünü ortadan kaldırmayı hedefler.

Sistem, tek bir uygulama içinde birbirine bağlı altı büyük modül barındırır:

| # | Modül | Ne Yapar |
|---|-------|----------|
| 1 | **İşe Alım (Recruitment)** | Başvuru formları oluşturma, aday başvurularını toplama, değerlendirme, istihbarat ve AI ile ön eleme |
| 2 | **Çalışan Yönetimi** | Personel özlük dosyası, belgeler, pozisyon geçmişi, işten çıkarma işlemleri |
| 3 | **İzin Yönetimi** | İzin türleri, izin hakları ve izin talep/onay süreçleri |
| 4 | **Bordro ve Maaş** | Maaş bileşenleri, aylık bordro üretimi, SGK/vergi hesaplama, çok aşamalı onay |
| 5 | **Avans Yönetimi** | Avans talepleri, onay/red süreçleri, taksitli maaş kesintileri |
| 6 | **PDKS (Devam Kontrol)** | Giriş-çıkış takibi, vardiyalar, çalışma takvimi, fazla mesai, devam raporları |

Bunlara ek olarak platform, **harici web sitelerine entegre edilebilen bir başvuru widget'ı** sunar. Şirketler kendi kariyer sayfalarına tek satır kodla Reqruit'in başvuru formlarını gömerler; adaylar hiçbir şekilde ana sisteme girmeden başvuru yapabilir.

---

## 2. İşe Alım Modülü

İşe alım modülü; ilanların ve başvuru formlarının oluşturulduğu, adayların başvurduğu, İK ekibinin değerlendirdiği her şeyi kapsayan modüldür. Sıfırdan kod yazmadan, sürükle-bırak yöntemiyle formlar tasarlanır ve tüm başvuru süreci tek ekrandan yönetilir.

### 2.1 Departman Yönetimi

Departmanlar, kurumun işe alım yapısını oluşturan birimlerdir. Organizasyonel yapıyı yansıtacak şekilde **hiyerarşik (üst-alt)** olarak tanımlanabilir.

- **Hiyerarşik ağaç yapısı:** Her departman bir üst departmana bağlanabilir (ör. "Teknoloji" → "Yazılım" → "Frontend"). Liste ekranı bu ağacı girintili satırlarla tablo halinde gösterir; seviye sınırı yoktur.
- **Bildirim e-postaları:** Her departmana bir veya birden çok e-posta adresi tanımlanabilir. Bu adresler, o departmana bağlı bir formdan başvuru geldiğinde "yeni başvuru" bilgilendirmesi alır.
- **URL dostu kodlar (slug):** Her departman otomatik olarak benzersiz, link dostu bir kod alır. Bu kodlar, harici widget ve public form adreslerinde kullanılır.
- **Yönetim:** Yeni departman ekleme, düzenleme (üst departman değiştirme, e-posta listesi yönetme) ve silme işlemleri yönetim panelinden yapılır.

### 2.2 Başvuru Formu Oluşturucu (Form Builder)

Bu modülün en güçlü özelliği **kod bilmeden, sürükle-bırak ile kendi başvuru formunu tasarlayabilmektir.** Bir İK uzmanı aşağıdaki işlemleri kısa sürede tamamlar:

- Forma bir **ad ve açıklama** yazar, formu hangi **departmana** bağlayacağını seçer.
- **Bildirim e-postaları** tanımlar: Bu formdan başvuru geldiğinde kimler haberdar edilecek.
- Sağ panelden **alan ekler**, sürükleyerek **sıralar**, siler, zorunluluk işaretler ve seçenekli alanların seçeneklerini düzenler.
- Her formda varsayılan olarak **"Ad Soyad"** ve **"E-posta"** alanları otomatik bulunur ve silinemez. Sistem değerlendirme ekranlarında aday adını ve iletişim bilgisini bu alanlardan çeker.

**Desteklenen 10 alan türü:**

| Tür | Kullanım Amacı |
|-----|----------------|
| Metin (text) | Serbest kısa metin (adres vb.) |
| E-posta (email) | E-posta adresi (biçim doğrulaması yapılır) |
| Telefon (tel) | Telefon numarası |
| Sayı (number) | Sayısal değer (ör. deneyim yılı) |
| Tarih (date) | Tarih seçimi |
| Uzun metin (textarea) | Çok satırlı açıklamalar |
| Açılır liste (select) | Tek seçimli seçenek listesi |
| Onay kutusu (checkbox) | Birden çok seçenek işaretleme |
| Radyo buton (radio) | Tek seçimli seçenekler |
| Dosya (file) | Özgeçmiş gibi dosya yükleme (maks. 10 MB, PDF/DOCX/Görsel türleri) |

Form kaydedildiğinde alan adları otomatik ve benzersiz olarak üretilir; yapılan her düzenleme sonrası alanlar güvenle yeniden oluşturulur. Aynı form daha sonra hem şirketin kendi sitesinde, hem widget aracılığıyla harici sitelerde kullanılabilir.

### 2.3 Başvuru Süreci (Submissions)

Aday başvurusu yapmak için iki kanaldan birini kullanır: **public form adresi** (`/forms/{slug}`) veya **harici sitedeki widget**. Başvuru geldiğinde sistem:

1. Form alanlarını türlerine göre **doğrular** (zorunlu alanlar, biçimler, dosya türleri).
2. Yüklenen dosyaları **güvenli, herkese kapalı bir alanda** saklar.
3. Cevapları başvuru kaydına işler ve **benzersiz bir başvuru referans numarası** üretir (ör. `APP-X7K2LQZ9`).
4. Arka planda otomatik olarak iki e-posta gönderir:
   - **Yeni başvuru bildirimi** → formun/departmanın bildirim e-postalarına (başvurunun yönetim paneli linki ile).
   - **Teşekkür mektubu** → adayın e-postasına (referans numarası ile birlikte).

**Başvuru durumları (aşama takibi)** — Her başvuru altı aşamalık bir yolculuktan geçer ve İK ekibi başvuru detayından durumu ilerletir:

| Durum | Anlam |
|-------|-------|
| Yeni (new) | Başvuru sisteme yeni düştü, henüz incelenmedi |
| İnceleniyor (reviewing) | İK ekibi başvuruyu değerlendiriyor |
| Mülakat (interview) | Aday mülakata çağrıldı |
| Teklif (offer) | İş teklifi yapıldı |
| İşe Alındı (hired) | Aday işe alındı |
| Reddedildi (rejected) | Başvuru değerlendirme dışı bırakıldı |

**Başvuru listesi ve filtreler** — Başvuru ekranı, İK ekibinin iş yükünü hafifletmek için güçlü filtreler içerir: durum, istihbarat durumu, form, departman ve tarih aralığıyla daraltma yapılabilir. Listede aday adı, e-posta, gönderim tarihi, bağlı form/departman, istihbarat rozeti, yorum sayısı ve ortalama değerlendirme puanı bir arada görülür.

### 2.4 İstihbarat Raporları (Ön Araştırma / Referans Kontrolü)

"İstihbarat", aday hakkında işe alım öncesi yapılan **güvenlik ve geçmiş kontrol sürecidir** — geçmiş iş yerlerinin doğrulanması, eğitim bilgilerinin teyidi, referans sorgulamaları vb.

- Her başvuru için birden çok istihbarat raporu tutulabilir.
- Her raporun bir **durumu** vardır: Bekliyor / Tamamlandı / Yapılmadı.
- Raporlar **not** alanıyla birlikte kaydedilir; raporlar eklenebilir ve silinebilir.
- Başvurunun güncel istihbarat durumu en son raporun durumudur ve liste ekranında hızlıca görülür, filtrelenebilir.

### 2.5 Yapay Zeka (AI) Değerlendirme

Başvuru detay sayfasından tek tıkla, **OpenAI destekli otomatik değerlendirme** yapılır:

- Sistem, başvurudaki tüm cevapları toplar ve yapay zekâya "İK uzmanı" gözüyle **1-5 yıldız puan** verip Türkçe kısa bir değerlendirme yorumu yazmasını ister.
- AI'ye **yaş, cinsiyet, medeni durum gibi ayrımcı bilgileri** kullanmaması talimatı verilir.
- Sonuç (puan + yorum) başvuruya kaydedilir; başvuru listesinde ortalama yorum puanı görünür.

Bu özellik, İK ekibinin yüzlerce başvuru içinden olası adayları hızlıca ön elemesine yardımcı olur.

### 2.6 Yorumlar ve Puanlama

İK ekibi üyeleri her başvuru hakkında yorum bırakıp **1-5 puan** verebilir. Yorumlar **gizli not** olarak işaretlenebilir (yalnızca İK ekibinin görüntülediği sarı arka planlı kart). Puanlar başvuruda ortalama olarak toplanır ve liste ekranında yıldızlarla gösterilir.

### 2.7 Etkileşim / Takip Geçmişi (İletişim Zaman Çizelgesi)

Adayla yapılan her görüşme ve iletişim, hem başvuruda hem aday profilde bir zaman çizelgesi olarak kaydedilir. Kayıt türleri:

- Görüşme (meeting)
- Telefon görüşmesi (phone)
- E-posta yazışması (email)
- Teklif (offer)
- Pazarlık (negotiation)
- Diğer (other)

Her kayda tarih, yapılan işin açıklaması ve adayın yanıtı eklenir; böylece sürecin "kimle ne konuşuldu" geçmişi asla kaybolmaz.

### 2.8 Aday Havuzu (Kalifiye Elemanlar)

Başvuru yapmış ya da dışarıdan (ör. LinkedIn'den) keşfedilmiş profesyoneller bir **yetenek havuzunda** saklanır. İK uzmanı şu bilgileri tutar:

- İletişim: ad, e-posta, telefon
- Güncel şirket ve pozisyon
- Kaynak (hangi kanaldan bulunduğu — LinkedIn, başvuru vb.)
- Notlar

**Aday durumları:**

| Durum | Anlam |
|-------|-------|
| Aktif (active) | İş arayan, fırsat sunulabilir |
| İlgileniyor (engaged) | Görüşme/iletişim halinde |
| Pasif (passive) | Şu an değişiklik istemiyor, ileride hatırlanacak |
| Kapalı (closed) | Bir daha başvuru yapmadı |

Aday havuzu sayesinde daha önce reddedilen ya da pasif kalan yetenekler, yeni bir pozisyon açıldığında birkaç saniyede yeniden bulunabilir.

### 2.9 Harici Widget Sistemi (Kariyer Sayfası Entegrasyonu)

Platformun dikkat çekici özelliklerinden biri, **harici web sitelerine gömülebilen başvuru widget'ıdır.** Şirket kendi kariyer sayfasına küçük bir kod bloğu yerleştirir:

```html
<div id="reqruit-widget"></div>
<script src="https://sizin-domain.com/widget/reqruit.js"></script>
<script>
  ReqruitWidget.init({
    container: '#reqruit-widget',
    baseUrl: 'https://sizin-domain.com',
    theme: { primaryColor: '#4f46e5' },   // site renklerine uyum için
    department: 'teknoloji'               // isteğe bağlı: doğrudan belirli departmanı açar
  });
</script>
```

**Widget ziyaretçiye nasıl bir deneyim sunar?**

1. Ziyaretçi **kök departman kartlarını** görür ve "başvuru yapmak istediği bölümü" seçer.
2. Alt departman varsa breadcrumb (yol izi) eşliğinde aşağı doğru gezilir; **üst seviyeye tek tıkla dönülür**.
3. Departmanın bir formu varsa form anında ekrana gelir ve aday doldurup gönderir.
4. Ne alt departman ne form yoksa ziyaretçiye zarif bir **"içerik yok" mesajı** gösterilir.
5. Başvuru tamamlandığında ziyaretçi **"Başvurunuz Alındı — Referans: APP-XXXX"** ekranı görür.
6. Gezilen departman **URL'ye yansır**; böylece "teknoloji departmanı başvuru linki" paylaşılabilir.

Widget'ın renkleri, köşe yuvarlaklığı, fontları ve kart görünümü **site temasıyla eşleşecek şekilde özelleştirilebilir**. Widget tamamen şirketin kendi sitesi üzerinde çalışır; adaylar Reqruit sistemine hiç girmeden başvuru yapar.

### 2.10 Herkese Açık Başvuru Formu

Widget kullanmak istemeyen şirketler, başvuru formlarını doğrudan bir adresle yayımlar: `/forms/{iska}` şeklindeki link herkese açıktır, giriş gerektirmez. Bu sayfada form şirket logosu ve kimliğiyle bağımsız bir sayfa olarak görünür. Aday formu doldurup gönderdiğinde aynı başvuru süreci (bildirim e-postaları, referans numarası, teşekkür maili) otomatik işler. Aşırı kullanımı önlemek için **IP başına 60 dakikada en fazla 5 başvuru** sınırı uygulanır.

---

## 3. Çalışan Yönetimi

Bu modül, çalışanların tüm özlük bilgilerinin toplandığı, güncel tutulduğu ve kurumsal yaşam boyunca izlendiği "dijital personel dosyasıdır".

### 3.1 Çalışan Kartı

Her çalışan için aşağıdaki bilgiler kaydedilir ve tek ekrandan yönetilir:

- **Kişisel bilgiler:** Kimlik bilgileri, iletişim bilgileri, cinsiyet, medeni durum, doğum tarihi
- **İş bilgileri:** Departman, pozisyon, işe giriş tarihi, çalışma şekli (tam/yarı zamanlı), sözleşme türü, çalışma takvimi
- **Eğitim geçmişi:** Okul/bölüm ve derece bilgileri
- **Sertifika ve belgeler**

### 3.2 Belgeler ve Dosya Yönetimi

Çalışana dokümanlar (sözleşme, kimlik fotokopisi, diploma vb.) yüklenebilir ve silinebilir. Belgeler **herkese kapalı, güvenli bir alanda** saklanır; yalnızca giriş yapmış ve yetkili kullanıcılar görüntüleyebilir/indirebilir. Erişim katmanında dosya yolları sıkı kontrol edilir, sisteme ait olmayan dosyalara ulaşılamaz.

### 3.3 Pozisyon Geçmişi

Çalışanın zaman içinde geçtiği pozisyon ve departman değişiklikleri kayıt altına alınır. Böylece çalışanın kariyer yolculuğu (terfiler, yan geçişler ve sorumluluk alanları) anlık olarak görülebilir.

### 3.4 İşten Çıkarma Süreci

Çalışan işten çıkarıldığında **işten çıkış tarihi** işaretlenir ve çalışan "aktif olmayan" duruma geçer. Sistem bundan sonra ilgili kişiyi aktif bordro hesaplamalarında ve devam yoklamalarında dikkate almaz.

---

## 4. İzin Yönetimi

İzin modülü; şirketin izin politikalarını tanımladığı, çalışanların izin haklarını takip ettiği ve izin taleplerinin onaylandığı bölümdür.

### 4.1 İzin Türleri

Şirket kendi izin türlerini tanımlar (Yıllık İzin, Mazeret, Sağlık Raporu, Doğum, Ücretsiz vb.). Her izin türü için temel kurallar (yıllık hak günü vb.) burada belirlenir.

### 4.2 İzin Hakları (Entitlements)

Her çalışan için, her izin türü kapsamında **hak edilen toplam gün** tanımlanır (ör. yıllık 14 gün). Kullanılan izin günleri bu haklardan otomatik düşülür ve **kalan gün** hesabı sürekli güncel tutulur. Çalışanın o an kaç gün izni kaldığı bir bakışta görülür.

### 4.3 İzin Talebi ve Onay Akışı

1. Çalışan (veya yetkili İK personeli) **izin talebi** oluşturur: izin türü, başlangıç ve bitiş tarihi, gerekçe.
2. Sistem iş günü sayısını hesaplar (hafta sonu ve tatiller dahil edilmez) ve talebi kalan hakla karşılaştırır.
3. Talep **onay veya red** edilir.
4. Onaylanan izin, hakkın güncel bakiyesinden düşülür ve devam/vardiya hesabında dikkate alınır.

---

## 5. Bordro ve Maaş Yönetimi

Bordro modülü, platformun finansal kalbidir. Türkiye mevzuatına uygun olarak SGK, gelir vergisi ve damga vergisi kesintileri otomatik hesaplanır.

### 5.1 Maaş Bileşenleri (Salary Components)

Maaş bileşenleri, maaşın yapı taşlarıdır. İK/muhasebe ekibi iki ana kategoride kalem tanımlar:

- **Kazançlar (earning):** Yemek yardımı, yol yardımı, ikramiye gibi ödemeler
- **Kesintiler (deduction):** SGK, gelir vergisi, avans kesintisi gibi kalemler

Her bileşene yukarıdakilere ek olarak şu özellikler atanır:

- **Kategori:** Sabit (her dönem aynı tutar) veya değişken
- **Durum:** Aktif/pasif (pasif kalemler hesaplamalara dahil edilmez)
- **Vergi durumu:** Ücretin vergi matrahına dahil edilip edilmeyeceği
- **SGK durumu:** SGK matrahına dahil edilip edilmeyeceği
- **Varsayılan tutar:** Yeni çalışan atamalarında kullanılan ön değer

### 5.2 Çalışan Maaş Yapılandırması

Her çalışan için, hangi maaş bileşenleri geçerli ve hangi tutarlarda olduğu tanımlanır. Yapılandırmaların **başlangıç/bitiş tarihleri** vardır; bu sayede çalışan zam aldığında, terfi ettiğinde veya görev değiştirdiğinde eski tutarlar geçmiş dönem bordrolarında doğru kalır, yenileri bugünden itibaren uygulanır.

### 5.3 Bordro Dönemi Oluşturma

İK ekibi bir bordro dönemi başlatır:

- Dönem tipi seçilir: **Aylık, İki Haftalık veya Haftalık** (tarihler otomatik doldurulur ve düzenlenebilir)
- Dönem adı, tarih aralığı, ödeme günü ve çalışma günü sayısı belirlenir
- Dönem **"Taslak"** statüsünde oluşturulur

### 5.4 Bordro Kalemlerinin Otomatik Üretimi

Bordro kalemleri elle girilmez; **tek komutla toplu üretilir.** Sistem, o dönemde aktif olan tüm çalışanları bulur, her birinin o tarihlerde geçerli maaş yapılandırmasını çeker ve tüm kazanç+kesinti kalemlerini bordroya tek tek işler. Böylece 500 kişilik bir şirketin aylık bordrosu dakikalar içinde hazır olur.

### 5.5 Maaş Hesaplama Motoru

Platform, Türkiye'nin güncel mevzuat parametreleriyle maaş hesaplar:

1. **Brüt maaş** = tüm aktif kazançların toplamı
2. **SGK matrahı** belirlenir (asgari ücret tabanı ile üst tavan arasında sınırlanır)
3. **SGK çalışan payı:** Sağlık primi %14 + İşsizlik sigortası %2 = toplam %16
4. **SGK işveren payı:** İşveren primi %25,5 + işsizlik (işveren) %3 = toplam %28,5
5. **Gelir vergisi matrahı** = brüt maaş − SGK çalışan payı
6. **Gelir vergisi:** Kademeli (progresif) dilim sistemi ile (düşük gelirde %15'ten yüksek gelirde %40'a kadar kademeli oranlar)
7. **Damga vergisi** otomatik hesaplanır

Bu hesaplamaların tamamı arka planda çalışır; kullanıcı yalnızca doğru rakamları ekranda görür.

### 5.6 Çok Aşamalı Onay Süreci

Bir bordro dönemi, taslaktan yayına **dört onay adımından** geçer:

1. **Taslak** — Oluşturuldu, kalemler üretildi
2. **Yönetici Onayı** — Birim yöneticisi inceler ve onaylar
3. **İK Onayı** — İnsan Kaynakları onaylar
4. **Muhasebe Onayı** — Muhasebe son onayı verir
5. **Yayınlandı** — Onaylar tamamlandı, bordro kesinleşti

Her aşamada onay **notuyla birlikte** verilir ve tüm onay **geçmişi** (kim, ne zaman, ne dedi) ekranda listelenir. Herhangi bir aşamada **red** edilirse bordro taslağa geri döner ve düzeltilip yeniden gönderilir.

### 5.7 Bordro Raporları

Bordro verisi çok yönlü raporlarla sunulur:

- **Bordro Özeti:** Dönemin toplam çalışan, kazanç, kesinti ve net tutarları; kalem bazlı dağılım
- **Vergi ve SGK Özeti:** SGK çalışan/işveren payları, gelir vergisi, damga vergisi, toplam işveren maliyeti
- **Departman Özeti:** Her departmanın çalışan sayısı, brüt/net ve ortalamaları
- **Dönem Karşılaştırma:** Birden çok dönemin brüt/kesinti karşılaştırması ve yüzde değişimler
- **Yıllık Özet:** Yıl boyunca aylık bazda maaş trendi ve ortalamalar

Raporlar grafiklerle desteklenir; böylece yöneticiler maaş bütçesinin gidişatını tek bakışta izler.

---

## 6. Avans Yönetimi

Avans modülü, Türkiye'de yaygın "maaş avansı" uygulamasını dijitalleştirir: çalışan maaşından önde para çeker, bu avans sonraki bordrolarda taksit taksit geri kesilir.

### 6.1 Avans Talebi Oluşturma

Çalışan (veya yetkili personel) avans talebi oluştururken şunları belirtir:

- **Avans türü:** Acil durum, taahhüt, araç yakıtı, yol ücreti, eğitim, sağlık, ev giderleri, diğer
- **Tutar** (sistem, çalışanın brüt maaşının %40'ı üzerinde avansa izin vermez ve alt sınır/dayanak kuralları uygular)
- **Taksit sayısı** (1-12 taksit)
- **Neden / açıklama** ve opsiyonel IBAN

Ekran, çalışanın anlık **brüt/net maaş bilgisini**, izin verilen **maksimum avans tutarını** ve seçilen taksite göre **aylık kesinti planını** canlı gösterir.

### 6.2 Onay Akışı

- **Bekliyor (pending)** → **Onaylandı (approved)** → **Ödendi (paid)**
- Onaylandığında çalışana e-posta bildirimi gider
- Reddedildiğinde **red nedeni** kaydedilir ve çalışana bildirilir
- Bekleyen/onaylı talepler iptal edilebilir

### 6.3 Taksitli Ödeme ve Kesinti Takibi

Onaylanan avans, seçilen bor dönemlerinin bordrolarına **otomatik kesinti kalemi** olarak eklenir (ör. 6.000 TL, 3 ayda 2.000'er TL). Her dönem kesildikçe kalan bakiye güncellenir; tüm taksitler kesildiğinde avans **"ödendi"** durumuna geçer. Sistem bu döngüyü uçtan uca takip ettiği için maaştan eksik/fazla kesinti yapılma ihtimali yoktur.

---

## 7. PDKS — Personel Devam Kontrol Sistemi

PDKS modülü; çalışanların işe giriş-çıkışlarını, vardiyalarını, devamsızlıklarını ve fazla mesailerini yöneten zaman takip sistemidir.

### 7.1 Giriş/Çıkış (Clock In/Out)

Çalışanların devam kayıtları **çoğu kaynakla** toplanır; sistem her kaydın **nereden geldiğini** (cihaz, mobil, web, API, manuel) izler:

- **Cihaz:** Biyometrik/parmak izi veya kartlı devam terminali
- **Mobil / Web / API:** Mobil uygulama, web paneli veya başka bir sistemden aktarılan kayıtlar
- **Manuel:** İK tarafından elle girilen saatler (kaynak açıkça işaretlenir, terminalden geldiği izlenimi verilmez)

**Kayıt tipleri:** Giriş (check-in), Çıkış (check-out), Mola Başı ve Mola Sonu. Her kayda gerekirse konum, IP ve cihaz bilgisi eklenir.

### 7.2 QR Kod ile Giriş (Kamera Destekli)

Devam takibi ekranındaki **"QR Tarayıcı"** yüzü, İK personelinin asıl kullandığı günlük araçtır:

1. Ekran **kamerayı açar**; çalışanlar kimlik kartlarındaki QR kodlarını okutur.
2. Okunan kod, çalışanı eşleştirir ve seçili moda göre (giriş/çıkış) **otomatik kayıt** oluşturur.
3. Aynı çalışanın aynı yönde tekrar okutması uyarıyla engellenir.
4. "Son kayıtlar" listesi ekranda anlık güncellenir; tanımlanamayan kodlar için net uyarı gösterilir.

Aynı ekranda **manuel saatli giriş** de yapılabilir: personel seçilir, giriş/çıkış modu ve saat elle belirtilir — geçmiş değerlendirme veya kaçırılan iktişamalar için.

### 7.3 Vardiya Yönetimi

Şirket çalışma saatlerini **vardiya kalıpları** halinde tanımlar:

- **Vardiya türleri:** Sabah, akşam, gece, esnek
- Başlangıç/bitiş saatleri ve **mola süresi** (net çalışma = toplam − mola)
- **Tolerans süresi:** Dakika bazında yumuşatma (ör. 15 dk tolerans içinde geç kalma sayılmaz)
- **Gece vardiyası işareti:** Gece yarısını aşan vardiyalarda (23:00–07:00) süre hesabı otomatik doğru yapılır

Oluşturma ekranı, girilen saat bilgisine göre "günlük net çalışma süresini" canlı önizler.

### 7.4 Vardiya Atamaları

İK ekibi çalışanları vardiyalara planlar:

- **Tekli atama:** Bir çalışana belirli bir tarih için vardiya atanır (örtüşme varsa önceki atama güncellenir)
- **Toplu atama:** Birden çok çalışan seçilir, toplu olarak atanır
- Tekil/bulk atamalar kötüye kullanıma karşı hız sınırlamasıyla korunur

Vardiya planı, günlük özet hesaplarında "o gün için plan neydi?" sorusunun cevabıdır. Atama yoksa çalışanın varsayılan vardiyası kullanılır.

### 7.5 Çalışma Takvimi ve Resmi Tatiller

Şirket, vardiya ve devam hesaplarının dayandığı **çalışma takvimlerini** tanımlar:

- Takvim oluşturulurken başlangıç/bitiş tarihleri girilir; sistem **toplam gün, iş günü ve tatil günü** sayılarını otomatik hesaplar
- Takvimler aktif/pasif edilebilir, düzenlenebilir; aktif takvim değişikliği için personel devam kayıtlarının etkilenebileceği uyarısı gösterilir

**Resmi tatiller** ("Resmi / Şirket" türleriyle) ayrıca tanımlanır ve şu özelliğe sahiptir:

- **Tek seferlik** tatiller: belirli bir tarihte
- **Tekrarlayan** tatiller: yıl farkını yok sayar, ay-gün eşleşmesiyle her yıl otomatik kabul edilir (yılbaşı gibi)

Tatiller, devam hesabı sırasında otomatik dikkate alınır (tatilde olduğu için devamsız sayılmaz).

### 7.6 Fazla Mesai, Geç Kalma ve Erken Çıkış Hesaplamaları

Sistem her çalışan için **her gün** bir devam özeti üretir. Bu özet şunları hesaplar ve kaydeder:

- **Çalışılan süre:** giriş-çıkış eksi mola
- **Planlanan süre:** vardiyanın beklenen süresi
- **Geç kalma:** girişin (vardiya başlangıcı + tolerans) sonrasına düşmesi
- **Erken çıkış:** çıkışın (vardiya bitişi − tolerans) öncesine düşmesi
- **Fazla mesai:** fiili sürenin planlanan süreyi aşması

Günün **devam durumu** (Gelmedi / Geç Kaldı / Erken Ayrıldı / Fazla Mesai / Devam) otomatik belirlenir ve renkli rozetlerle gösterilir. Giriş/çıkış yapan çalışanın özeti anında güncellenir.

### 7.7 Devamsızlık Düzeltme Talepleri (Adjustments)

Gerçek hayatta plan aksayabilir: QR okunmadı, turnike arızalandı, çalışan izne çıktı. Bu durumlarda devreye **düzeltme talebi** mekanizması girer:

- **Talep tipleri:** Eksik kayıt (giriş/çıkış hiç yapılmamış), Hatalı kayıt (saati yanlış), Fazla mesai talebi
- Çalışan veya İK, ilgili tarih için **eski ve yeni saatler** ile birlikte talep oluşturur; **gerekçe** zorunludur
- Aynı çalışan için aynı tarihte **birden çok bekleyen talep** açılamaz (sistemi kötüye kullanma koruması)
- İK ekibi talepleri tek tek veya **toplu olarak onaylar/reddeder**; reddedilirken neden sorulur
- Onaylanan talep, o günün devam özetini **otomatik yeniden hesaplatır** (mesai, geç kalma vb. güncellenir)

### 7.8 Devam Raporları

Sistem dört ana rapor sunar:

- **Günlük Rapor:** Seçilen günde tüm personelin giriş/çıkış saatleri, devam/geç/late durumları ve çalışılan saatler; üstte toplam personel, devam eden, devamsız ve devam oranı özeti
- **Aylık Rapor:** Yıl+ay seçilir; iş günü sayısı, devam oranı %, ortalama ve toplam fazla mesai kartları, günlük detay tablosu ve grafikler
- **Fazla Mesai Raporu:** Kişi bazlı toplam mesai saati, mesai yapılan gün sayısı, mesai hakkına uygunluk rozeti; dönem bazlı grafikler
- **Dışa Aktarma (Export):** Günlük/aylık/mesai/devam özeti/izinli/vardiya raporları **Excel, PDF veya CSV** olarak dışa aktarılır; tarih aralığı ve personel filtresi uygulanabilir

---

## 8. Kullanıcı, Rol ve Yetkilendirme

### 8.1 Kullanıcı Rolleri

Sistemde beş farklı kullanıcı rolü tanımlıdır; her rolün erişim ve işlem yetkileri farklıdır:

| Rol | Tanım | Tipik Yetkiler |
|-----|-------|----------------|
| **Yönetici (Admin)** | Sistem yöneticisi | Tüm modüllere tam erişim, kullanıcı yönetimi |
| **İK Yöneticisi** | İnsan kaynakları birim yöneticisi | Tüm İK modüllerini yönetir |
| **İşe Alım Uzmanı** | Aday ve başvuru yönetimi | Başvuruları değerlendirir, aday havuzunu yönetir |
| **Departman Sorumlusu** | Birim yöneticisi | Departman bazlı görüntüleme ve onay yetkileri |
| **Gözlemci** | Denetim/izleme | Yalnızca görüntüleme yetkisi |

Yetkilendirme iki katmanda çalışır: (1) rol bazlı erişim kontrolleri, (2) detaylı izin kuralları (ör. bordro raporlarını görme/generate izinleri ayrı ayrı kontrol edilir). Örneğin bordro raporları yalnızca yetkili roller tarafından görüntülenebilir; ilgili menüye erişilse bile arka planda izin kontrolü tetiklenir.

### 8.2 Giriş, Kayıt ve Hesap Durumu

- **Giriş:** E-posta + şifre ile yapılır; **5 hatalı deneme sonrası** geçici kilit uygulanır. Başarılı girişte oturum güvenliği yenilenir.
- **Yeni kayıt:** Yeni kullanıcılar otomatik olarak **"beklemede"** durumuna alınır ve ancak **admin onayıyla aktifleşir**; aktif olmayan hesap giriş yapsa bile sisteme erişemez.
- **Hesap durumları:** Aktif / Pasif / Beklemede — durumu renkli rozetlerle gösterilir.
- **Şifre sıfırlama:** Türkçe e-posta şablonuyla, 60 dakika geçerli bir link gönderilir.
- **Şifre politikası:** En az 10 karakter, büyük/küçük harf, rakam ve özel karakter zorunludur.

### 8.3 Kullanıcı Yönetimi

Admin panelinden kullanıcılar listelenir (arama + sayfalama ile), oluşturulur, düzenlenir ve silinir. Yeni kullanıcıya rol ve durum atanır; düzenlemede şifre boş bırakılırsa değişmez.

### 8.4 Profil Yönetimi

Her kullanıcı kendi profil bilgilerini güncelleyebilir, şifresini değiştirebilir. Bildirimler bölümü (şu an için yeni bildirim yok ibaresi) ve kullanıcı menüsünden çıkış yapma işlevi üst barda yer alır.

---

## 9. Dashboard

Giriş yapıldığında karşılanan ana sayfa, işe alım sürecinin canlı özetidir:

- **Haftalık başvuru grafiği:** Son 7 haftanın başvuru sayılarını gösteren çubuk grafik
- **İstatistik kartları (tıklanabilir):**
  - Toplam başvuru (→ başvurular listesi)
  - Yeni başvuru (→ yalnızca "yeni" durumdakiler)
  - Aktif form sayısı (→ formlar)
  - Departman sayısı (→ departmanlar)
- **Hızlı erişim kartları:** Başvurular, Formlar ve Departmanlar sayfalarına tek tıkla ulaşım

Dashboard verileri 5 dakikalık önbellekle sunulur; böylece yüksek trafikte bile hızlı açılır.

---

## 10. Ana Menü (Navigasyon) Haritası

Sisteme giriş yapan kullanıcı sol menüden şu bölümlere ulaşır:

**İnsan Kaynakları**
- Başvurular (İşe Alım)
- Formlar
- Departmanlar
- Kalifiye Elemanlar (Aday Havuzu)
- Çalışanlar
- Kullanıcılar

**Zaman Yönetimi (PDKS)**
- Devam Takibi (QR Tarayıcı + Giriş/Çıkış)
- Vardiyalar
- Vardiya Takvimi (Atamalar)
- Düzeltme Talepleri
- Çalışma Takvimleri
- Resmi Tatiller

**İzin Yönetimi**
- İzin Talepleri
- İzin Türleri
- İzin Hakları

**Bordro ve Maaş**
- Bordrolar
- Maaş Bileşenleri
- Avans Talepleri

**Raporlar**
- Bordro Raporları
- Devam Raporları

Menü, mobilde hamburger butonuyla açılır/kapanır; gezinirken aktif bölüm otomatik işaretlenir. Her sayfa üstte bir **başlık + breadcrumb (yol izi)** ve bağlama göre aksiyon butonları (Yeni Ekle, Filtre, Geri, Excel İndir) gösterir. Kabul edilen tüm işlemlerde **toast bildirimleri** (başarı/hata) ekranın bir köşesinde belirir.

---

## 11. Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | PHP / Laravel 12 |
| Frontend | React 18 + Inertia.js 2 (SPA deneyimi) |
| UI / Stil | Bootstrap 5 + Tabler Icons |
| Grafikler | ApexCharts / Chart.js / Recharts |
| Veritabanı | SQLite (uygulama), MySQL/PostgreSQL uyumlu şemalar |
| Yetkilendirme | Spatie Laravel Permission + rol/izin enum'ları |
| Kimlik | Laravel Breeze (oturum tabanlı) |
| QR Okuma | html5-qrcode (kamera ile) |
| Yapay Zeka | OpenAI API (başvuru değerlendirme) |

Mimari olarak proje **Controller → Service → Repository → Model** katmanlarını izler; iş mantığı servislerde, veri erişimi repository arayüzlerinde toplanır. Tüm girişler doğrulanır ve yetkiler politika katmanında denetlenir.

---

## 12. Hızlı Kurulum

```bash
# Gereksinimler: PHP 8.2+, Node.js 18+, Composer
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run build

# Geliştirici ortamı (server + queue + logs + vite tek komutla):
npm run dev        # ve ayrı bir terminalde:
php artisan serve
```

Varsayılan demo verileri (kullanıcılar, departmanlar, formlar, başvurular, maaşlar, devam kayıtları) seeder'lar ile hazır gelir; sistemi hemen keşfetmeye başlayabilirsiniz.

### 12.1 Production (Canlı Ortam) Dağıtımı

Canlı ortama taşımadan önce aşağıdaki adımlar uygulanmalıdır:

```bash
# .env içinde production ayarları
APP_ENV=production
APP_DEBUG=false
APP_URL=https://site-adresi.com
SESSION_SECURE_COOKIE=true
SESSION_DRIVER=redis      # veya database
CACHE_STORE=redis         # önerilir (database ise okumalar DB'ye biner)
QUEUE_CONNECTION=redis    # veya database

# Bağımlılıklar ve derleme
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# Cache optimizasyonları (her deploy'da tekrar çalıştırın)
php artisan optimize
php artisan event:cache
php artisan migrate --force

# Kuyruk işçisi (bildirim e-postaları vb.) — supervisor ile daima ayakta tutun
php artisan queue:work --sleep=3 --tries=3

# Planlı görevler (varsa)
# cron: * * * * * php /site/yolu/artisan schedule:run >> /dev/null 2>&1
```

**Önemli uyarılar:**
- `php artisan migrate --seed` canlı ortamda **çalıştırmayın**. Seeder'lar bilinen demo şifreleri (`123123123`) ile kullanıcılar oluşturur ve production'da devre dışı bırakılmıştır.
- Queue worker çalışmazsa mail bildirimleri gönderilmez; worker'ı supervisor/systemd ile kalıcı hale getirin.
- Config, route ve view cache'leri her deploy sonrası yenilenmelidir.