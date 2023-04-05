-- AlterTable
ALTER TABLE "CandidateForJobs" ALTER COLUMN "status" SET DEFAULT E'Sourced';

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "department" DROP DEFAULT;
