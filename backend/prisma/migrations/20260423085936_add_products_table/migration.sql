-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `wooProductId` INTEGER NULL;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `wooProductId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `permalink` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `price` DOUBLE NULL,
    `regularPrice` DOUBLE NULL,
    `salePrice` DOUBLE NULL,
    `onSale` BOOLEAN NOT NULL DEFAULT false,
    `sku` VARCHAR(191) NULL,
    `manageStock` BOOLEAN NOT NULL DEFAULT false,
    `stockQuantity` INTEGER NULL,
    `stockStatus` VARCHAR(191) NOT NULL DEFAULT 'instock',
    `weight` DOUBLE NULL,
    `dimensions` JSON NULL,
    `categories` JSON NULL,
    `images` JSON NULL,
    `attributes` JSON NULL,
    `syncedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `products_storeId_idx`(`storeId`),
    INDEX `products_status_idx`(`status`),
    UNIQUE INDEX `products_storeId_wooProductId_key`(`storeId`, `wooProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
