-- AlterTable
ALTER TABLE `orders` ADD COLUMN `billingCompany` VARCHAR(191) NULL,
    ADD COLUMN `billingEmail` VARCHAR(191) NULL,
    ADD COLUMN `billingFirstName` VARCHAR(191) NULL,
    ADD COLUMN `billingLastName` VARCHAR(191) NULL,
    ADD COLUMN `billingPhone` VARCHAR(191) NULL,
    ADD COLUMN `shippingCompany` VARCHAR(191) NULL,
    ADD COLUMN `shippingFirstName` VARCHAR(191) NULL,
    ADD COLUMN `shippingLastName` VARCHAR(191) NULL,
    ADD COLUMN `shippingPhone` VARCHAR(191) NULL;
