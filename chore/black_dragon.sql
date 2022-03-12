-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 10, 2022 at 02:51 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `black_dragon`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_users`
--

CREATE TABLE `auth_users` (
  `id` int(11) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(80) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  `confirm` enum('1','0') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_methods`
--

CREATE TABLE `delivery_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `delivery_methods`
--

INSERT INTO `delivery_methods` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'dine in', '2022-03-10 09:34:02', '2022-03-10 02:31:08'),
(2, 'take away', '2022-03-10 09:34:02', '2022-03-10 02:31:08'),
(3, 'home delivery', '2022-03-10 09:34:02', '2022-03-10 02:31:08');

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

CREATE TABLE `histories` (
  `id` int(11) NOT NULL,
  `delivery_time` datetime NOT NULL,
  `subtotal` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `shipping_cost` int(11) NOT NULL,
  `tax_id` int(11) DEFAULT NULL,
  `delivery_method_id` int(11) DEFAULT NULL,
  `payment_method_id` int(11) DEFAULT NULL,
  `user_profile_id` int(11) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `type` enum('verify','forgot') NOT NULL,
  `code` varchar(20) NOT NULL,
  `expired` enum('1','0') NOT NULL,
  `auth_user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'cash on delivery', '2022-03-10 09:35:12', '2022-03-10 02:34:18'),
(2, 'bank account', '2022-03-10 09:35:12', '2022-03-10 02:34:18'),
(3, 'card', '2022-03-10 09:35:12', '2022-03-10 02:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` text NOT NULL,
  `stocks` int(11) NOT NULL,
  `delivery_time_start` time NOT NULL,
  `delivery_time_end` time NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_delivery_methods`
--

CREATE TABLE `product_delivery_methods` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `delivery_method_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_histories`
--

CREATE TABLE `product_histories` (
  `id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `history_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(20) NOT NULL,
  `image` text NOT NULL,
  `description` text NOT NULL,
  `normal_price` int(11) NOT NULL,
  `discount_value` int(11) NOT NULL,
  `available_start_at` datetime NOT NULL,
  `available_end_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `promotion_delivery_methods`
--

CREATE TABLE `promotion_delivery_methods` (
  `id` int(11) NOT NULL,
  `promotion_id` int(11) DEFAULT NULL,
  `delivery_method_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'regular', '2022-03-10 09:29:37', '2022-03-10 02:25:49'),
(2, 'large', '2022-03-10 09:29:37', '2022-03-10 02:25:49'),
(3, 'extra large', '2022-03-10 09:29:37', '2022-03-10 02:25:49');

-- --------------------------------------------------------

--
-- Table structure for table `sizes_for_product`
--

CREATE TABLE `sizes_for_product` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `taxes_and_fees`
--

CREATE TABLE `taxes_and_fees` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `value` decimal(11,1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `taxes_and_fees`
--

INSERT INTO `taxes_and_fees` (`id`, `name`, `value`, `created_at`, `updated_at`) VALUES
(1, 'pajak pertambahan ni', '10.0', '2022-03-10 09:37:23', '2022-03-10 02:36:27'),
(2, 'pajak bumi dan bangu', '0.5', '2022-03-10 09:37:23', '2022-03-10 02:36:27');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `display_name` varchar(80) DEFAULT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(13) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `auth_user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_users`
--
ALTER TABLE `auth_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_methods`
--
ALTER TABLE `delivery_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tax_id` (`tax_id`,`delivery_method_id`,`payment_method_id`,`user_profile_id`),
  ADD KEY `tax_id_2` (`tax_id`),
  ADD KEY `user_profile_id` (`user_profile_id`),
  ADD KEY `delivery_method_id` (`delivery_method_id`),
  ADD KEY `payment_method_id` (`payment_method_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_user_id` (`auth_user_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_delivery_methods`
--
ALTER TABLE `product_delivery_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`,`delivery_method_id`),
  ADD KEY `delivery_method_id` (`delivery_method_id`);

--
-- Indexes for table `product_histories`
--
ALTER TABLE `product_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `history_id` (`history_id`,`product_id`,`size_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion_delivery_methods`
--
ALTER TABLE `promotion_delivery_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promotion_id` (`promotion_id`,`delivery_method_id`),
  ADD KEY `delivery_method_id` (`delivery_method_id`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sizes_for_product`
--
ALTER TABLE `sizes_for_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`,`size_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Indexes for table `taxes_and_fees`
--
ALTER TABLE `taxes_and_fees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_auth_id` (`auth_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_users`
--
ALTER TABLE `auth_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_methods`
--
ALTER TABLE `delivery_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `histories`
--
ALTER TABLE `histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_delivery_methods`
--
ALTER TABLE `product_delivery_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_histories`
--
ALTER TABLE `product_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotion_delivery_methods`
--
ALTER TABLE `promotion_delivery_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sizes_for_product`
--
ALTER TABLE `sizes_for_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `taxes_and_fees`
--
ALTER TABLE `taxes_and_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `histories`
--
ALTER TABLE `histories`
  ADD CONSTRAINT `histories_ibfk_1` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profiles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `histories_ibfk_2` FOREIGN KEY (`delivery_method_id`) REFERENCES `delivery_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `histories_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `histories_ibfk_4` FOREIGN KEY (`tax_id`) REFERENCES `taxes_and_fees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD CONSTRAINT `otp_codes_ibfk_1` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_delivery_methods`
--
ALTER TABLE `product_delivery_methods`
  ADD CONSTRAINT `product_delivery_methods_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_delivery_methods_ibfk_2` FOREIGN KEY (`delivery_method_id`) REFERENCES `delivery_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_histories`
--
ALTER TABLE `product_histories`
  ADD CONSTRAINT `product_histories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_histories_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_histories_ibfk_3` FOREIGN KEY (`history_id`) REFERENCES `histories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `promotion_delivery_methods`
--
ALTER TABLE `promotion_delivery_methods`
  ADD CONSTRAINT `promotion_delivery_methods_ibfk_1` FOREIGN KEY (`delivery_method_id`) REFERENCES `delivery_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `promotion_delivery_methods_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sizes_for_product`
--
ALTER TABLE `sizes_for_product`
  ADD CONSTRAINT `sizes_for_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sizes_for_product_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
