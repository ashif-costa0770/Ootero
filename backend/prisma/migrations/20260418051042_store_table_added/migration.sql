-- CreateTable
CREATE TABLE `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `platform` ENUM('WOOCOMMERCE', 'SHOPIFY', 'EBAY', 'MAGENTO', 'BIGCOMMERCE') NOT NULL,
    `storeUrl` VARCHAR(191) NULL,
    `consumerKey` VARCHAR(191) NULL,
    `consumerSecret` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Store_userId_idx`(`userId`),
    INDEX `Store_platform_idx`(`platform`),
    UNIQUE INDEX `Store_userId_storeUrl_key`(`userId`, `storeUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
