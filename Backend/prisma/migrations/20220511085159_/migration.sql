/*
  Warnings:

  - You are about to drop the column `address` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `watsapp` on the `Candidate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Candidate_watsapp_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "address",
DROP COLUMN "watsapp",
ADD COLUMN     "social" TEXT;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "address" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Education" ALTER COLUMN "institute" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);
