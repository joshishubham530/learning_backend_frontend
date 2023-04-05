/*
  Warnings:

  - The primary key for the `InterviewRound` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `InterviewRound` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InterviewRound" DROP CONSTRAINT "InterviewRound_pkey",
ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InterviewRound_id_key" ON "InterviewRound"("id");
