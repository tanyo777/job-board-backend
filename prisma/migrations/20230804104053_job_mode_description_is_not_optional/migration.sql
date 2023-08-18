/*
  Warnings:

  - Made the column `description` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `jobs` MODIFY `description` VARCHAR(191) NOT NULL DEFAULT 'none';
