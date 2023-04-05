/*
  Warnings:

  - You are about to drop the column `comoanyId` on the `WorkExperience` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_comoanyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "benefits" TEXT[];

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "jobReq" TEXT[],
ADD COLUMN     "jobRes" TEXT[];

-- AlterTable
ALTER TABLE "WorkExperience" DROP COLUMN "comoanyId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
