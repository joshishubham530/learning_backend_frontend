/*
  Warnings:

  - You are about to drop the `CandidateSocial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Social` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateSocial" DROP CONSTRAINT "CandidateSocial_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateSocial" DROP CONSTRAINT "CandidateSocial_socialId_fkey";

-- DropTable
DROP TABLE "CandidateSocial";

-- DropTable
DROP TABLE "Social";
