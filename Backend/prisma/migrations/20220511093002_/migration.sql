-- CreateTable
CREATE TABLE "CandidateSocial" (
    "candidateId" INTEGER NOT NULL,
    "socialId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CandidateSocial_pkey" PRIMARY KEY ("candidateId","socialId")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateSkills" ADD CONSTRAINT "CandidateSkills_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkills" ADD CONSTRAINT "CandidateSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSocial" ADD CONSTRAINT "CandidateSocial_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSocial" ADD CONSTRAINT "CandidateSocial_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
