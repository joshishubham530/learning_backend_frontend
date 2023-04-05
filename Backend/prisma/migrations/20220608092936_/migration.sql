-- CreateTable
CREATE TABLE "CandidateSocial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CandidateSocial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateSocial" ADD CONSTRAINT "CandidateSocial_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
