/*
  Warnings:

  - Made the column `recoveryCode` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "recoveryCode" SET NOT NULL;
