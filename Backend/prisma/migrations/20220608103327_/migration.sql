/*
  Warnings:

  - You are about to drop the column `aboutMe` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `profileViewed` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LastApplied` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkExperience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "LastApplied" DROP CONSTRAINT "LastApplied_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "LastApplied" DROP CONSTRAINT "LastApplied_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_CandidateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_companyId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "aboutMe",
DROP COLUMN "profileViewed",
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "resumeKey" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT E'SOURCED';

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyId";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "LastApplied";

-- DropTable
DROP TABLE "Resume";

-- DropTable
DROP TABLE "WorkExperience";
