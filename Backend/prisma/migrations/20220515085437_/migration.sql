-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "profileViewed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalApplication" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalInterview" INTEGER NOT NULL DEFAULT 0;
