/*
  Warnings:

  - A unique constraint covering the columns `[email,recoveryCode]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_recoveryCode_key" ON "Candidate"("email", "recoveryCode");
