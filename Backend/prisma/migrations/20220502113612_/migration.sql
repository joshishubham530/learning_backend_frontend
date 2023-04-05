/*
  Warnings:

  - The `status` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('fullTime', 'partTime', 'consultant');

-- CreateEnum
CREATE TYPE "JobMode" AS ENUM ('remote', 'office', 'hybrid');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "mode" "JobMode" NOT NULL DEFAULT E'remote',
ADD COLUMN     "type" "JobType" NOT NULL DEFAULT E'fullTime',
DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT E'assigned';
