-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 94.138.200.80
-- Üretim Zamanı: 10 Mar 2026, 11:31:01
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
-- Tablo için tablo yapısı `sVKPUJUU_dd_submission_comments`
--

CREATE TABLE `sVKPUJUU_dd_submission_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `submission_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Tablo döküm verisi `sVKPUJUU_dd_submission_comments`
--

INSERT INTO `sVKPUJUU_dd_submission_comments` (`id`, `submission_id`, `user_id`, `comment`, `rating`, `is_private`, `created_at`) VALUES
(1, 27, 9, 'Çok iyi geçti', 5, 0, '2026-02-19 10:16:10'),
(2, 30, 7, 'Görüşmeye davet edilecek', 3, 0, '2026-02-24 07:58:29'),
(3, 28, 7, 'Usta yardımcısı, Kalfa olarak ihtiyaç halinde değerlendirilebilir.', 3, 0, '2026-02-24 07:59:44'),
(4, 21, 7, 'maaş beklentisi standartlarımızın üzerinde / olumsuz', 1, 0, '2026-02-24 08:03:28'),
(5, 37, 7, 'Deneyim mevcut, ikamet uygun, seyahat engeli mevcut, imalat çizim deneyimi mevcut, şantiye şefi olarak seyahat engeli nedeniyle olumsuz, Teknik Ressam olarak değerlendirilebilir.', 3, 0, '2026-03-05 09:21:56'),
(6, 39, 7, 'Deneyimli, İhtiyaç durumunda iletişime geçilecek.', 4, 0, '2026-03-06 07:07:12'),
(7, 40, 7, 'Tasarım, saha şefi ve imalat çizim deneyimleri mevcut, İkamet uygun, Yakın sürede referans incelemesine istinaden ön görüşme planlanacak.', 4, 0, '2026-03-10 07:31:07'),
(8, 38, 7, 'Şantiye  - saha şefi olarak değerlendirilebilir. \r\nSIEMENS ofis yenileme şantiyesinde stajını tamamlamış.', 3, 0, '2026-03-10 07:36:26');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `sVKPUJUU_dd_submission_comments`
--
ALTER TABLE `sVKPUJUU_dd_submission_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `rating` (`rating`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `sVKPUJUU_dd_submission_comments`
--
ALTER TABLE `sVKPUJUU_dd_submission_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
