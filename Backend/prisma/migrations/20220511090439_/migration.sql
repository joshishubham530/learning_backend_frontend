-- CreateTable
CREATE TABLE "CandidateSkills" (
    "candidateId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "CandidateSkills_pkey" PRIMARY KEY ("candidateId","skillId")
);
