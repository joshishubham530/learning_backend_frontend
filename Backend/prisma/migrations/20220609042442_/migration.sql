/*
  Warnings:

  - You are about to drop the column `totalApplication` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `totalInterview` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "totalApplication",
DROP COLUMN "totalInterview",
DROP COLUMN "userName";
