/*
  Warnings:

  - You are about to drop the column `rejected` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "rejected",
ADD COLUMN     "archived" INTEGER NOT NULL DEFAULT 0;
