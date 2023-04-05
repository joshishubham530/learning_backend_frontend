-- CreateTable
CREATE TABLE "InterviewRound" (
    "candidateId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dateAndTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'SCHEDULED',

    CONSTRAINT "InterviewRound_pkey" PRIMARY KEY ("candidateId","jobId")
);

-- AddForeignKey
ALTER TABLE "InterviewRound" ADD CONSTRAINT "InterviewRound_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRound" ADD CONSTRAINT "InterviewRound_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
