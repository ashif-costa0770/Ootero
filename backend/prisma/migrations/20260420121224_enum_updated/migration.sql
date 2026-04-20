/*
  Warnings:

  - The values [WOOCOMMERCE,SHOPIFY,EBAY,MAGENTO,BIGCOMMERCE] on the enum `Store_platform` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `Store_userId_storeUrl_key` ON `store`;

-- AlterTable
ALTER TABLE `store` MODIFY `platform` ENUM('woocommerce', 'shopify', 'ebay', 'magento', 'bigcommerce', 'prestashop') NOT NULL;
