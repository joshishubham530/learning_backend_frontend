/*
  Warnings:

  - You are about to drop the column `recoveryCode` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryCode` on the `Employee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Candidate_email_recoveryCode_key";

-- DropIndex
DROP INDEX "Employee_email_recoveryCode_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "recoveryCode";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "recoveryCode";
