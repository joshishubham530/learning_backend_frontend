/*
  Warnings:

  - You are about to drop the column `address` on the `Education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL DEFAULT E'Mohali, India';

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "address",
ADD COLUMN     "institute" TEXT NOT NULL DEFAULT E'St. Theresa Se. Sec. School',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT E'COMPLETED',
ALTER COLUMN "endDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "comoanyId" INTEGER NOT NULL,
    "companyName" TEXT,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "description" TEXT,
    "CandidateId" INTEGER NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_CandidateId_fkey" FOREIGN KEY ("CandidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_comoanyId_fkey" FOREIGN KEY ("comoanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
