/*
  Warnings:

  - You are about to drop the column `preOnboarding` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CandidateForJobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "preOnboarding",
DROP COLUMN "stage";

-- AlterTable
ALTER TABLE "CandidateForJobs" DROP COLUMN "status",
ADD COLUMN     "preOnboarding" TEXT,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT E'SOURCED';
