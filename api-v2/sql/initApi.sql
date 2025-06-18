-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        8.0.31 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 正在导出表  616_storage_system.api 的数据：~38 rows (大约)
INSERT INTO `api` (`id`, `name`, `url`, `access`, `updateDate`) VALUES
	(1, '獲取設定', '/setting/readSetting', '*', '2024-10-30 17:05:11'),
	(2, '獲取訂單', '/order/readOrder', '*', '2024-10-30 17:05:05'),
	(3, '獲取產品', '/product/readProduct', '*', '2024-12-12 15:06:43'),
	(4, '獲取商店', '/shop/readShop', '*', '2024-10-30 17:05:21'),
	(5, '獲取用戶', '/member/readMember', '-1', '2025-06-09 16:42:01'),
	(6, '獲取分區', '/shop/readPartition', '*', '2024-10-30 17:05:16'),
	(7, '獲取分店禁售列表', '/shop/readBindProduct', '*', '2024-10-30 17:05:14'),
	(8, '獲取分店倉存', '/inventory/readInventory', '*', '2024-10-30 17:05:02'),
	(9, '更新设定', '/setting/updateSetting', '-1', '2025-03-05 15:12:41'),
	(10, '獲取全部設定', '/setting/readAllSetting', '-1', '2025-03-05 15:12:36'),
	(11, '獲取訂單明細', '/order/readOrderDetail', '*', '2024-10-30 18:51:18'),
	(12, '創建訂單', '/order/createOrder', '0,1,2', '2025-06-09 16:14:44'),
	(13, '追加訂單明細', '/order/createAdditionOrder', '2,3', '2024-10-30 18:56:27'),
	(14, '更改分配數量', '/order/updateAssignQuantity', '2,3', '2024-10-30 18:56:03'),
	(15, '檢查重複的訂單', '/order/checkOrderRepeated', '*', '2024-10-30 18:10:59'),
	(16, '導出每日匯總', '/order/exportDailyMeetSummary', '2,3', '2024-10-30 18:56:33'),
	(17, '獲取歷史訂單', '/order/readHistoryOrder', '*', '2024-10-30 17:13:32'),
	(18, '新增用戶', '/member/register', '-1', '2025-06-09 16:26:18'),
	(19, '登出', '/member/logout', '*', '2024-10-30 17:02:44'),
	(20, '更新用戶', '/member/updateMember', '-1', '2025-03-05 15:12:25'),
	(21, '刪除用戶', '/member/deleteMember', '-1', '2025-03-05 15:12:22'),
	(22, '創建產品', '/product/createProduct', '-1', '2025-03-05 15:12:29'),
	(23, '更新產品', '/product/updateProduct', '-1', '2025-03-05 15:12:34'),
	(24, '刪除產品', '/product/deleteProduct', '-1', '2025-03-05 15:12:31'),
	(26, '創建商店', '/shop/createShop', '-1', '2025-03-05 15:12:48'),
	(27, '創建分區', '/shop/createPartition', '-1', '2025-03-05 15:12:46'),
	(28, '更新商店', '/shop/updateShop', '-1', '2025-03-05 15:12:59'),
	(29, '刪除分區', '/shop/deletePartition', '-1', '2025-03-05 15:12:50'),
	(30, '刪除商店', '/shop/deleteShop', '-1', '2025-03-05 15:12:52'),
	(31, '綁定分店禁售產品', '/shop/bindProductToShop', '-1', '2025-03-05 15:12:43'),
	(32, '分店排序', '/shop/setShopOrder', '-1', '2025-03-05 15:12:57'),
	(33, '創建盤點記錄', '/inventory/createInventory', '0,1', '2024-10-30 18:49:45'),
	(34, '更新盤點記錄', '/inventory/updateInventory', '0,1', '2024-10-30 18:49:42'),
	(35, '檢查重複的盤點記錄', '/inventory/checkInventoryRepeated', '0,1', '2024-10-30 18:49:31'),
	(36, '獲取API列表', '/api/readApi', '-1', '2025-03-05 15:12:13'),
	(37, '更新API列表', '/api/updateApi', '-1', '2025-03-05 15:12:16'),
	(38, '創建API', '/api/createApi', '-1', '2025-03-05 15:12:09'),
	(39, '獲取訂單明細項匯總', '/order/readOrderDatailSummary', '-1', '2025-06-16 13:56:13');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
