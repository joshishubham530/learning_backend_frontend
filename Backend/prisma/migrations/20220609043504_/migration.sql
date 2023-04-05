/*
  Warnings:

  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_CandidateId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "currJobTitle" TEXT,
ADD COLUMN     "currentSalary" INTEGER,
ADD COLUMN     "currentSalaryUnit" TEXT,
ADD COLUMN     "expectedSalary" INTEGER,
ADD COLUMN     "expectedSalaryUnit" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "qualification" TEXT;

-- DropTable
DROP TABLE "Education";
