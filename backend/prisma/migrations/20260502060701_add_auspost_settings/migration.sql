-- AlterTable
ALTER TABLE `stores` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `countryCode` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `postcode` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `suburb` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `auspost_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountMode` ENUM('SANDBOX', 'PRODUCTION') NOT NULL,
    `apiKey` VARCHAR(191) NOT NULL,
    `apiPassword` VARCHAR(191) NOT NULL,
    `combineConsignment` ENUM('YES', 'NO') NOT NULL,
    `allowPartialDelivery` ENUM('YES', 'NO') NOT NULL,
    `postBranding` ENUM('YES', 'NO') NOT NULL,
    `labelLayoutParcel` VARCHAR(191) NOT NULL,
    `labelLayoutExpress` VARCHAR(191) NOT NULL,
    `leftSideSpace` VARCHAR(191) NOT NULL,
    `topSideSpace` VARCHAR(191) NOT NULL,
    `streetType` VARCHAR(191) NULL,
    `autoPrint` ENUM('YES', 'NO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `auspost_settings_storeId_key`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auspost_settings` ADD CONSTRAINT `auspost_settings_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
