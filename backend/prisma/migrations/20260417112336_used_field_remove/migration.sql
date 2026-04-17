/*
  Warnings:

  - You are about to drop the column `used` on the `passwordresettoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `passwordresettoken` DROP COLUMN `used`;
