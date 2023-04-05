/*
  Warnings:

  - You are about to drop the column `mode` on the `Job` table. All the data in the column will be lost.
  - The `type` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "mode",
ADD COLUMN     "city" TEXT NOT NULL DEFAULT E'Mohali',
ADD COLUMN     "keywords" TEXT[],
DROP COLUMN "type",
ADD COLUMN     "type" TEXT[];
