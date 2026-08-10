-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 94.138.200.80
-- Üretim Zamanı: 10 Mar 2026, 11:30:31
-- Sunucu sürümü: 10.3.35-MariaDB-log-cll-lve
-- PHP Sürümü: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `bsbancom_veri2`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sVKPUJUU_dd_departments`
--

CREATE TABLE `sVKPUJUU_dd_departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `emails` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `parent_department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Tablo döküm verisi `sVKPUJUU_dd_departments`
--

INSERT INTO `sVKPUJUU_dd_departments` (`id`, `title`, `slug`, `emails`, `parent_department_id`, `created_at`, `updated_at`) VALUES
(5, 'İdari İşler', 'idari-isler', '', 0, '2025-11-25 07:04:29', '2025-11-25 07:05:23'),
(2, 'Grafik Tasarım', 'grafik-tasarim', '', 3, '2025-11-24 10:21:58', '2025-11-24 10:22:40'),
(4, 'Bilgi İşlem', 'bilgi-islem', 'keremyagiz@bsban.com', 0, '2025-11-25 06:11:20', '2025-12-03 09:45:11'),
(28, 'Ebatlama', 'ebatlama', 'ikasistan@bsban.com', 23, '2026-02-25 11:23:31', '2026-02-25 11:37:17'),
(7, 'Lojistik', 'lojistik', '', 0, '2025-11-25 07:59:28', '2025-11-25 07:59:28'),
(8, 'Mali İşler', 'mali-isler', '', 0, '2025-11-25 08:42:10', '2025-11-25 08:42:10'),
(9, 'Montaj ve Müşteri Destek Hizmetleri', 'montaj-ve-musteri-destek-hizmetleri', '', 0, '2025-11-25 10:42:51', '2025-11-25 10:51:25'),
(10, 'Müşteri Temsilciliği', 'musteri-temsilciligi', '', 0, '2025-11-26 08:46:07', '2025-11-26 08:48:06'),
(11, 'Pazarlama', 'pazarlama', '', 0, '2025-11-26 09:59:12', '2025-11-26 09:59:34'),
(12, 'Proje ve İç Mimarlık', 'proje-ve-ic-mimarlik', '', 0, '2025-12-03 06:00:26', '2026-02-19 10:42:34'),
(13, 'Satın Alma', 'satin-alma', '', 0, '2025-12-03 06:37:12', '2025-12-03 06:41:15'),
(14, 'Üretim', 'uretim', 'ikasistan@bsban.com', 0, '2025-12-03 07:02:51', '2026-02-25 12:30:55'),
(98, 'Güvenlik Görevlisi', 'guvenlik-gorevlisi-1', 'ikasistan@bsban.com', 5, '2026-03-10 10:47:52', '2026-03-10 10:47:52'),
(93, 'Marangoz', 'marangoz', 'ik@bsban.com', 24, '2026-03-05 06:50:51', '2026-03-05 06:50:51'),
(101, 'Teknik Personel', 'teknik-personel', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:40', '2026-03-10 10:48:40'),
(24, 'Ahşap Üretim', 'ahsap-uretim', '', 14, '2026-02-25 10:13:18', '2026-02-26 06:58:51'),
(25, 'Ebatlama ve Kesim', 'ebatlama-ve-kesim', '', 24, '2026-02-25 10:13:45', '2026-02-25 10:13:45'),
(26, 'Elektrik Üretim', 'elektrik-uretim', '', 14, '2026-02-25 10:14:17', '2026-02-25 10:14:17'),
(23, 'Metal Üretim', 'metal-uretim', '', 14, '2026-02-24 12:17:30', '2026-02-24 12:17:30'),
(27, 'Kablo Hazırlama ve Kesim', 'kablo-hazirlama-ve-kesim', '', 26, '2026-02-25 10:14:40', '2026-02-25 10:14:40'),
(22, 'Cnc Makine İşlemleri', 'cnc-makine-islemleri', 'ikasistan@bsban.com', 23, '2026-02-24 11:59:33', '2026-02-25 10:11:30'),
(29, 'Kaynak', 'kaynak', 'ikasistan@bsban.com', 23, '2026-02-25 12:37:08', '2026-02-25 12:37:08'),
(30, 'Tesviye', 'tesviye', 'ikasistan@bsban.com', 23, '2026-02-25 13:13:41', '2026-02-25 13:13:41'),
(31, 'Metal Boya-Cila', 'metal-boya-cila', 'ikasistan@bsban.com', 23, '2026-02-26 06:41:46', '2026-02-26 06:41:46'),
(32, 'Toplama-Montaj', 'toplama-montaj', 'ikasistan@bsban.com', 23, '2026-02-26 06:42:12', '2026-02-26 06:42:12'),
(33, 'Numune & Ar-Ge', 'numune-ar-ge', '', 23, '2026-02-26 06:42:57', '2026-02-26 06:42:57'),
(34, 'Kaplama ve Presleme', 'kaplama-ve-presleme', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:08', '2026-02-26 07:01:08'),
(35, 'Zımpara', 'zimpara', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:39', '2026-02-26 07:01:39'),
(36, 'Ahşap Boya-Cila', 'ahsap-boya-cila', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:57', '2026-02-26 07:01:57'),
(37, 'Toplama-Montaj', 'toplama-montaj-1', 'ikasistan@bsban.com', 24, '2026-02-26 07:53:44', '2026-02-26 07:53:44'),
(38, 'Cnc ve Özel İşlemler', 'cnc-ve-ozel-islemler', 'ikasistan@bsban.com', 24, '2026-02-26 07:54:25', '2026-02-26 07:54:25'),
(39, 'Numune ve Ar-Ge', 'numune-ve-ar-ge', 'ikasistan@bsban.com', 24, '2026-02-26 07:54:48', '2026-02-26 07:54:48'),
(40, 'Döşeme Üretim', 'doseme-uretim', '', 14, '2026-02-26 07:55:09', '2026-02-26 07:55:09'),
(41, 'İskelet Kontrol ve Hazırlık', 'iskelet-kontrol-ve-hazirlik', 'ikasistan@bsban.com', 40, '2026-02-26 07:55:32', '2026-02-26 07:55:32'),
(42, 'Elastik Katmanlar Montajı', 'elastik-katmanlar-montaji', 'ikasistan@bsban.com', 40, '2026-02-26 07:56:27', '2026-02-26 07:56:27'),
(43, 'Sünger-Dolgu Uygulaması', 'sunger-dolgu-uygulamasi', 'ikasistan@bsban.com', 40, '2026-02-26 07:56:54', '2026-02-26 07:56:54'),
(44, 'Dikiş ve Kılıf Hazırlığı', 'dikis-ve-kilif-hazirligi', 'ikasistan@bsban.com', 40, '2026-02-26 07:57:19', '2026-02-26 07:57:19'),
(45, 'Kılıf Giydirme ve Döşeme Montajı', 'kilif-giydirme-ve-doseme-montaji', 'ikasistan@bsban.com', 40, '2026-02-26 07:57:46', '2026-02-26 07:57:46'),
(46, 'Elektrik Montaj Personeli', 'elektrik-montaj-personeli', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:04', '2026-02-26 08:01:04'),
(47, 'Kablolama ve İç Tesisat Döşeme', 'kablolama-ve-ic-tesisat-doseme', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:30', '2026-02-26 08:01:30'),
(48, 'Elektrik İç Montaj', 'elektrik-ic-montaj', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:50', '2026-02-26 08:01:50'),
(49, 'İç Montaj', 'ic-montaj', '', 14, '2026-02-26 08:02:02', '2026-02-26 08:02:02'),
(50, 'Ana Gövde Montajı', 'ana-govde-montaji', 'ikasistan@bsban.com', 49, '2026-02-26 08:02:27', '2026-02-26 08:02:27'),
(51, 'Aksesuar ve Tamamlayıcı Montaj', 'aksesuar-ve-tamamlayici-montaj', 'ikasistan@bsban.com', 49, '2026-02-26 08:02:54', '2026-02-26 08:02:54'),
(52, 'Kontrol Son Hazırlık Montajı', 'kontrol-son-hazirlik-montaji', 'ikasistan@bsban.com', 49, '2026-02-26 08:03:19', '2026-02-26 08:03:19'),
(53, 'Plastik Üretim', 'plastik-uretim', '', 14, '2026-02-26 08:03:32', '2026-02-26 08:03:32'),
(54, 'Hammadde Hazırlık ve Besleme', 'hammadde-hazirlik-ve-besleme', 'ikasistan@bsban.com', 53, '2026-02-26 08:04:06', '2026-02-26 08:04:06'),
(55, 'Kalıplama ve Enjeksiyon', 'kaliplama-ve-enjeksiyon', 'ikasistan@bsban.com', 53, '2026-02-26 08:04:25', '2026-02-26 08:04:25'),
(56, 'Plastik Cnc/Kesim ve Şekillendirme', 'plastik-cnc-kesim-ve-sekillendirme', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:05', '2026-02-26 08:05:05'),
(57, 'Yüzey İşlem', 'yuzey-islem', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:21', '2026-02-26 08:05:21'),
(58, 'Plastik Toplama ve Montaj', 'plastik-toplama-ve-montaj', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:47', '2026-02-26 08:05:47'),
(59, 'Plastik Numune ve Ar-Ge', 'plastik-numune-ve-ar-ge', 'ikasistan@bsban.com', 53, '2026-02-26 08:06:10', '2026-02-26 08:06:10'),
(60, 'Diğer İşlemler', 'diger-islemler', '', 14, '2026-02-26 08:07:08', '2026-02-26 08:07:08'),
(61, 'Kalıphane/Kalıp Bakım', 'kaliphane-kalip-bakim', '', 60, '2026-02-26 08:08:10', '2026-02-26 08:08:10'),
(62, 'Kaynak Dışı Bağlantı Yöntemleri', 'kaynak-disi-baglanti-yontemleri', 'ikasistan@bsban.com', 60, '2026-02-26 08:08:37', '2026-02-26 08:08:37'),
(63, 'Tamir-Bakım Atölyesi', 'tamir-bakim-atolyesi', 'ikasistan@bsban.com', 60, '2026-02-26 08:09:00', '2026-02-26 08:09:00'),
(64, 'Destek İşleri', 'destek-isleri', 'ikasistan@bsban.com', 60, '2026-02-26 08:09:14', '2026-02-26 08:09:14'),
(65, 'Muhasebe ve Kayıt İşlemleri', 'muhasebe-ve-kayit-islemleri', '', 8, '2026-02-26 08:40:58', '2026-02-26 08:40:58'),
(66, 'Finans ve Nakit Yönetimi', 'finans-ve-nakit-yonetimi', '', 8, '2026-02-26 08:41:26', '2026-02-26 08:41:26'),
(67, 'Bütçe ve Raporlama', 'butce-ve-raporlama', '', 8, '2026-02-26 08:41:45', '2026-02-26 08:41:45'),
(68, 'Vergi ve Mevzuat İşleri', 'vergi-ve-mevzuat-isleri', '', 8, '2026-02-26 08:42:07', '2026-02-26 08:42:07'),
(69, 'Maliyet Muhasebesi', 'maliyet-muhasebesi', '', 8, '2026-02-26 08:42:20', '2026-02-26 08:42:20'),
(70, 'Mali İşler Yönetimi', 'mali-isler-yonetimi', '', 8, '2026-02-26 08:42:41', '2026-02-26 08:42:41'),
(71, 'Depo Yönetimi', 'depo-yonetimi', '', 8, '2026-02-26 08:43:06', '2026-02-26 08:43:06'),
(72, 'Operasyonel Satın Alma', 'operasyonel-satin-alma', '', 13, '2026-02-26 08:43:44', '2026-02-26 08:43:44'),
(73, 'Stratejik Satın Alma', 'stratejik-satin-alma', '', 13, '2026-02-26 08:44:00', '2026-02-26 08:44:00'),
(74, 'Malzeme Planlama ve Stok Yönetim', 'malzeme-planlama-ve-stok-yonetim', '', 13, '2026-02-26 08:44:20', '2026-02-26 08:44:20'),
(75, 'Tedarikçi İlişkileri ve Denetim', 'tedarikci-iliskileri-ve-denetim', '', 13, '2026-02-26 08:44:41', '2026-02-26 08:44:41'),
(76, 'Satın Alma Yönetimi', 'satin-alma-yonetimi', '', 13, '2026-02-26 08:45:02', '2026-02-26 08:45:02'),
(100, 'Çay ve İkram Görevlisi', 'cay-ve-ikram-gorevlisi-2', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:27', '2026-03-10 10:48:27'),
(94, 'Güvenlik Görevlisi', 'guvenlik-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:46:36', '2026-03-10 10:47:00'),
(95, 'Temizlik Görevlisi', 'temizlik-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:46:51', '2026-03-10 10:46:51'),
(96, 'Çay ve İkram Görevlisi', 'cay-ve-ikram-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:47:16', '2026-03-10 10:47:16'),
(97, 'Çay ve İkram Görevlisi', 'cay-ve-ikram-gorevlisi-1', 'ikasistan@bsban.com', 77, '2026-03-10 10:47:16', '2026-03-10 10:47:16'),
(99, 'Temizlik Personeli', 'temizlik-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:12', '2026-03-10 10:48:12'),
(86, 'İç Montaj', 'ic-montaj-1', 'ikasistan@bsban.com', 9, '2026-02-26 08:54:06', '2026-02-26 08:54:06'),
(87, 'Dış Montaj', 'dis-montaj', '', 9, '2026-02-26 08:54:19', '2026-02-26 08:54:19'),
(88, 'Teknik Servis', 'teknik-servis', '', 9, '2026-02-26 08:54:42', '2026-02-26 08:54:42'),
(89, 'Ulaşım ve Sevkiyat Destek', 'ulasim-ve-sevkiyat-destek', '', 7, '2026-02-26 08:55:08', '2026-02-26 08:55:08'),
(90, 'Sevkiyat Destek Ekibi', 'sevkiyat-destek-ekibi', '', 7, '2026-02-26 08:55:36', '2026-02-26 08:55:36'),
(91, 'Lojistik Yönetim ve Koordinasyon', 'lojistik-yonetim-ve-koordinasyon', '', 7, '2026-02-26 08:55:56', '2026-02-26 08:55:56'),
(92, 'Makine ve Ekipman Yönetimi', 'makine-ve-ekipman-yonetimi', '', 7, '2026-02-26 08:56:19', '2026-02-26 08:56:19'),
(102, 'Aşçı-Aşçı Yardımcılığı', 'asci-asci-yardimciligi', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:49', '2026-03-10 10:49:07'),
(103, 'Bulaşıkhane Personeli', 'bulasikhane-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:49:21', '2026-03-10 11:20:45'),
(104, 'Şoför', 'sofor', 'ikasistan@bsban.com', 5, '2026-03-10 10:49:30', '2026-03-10 10:49:30'),
(105, 'Meydancı', 'meydanci', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:08', '2026-03-10 10:50:08'),
(106, 'Bahçe ve Peyzaj Düzenleme Personeli', 'bahce-ve-peyzaj-duzenleme-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:35', '2026-03-10 10:50:35'),
(107, 'Ofisboy', 'ofisboy', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:45', '2026-03-10 10:50:45');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `sVKPUJUU_dd_departments`
--
ALTER TABLE `sVKPUJUU_dd_departments`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `sVKPUJUU_dd_departments`
--
ALTER TABLE `sVKPUJUU_dd_departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
