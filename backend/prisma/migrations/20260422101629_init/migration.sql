-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `shipmentRange` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verificationToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    INDEX `password_reset_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `platform` ENUM('woocommerce', 'shopify', 'ebay', 'magento', 'bigcommerce', 'prestashop') NOT NULL,
    `storeUrl` VARCHAR(191) NULL,
    `consumerKey` VARCHAR(191) NULL,
    `consumerSecret` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stores_userId_idx`(`userId`),
    INDEX `stores_platform_idx`(`platform`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `wooOrderId` INTEGER NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `fulfillmentStatus` VARCHAR(191) NOT NULL DEFAULT 'unfulfilled',
    `needsProcessing` BOOLEAN NOT NULL DEFAULT false,
    `currency` VARCHAR(191) NOT NULL,
    `currencySymbol` VARCHAR(191) NULL,
    `totalAmount` DOUBLE NOT NULL,
    `shippingTotal` DOUBLE NOT NULL DEFAULT 0,
    `taxTotal` DOUBLE NOT NULL DEFAULT 0,
    `totalDiscount` DOUBLE NOT NULL DEFAULT 0,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentMethodTitle` VARCHAR(191) NULL,
    `shippingMethod` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NULL,
    `billingAddress1` VARCHAR(191) NULL,
    `billingAddress2` VARCHAR(191) NULL,
    `billingCity` VARCHAR(191) NULL,
    `billingState` VARCHAR(191) NULL,
    `billingPostcode` VARCHAR(191) NULL,
    `billingCountry` VARCHAR(191) NULL,
    `shippingAddress1` VARCHAR(191) NULL,
    `shippingAddress2` VARCHAR(191) NULL,
    `shippingCity` VARCHAR(191) NULL,
    `shippingState` VARCHAR(191) NULL,
    `shippingPostcode` VARCHAR(191) NULL,
    `shippingCountry` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `datePaid` DATETIME(3) NULL,
    `dateCompleted` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `syncedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `orders_storeId_idx`(`storeId`),
    INDEX `orders_status_idx`(`status`),
    INDEX `orders_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `orders_storeId_wooOrderId_key`(`storeId`, `wooOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL DEFAULT 0,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
