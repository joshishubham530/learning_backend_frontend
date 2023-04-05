/*
  Warnings:

  - You are about to drop the column `dateAndTime` on the `InterviewRound` table. All the data in the column will be lost.
  - Added the required column `date` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewRound" DROP COLUMN "dateAndTime",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
