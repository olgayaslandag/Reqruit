-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 94.138.200.80
-- Üretim Zamanı: 10 Mar 2026, 11:30:56
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
-- Tablo için tablo yapısı `sVKPUJUU_dd_submissions`
--

CREATE TABLE `sVKPUJUU_dd_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `form_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Tablo döküm verisi `sVKPUJUU_dd_submissions`
--

INSERT INTO `sVKPUJUU_dd_submissions` (`id`, `form_id`, `created_at`) VALUES
(1, 10, '2025-12-30 17:22:44'),
(2, 7, '2026-02-03 12:12:27'),
(3, 10, '2026-02-08 12:43:45'),
(4, 10, '2026-02-10 06:40:56'),
(5, 11, '2026-02-10 10:41:49'),
(6, 11, '2026-02-10 10:58:31'),
(7, 11, '2026-02-10 13:40:58'),
(8, 11, '2026-02-10 13:59:28'),
(9, 11, '2026-02-11 11:33:20'),
(10, 11, '2026-02-11 11:33:52'),
(11, 11, '2026-02-11 11:52:26'),
(12, 9, '2026-02-11 11:57:39'),
(13, 11, '2026-02-11 12:16:44'),
(14, 13, '2026-02-11 12:26:44'),
(15, 11, '2026-02-11 12:40:45'),
(16, 11, '2026-02-11 12:42:40'),
(17, 11, '2026-02-11 13:03:08'),
(18, 11, '2026-02-11 13:17:14'),
(19, 11, '2026-02-11 15:37:29'),
(20, 11, '2026-02-12 10:53:56'),
(21, 11, '2026-02-14 11:13:50'),
(22, 3, '2026-02-14 13:25:24'),
(23, 3, '2026-02-14 13:25:25'),
(24, 3, '2026-02-14 13:25:27'),
(25, 3, '2026-02-14 14:15:35'),
(26, 11, '2026-02-15 21:03:53'),
(27, 11, '2026-02-16 16:46:40'),
(28, 13, '2026-02-20 12:44:17'),
(29, 13, '2026-02-20 13:06:05'),
(30, 13, '2026-02-20 13:06:06'),
(31, 87, '2026-03-04 15:45:34'),
(32, 87, '2026-03-05 06:19:18'),
(33, 11, '2026-03-05 06:41:43'),
(34, 11, '2026-03-05 07:08:48'),
(35, 11, '2026-03-05 07:48:02'),
(36, 11, '2026-03-05 07:57:07'),
(37, 11, '2026-03-05 08:42:47'),
(38, 11, '2026-03-05 11:51:35'),
(39, 11, '2026-03-05 15:01:48'),
(40, 11, '2026-03-09 15:20:00');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `sVKPUJUU_dd_submissions`
--
ALTER TABLE `sVKPUJUU_dd_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_id` (`form_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `sVKPUJUU_dd_submissions`
--
ALTER TABLE `sVKPUJUU_dd_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
