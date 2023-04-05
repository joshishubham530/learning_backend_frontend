/*
  Warnings:

  - You are about to drop the column `name` on the `InterviewRound` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `InterviewRound` table. All the data in the column will be lost.
  - Added the required column `interviewerId` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `InterviewRound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewRound" DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "interviewerId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "InterviewRound" ADD CONSTRAINT "InterviewRound_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
