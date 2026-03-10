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
(5, 'İDARİ İŞLER', 'idari-isler', '', 0, '2025-11-25 07:04:29', '2025-11-25 07:05:23'),
(2, 'Grafik Tasarım', 'grafik-tasarim', '', 3, '2025-11-24 10:21:58', '2025-11-24 10:22:40'),
(4, 'BİLGİ İŞLEM', 'bilgi-islem', 'keremyagiz@bsban.com', 0, '2025-11-25 06:11:20', '2025-12-03 09:45:11'),
(28, 'EBATLAMA', 'ebatlama', 'ikasistan@bsban.com', 23, '2026-02-25 11:23:31', '2026-02-25 11:37:17'),
(7, 'LOJİSTİK', 'lojistik', '', 0, '2025-11-25 07:59:28', '2025-11-25 07:59:28'),
(8, 'MALİ İŞLER', 'mali-isler', '', 0, '2025-11-25 08:42:10', '2025-11-25 08:42:10'),
(9, 'MONTAJ VE MÜŞTERİ DESTEK HİZMETLERİ', 'montaj-ve-musteri-destek-hizmetleri', '', 0, '2025-11-25 10:42:51', '2025-11-25 10:51:25'),
(10, 'MÜŞTERİ TEMSİLCİLİĞİ', 'musteri-temsilciligi', '', 0, '2025-11-26 08:46:07', '2025-11-26 08:48:06'),
(11, 'PAZARLAMA', 'pazarlama', '', 0, '2025-11-26 09:59:12', '2025-11-26 09:59:34'),
(12, 'PROJE ve İÇ MİMARLIK', 'proje-ve-ic-mimarlik', '', 0, '2025-12-03 06:00:26', '2026-02-19 10:42:34'),
(13, 'SATIN ALMA', 'satin-alma', '', 0, '2025-12-03 06:37:12', '2025-12-03 06:41:15'),
(14, 'ÜRETİM', 'uretim', 'ikasistan@bsban.com', 0, '2025-12-03 07:02:51', '2026-02-25 12:30:55'),
(98, 'GÜVENLİK GÖREVLİSİ', 'guvenlik-gorevlisi-1', 'ikasistan@bsban.com', 5, '2026-03-10 10:47:52', '2026-03-10 10:47:52'),
(93, 'MARANGOZ', 'marangoz', 'ik@bsban.com', 24, '2026-03-05 06:50:51', '2026-03-05 06:50:51'),
(101, 'TEKNİK PERSONEL', 'teknik-personel', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:40', '2026-03-10 10:48:40'),
(24, 'AHŞAP ÜRETİM', 'ahsap-uretim', '', 14, '2026-02-25 10:13:18', '2026-02-26 06:58:51'),
(25, 'EBATLAMA VE KESİM', 'ebatlama-ve-kesim', '', 24, '2026-02-25 10:13:45', '2026-02-25 10:13:45'),
(26, 'ELEKTRİK ÜRETİM', 'elektrik-uretim', '', 14, '2026-02-25 10:14:17', '2026-02-25 10:14:17'),
(23, 'METAL ÜRETİM', 'metal-uretim', '', 14, '2026-02-24 12:17:30', '2026-02-24 12:17:30'),
(27, 'KABLO HAZIRLAMA VE KESİM', 'kablo-hazirlama-ve-kesim', '', 26, '2026-02-25 10:14:40', '2026-02-25 10:14:40'),
(22, 'CNC MAKİNE İŞLEMLERİ', 'cnc-makine-islemleri', 'ikasistan@bsban.com', 23, '2026-02-24 11:59:33', '2026-02-25 10:11:30'),
(29, 'KAYNAK', 'kaynak', 'ikasistan@bsban.com', 23, '2026-02-25 12:37:08', '2026-02-25 12:37:08'),
(30, 'TESVİYE', 'tesviye', 'ikasistan@bsban.com', 23, '2026-02-25 13:13:41', '2026-02-25 13:13:41'),
(31, 'METAL BOYA-CİLA', 'metal-boya-cila', 'ikasistan@bsban.com', 23, '2026-02-26 06:41:46', '2026-02-26 06:41:46'),
(32, 'TOPLAMA-MONTAJ', 'toplama-montaj', 'ikasistan@bsban.com', 23, '2026-02-26 06:42:12', '2026-02-26 06:42:12'),
(33, 'NUMUNE & AR-GE', 'numune-ar-ge', '', 23, '2026-02-26 06:42:57', '2026-02-26 06:42:57'),
(34, 'KAPLAMA VE PRESLEME', 'kaplama-ve-presleme', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:08', '2026-02-26 07:01:08'),
(35, 'ZIMPARA', 'zimpara', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:39', '2026-02-26 07:01:39'),
(36, 'AHŞAP BOYA-CİLA', 'ahsap-boya-cila', 'ikasistan@bsban.com', 24, '2026-02-26 07:01:57', '2026-02-26 07:01:57'),
(37, 'TOPLAMA-MONTAJ', 'toplama-montaj-1', 'ikasistan@bsban.com', 24, '2026-02-26 07:53:44', '2026-02-26 07:53:44'),
(38, 'CNC ve ÖZEL İŞLEMLER', 'cnc-ve-ozel-islemler', 'ikasistan@bsban.com', 24, '2026-02-26 07:54:25', '2026-02-26 07:54:25'),
(39, 'NUMUNE ve AR-GE', 'numune-ve-ar-ge', 'ikasistan@bsban.com', 24, '2026-02-26 07:54:48', '2026-02-26 07:54:48'),
(40, 'DÖŞEME ÜRETİM', 'doseme-uretim', '', 14, '2026-02-26 07:55:09', '2026-02-26 07:55:09'),
(41, 'İSKELET KONTROL VE HAZIRLIK', 'iskelet-kontrol-ve-hazirlik', 'ikasistan@bsban.com', 40, '2026-02-26 07:55:32', '2026-02-26 07:55:32'),
(42, 'ELASTİK KATMANLAR MONTAJI', 'elastik-katmanlar-montaji', 'ikasistan@bsban.com', 40, '2026-02-26 07:56:27', '2026-02-26 07:56:27'),
(43, 'SÜNGER-DOLGU UYGULAMASI', 'sunger-dolgu-uygulamasi', 'ikasistan@bsban.com', 40, '2026-02-26 07:56:54', '2026-02-26 07:56:54'),
(44, 'DİKİŞ ve KILIF HAZIRLIĞI', 'dikis-ve-kilif-hazirligi', 'ikasistan@bsban.com', 40, '2026-02-26 07:57:19', '2026-02-26 07:57:19'),
(45, 'KILIF GİYDİRME ve DÖŞEME MONTAJI', 'kilif-giydirme-ve-doseme-montaji', 'ikasistan@bsban.com', 40, '2026-02-26 07:57:46', '2026-02-26 07:57:46'),
(46, 'ELEKTRİK MONTAJ PERSONELİ', 'elektrik-montaj-personeli', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:04', '2026-02-26 08:01:04'),
(47, 'KABLOLAMA ve İÇ TESİSAT DÖŞEME', 'kablolama-ve-ic-tesisat-doseme', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:30', '2026-02-26 08:01:30'),
(48, 'ELEKTRİK İÇ MONTAJ', 'elektrik-ic-montaj', 'ikasistan@bsban.com', 26, '2026-02-26 08:01:50', '2026-02-26 08:01:50'),
(49, 'İÇ MONTAJ', 'ic-montaj', '', 14, '2026-02-26 08:02:02', '2026-02-26 08:02:02'),
(50, 'ANA GÖVDE MONTAJI', 'ana-govde-montaji', 'ikasistan@bsban.com', 49, '2026-02-26 08:02:27', '2026-02-26 08:02:27'),
(51, 'AKSESUAR ve TAMAMLAYICI MONTAJ', 'aksesuar-ve-tamamlayici-montaj', 'ikasistan@bsban.com', 49, '2026-02-26 08:02:54', '2026-02-26 08:02:54'),
(52, 'KONTROL SON HAZIRLIK MONTAJI', 'kontrol-son-hazirlik-montaji', 'ikasistan@bsban.com', 49, '2026-02-26 08:03:19', '2026-02-26 08:03:19'),
(53, 'PLASTİK ÜRETİM', 'plastik-uretim', '', 14, '2026-02-26 08:03:32', '2026-02-26 08:03:32'),
(54, 'HAMMADDE HAZIRLIK ve BESLEME', 'hammadde-hazirlik-ve-besleme', 'ikasistan@bsban.com', 53, '2026-02-26 08:04:06', '2026-02-26 08:04:06'),
(55, 'KALIPLAMA ve ENJEKSİYON', 'kaliplama-ve-enjeksiyon', 'ikasistan@bsban.com', 53, '2026-02-26 08:04:25', '2026-02-26 08:04:25'),
(56, 'PLASTİK CNC/KESİM ve ŞEKİLLENDİRME', 'plastik-cnc-kesim-ve-sekillendirme', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:05', '2026-02-26 08:05:05'),
(57, 'YÜZEY İŞLEM', 'yuzey-islem', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:21', '2026-02-26 08:05:21'),
(58, 'PLASTİK TOPLAMA ve MONTAJ', 'plastik-toplama-ve-montaj', 'ikasistan@bsban.com', 53, '2026-02-26 08:05:47', '2026-02-26 08:05:47'),
(59, 'PLASTİK NUMUNE ve AR-GE', 'plastik-numune-ve-ar-ge', 'ikasistan@bsban.com', 53, '2026-02-26 08:06:10', '2026-02-26 08:06:10'),
(60, 'DİĞER İŞLEMLER', 'diger-islemler', '', 14, '2026-02-26 08:07:08', '2026-02-26 08:07:08'),
(61, 'KALIPHANE/KALIP BAKIM', 'kaliphane-kalip-bakim', '', 60, '2026-02-26 08:08:10', '2026-02-26 08:08:10'),
(62, 'KAYNAK DIŞI BAĞLANTI YÖNTEMLERİ', 'kaynak-disi-baglanti-yontemleri', 'ikasistan@bsban.com', 60, '2026-02-26 08:08:37', '2026-02-26 08:08:37'),
(63, 'TAMİR-BAKIM ATÖLYESİ', 'tamir-bakim-atolyesi', 'ikasistan@bsban.com', 60, '2026-02-26 08:09:00', '2026-02-26 08:09:00'),
(64, 'DESTEK İŞLERİ', 'destek-isleri', 'ikasistan@bsban.com', 60, '2026-02-26 08:09:14', '2026-02-26 08:09:14'),
(65, 'MUHASEBE ve KAYIT İŞLEMLERİ', 'muhasebe-ve-kayit-islemleri', '', 8, '2026-02-26 08:40:58', '2026-02-26 08:40:58'),
(66, 'FİNANS ve NAKİT YÖNETİMİ', 'finans-ve-nakit-yonetimi', '', 8, '2026-02-26 08:41:26', '2026-02-26 08:41:26'),
(67, 'BÜTÇE ve RAPORLAMA', 'butce-ve-raporlama', '', 8, '2026-02-26 08:41:45', '2026-02-26 08:41:45'),
(68, 'VERGİ ve MEVZUAT İŞLERİ', 'vergi-ve-mevzuat-isleri', '', 8, '2026-02-26 08:42:07', '2026-02-26 08:42:07'),
(69, 'MALİYET MUHASEBESİ', 'maliyet-muhasebesi', '', 8, '2026-02-26 08:42:20', '2026-02-26 08:42:20'),
(70, 'MALİ İŞLER YÖNETİMİ', 'mali-isler-yonetimi', '', 8, '2026-02-26 08:42:41', '2026-02-26 08:42:41'),
(71, 'DEPO YÖNETİMİ', 'depo-yonetimi', '', 8, '2026-02-26 08:43:06', '2026-02-26 08:43:06'),
(72, 'OPERASYONEL SATIN ALMA', 'operasyonel-satin-alma', '', 13, '2026-02-26 08:43:44', '2026-02-26 08:43:44'),
(73, 'STRATEJİK SATIN ALMA', 'stratejik-satin-alma', '', 13, '2026-02-26 08:44:00', '2026-02-26 08:44:00'),
(74, 'MALZEME PLANLAMA ve STOK YÖNETİM', 'malzeme-planlama-ve-stok-yonetim', '', 13, '2026-02-26 08:44:20', '2026-02-26 08:44:20'),
(75, 'TEDARİKÇİ İLİŞKİLERİ VE DENETİM', 'tedarikci-iliskileri-ve-denetim', '', 13, '2026-02-26 08:44:41', '2026-02-26 08:44:41'),
(76, 'SATIN ALMA YÖNETİMİ', 'satin-alma-yonetimi', '', 13, '2026-02-26 08:45:02', '2026-02-26 08:45:02'),
(100, 'ÇAY VE İKRAM GÖREVLİSİ', 'cay-ve-ikram-gorevlisi-2', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:27', '2026-03-10 10:48:27'),
(94, 'GÜVENLİK GÖREVLİSİ', 'guvenlik-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:46:36', '2026-03-10 10:47:00'),
(95, 'TEMİZLİK GÖREVLİSİ', 'temizlik-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:46:51', '2026-03-10 10:46:51'),
(96, 'ÇAY VE İKRAM GÖREVLİSİ', 'cay-ve-ikram-gorevlisi', 'ikasistan@bsban.com', 77, '2026-03-10 10:47:16', '2026-03-10 10:47:16'),
(97, 'ÇAY VE İKRAM GÖREVLİSİ', 'cay-ve-ikram-gorevlisi-1', 'ikasistan@bsban.com', 77, '2026-03-10 10:47:16', '2026-03-10 10:47:16'),
(99, 'TEMİZLİK PERSONELİ', 'temizlik-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:12', '2026-03-10 10:48:12'),
(86, 'İÇ MONTAJ', 'ic-montaj-1', 'ikasistan@bsban.com', 9, '2026-02-26 08:54:06', '2026-02-26 08:54:06'),
(87, 'DIŞ MONTAJ', 'dis-montaj', '', 9, '2026-02-26 08:54:19', '2026-02-26 08:54:19'),
(88, 'TEKNİK SERVİS', 'teknik-servis', '', 9, '2026-02-26 08:54:42', '2026-02-26 08:54:42'),
(89, 'ULAŞIM ve SEVKİYAT DESTEK', 'ulasim-ve-sevkiyat-destek', '', 7, '2026-02-26 08:55:08', '2026-02-26 08:55:08'),
(90, 'SEVKİYAT DESTEK EKİBİ', 'sevkiyat-destek-ekibi', '', 7, '2026-02-26 08:55:36', '2026-02-26 08:55:36'),
(91, 'LOJİSTİK YÖNETİM ve KOORDİNASYON', 'lojistik-yonetim-ve-koordinasyon', '', 7, '2026-02-26 08:55:56', '2026-02-26 08:55:56'),
(92, 'MAKİNE ve EKİPMAN YÖNETİMİ', 'makine-ve-ekipman-yonetimi', '', 7, '2026-02-26 08:56:19', '2026-02-26 08:56:19'),
(102, 'AŞÇI-AŞÇI YARDIMCILIĞI', 'asci-asci-yardimciligi', 'ikasistan@bsban.com', 5, '2026-03-10 10:48:49', '2026-03-10 10:49:07'),
(103, 'BULAŞIKHANE PERSONELİ', 'bulasikhane-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:49:21', '2026-03-10 11:20:45'),
(104, 'ŞOFÖR', 'sofor', 'ikasistan@bsban.com', 5, '2026-03-10 10:49:30', '2026-03-10 10:49:30'),
(105, 'MEYDANCI', 'meydanci', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:08', '2026-03-10 10:50:08'),
(106, 'BAHÇE ve PEYZAJ DÜZENLEME PERSONELİ', 'bahce-ve-peyzaj-duzenleme-personeli', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:35', '2026-03-10 10:50:35'),
(107, 'OFİSBOY', 'ofisboy', 'ikasistan@bsban.com', 5, '2026-03-10 10:50:45', '2026-03-10 10:50:45');

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
