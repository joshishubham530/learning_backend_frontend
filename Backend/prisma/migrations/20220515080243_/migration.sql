-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "city" DROP DEFAULT;

-- CreateTable
CREATE TABLE "CandidateForJobs" (
    "candidateId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "CandidateForJobs_pkey" PRIMARY KEY ("candidateId","jobId")
);

-- AddForeignKey
ALTER TABLE "CandidateForJobs" ADD CONSTRAINT "CandidateForJobs_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateForJobs" ADD CONSTRAINT "CandidateForJobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
