-- AlterTable
ALTER TABLE `orders` ADD COLUMN `isManuallyEdited` BOOLEAN NOT NULL DEFAULT false;
