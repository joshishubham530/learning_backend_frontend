/*
  Warnings:

  - You are about to drop the column `jobId` on the `InterviewRound` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewRound" DROP CONSTRAINT "InterviewRound_jobId_fkey";

-- AlterTable
ALTER TABLE "InterviewRound" DROP COLUMN "jobId";
