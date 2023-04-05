-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'Need a highly skilled developer',
ADD COLUMN     "opening" INTEGER NOT NULL DEFAULT 5;
