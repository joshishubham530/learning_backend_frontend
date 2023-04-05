/*
  Warnings:

  - The values [remote,office,hybrid] on the enum `JobMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [assigned,posted,closed] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [fullTime,partTime,consultant] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - The `type` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmpType" AS ENUM ('ADMIN', 'HR', 'INTERVIEWER');

-- AlterEnum
BEGIN;
CREATE TYPE "JobMode_new" AS ENUM ('REMOTE', 'OFFICE', 'HYBRID');
ALTER TABLE "Job" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "mode" TYPE "JobMode_new" USING ("mode"::text::"JobMode_new");
ALTER TYPE "JobMode" RENAME TO "JobMode_old";
ALTER TYPE "JobMode_new" RENAME TO "JobMode";
DROP TYPE "JobMode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('ASSIGNED', 'POSTED', 'CLOSED');
ALTER TABLE "Job" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "status" TYPE "JobStatus_new" USING ("status"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "JobStatus_old";
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT 'ASSIGNED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('FULLTIME', 'PARTTIME', 'CONSULTANT');
ALTER TABLE "Job" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "type" TYPE "JobType_new" USING ("type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "JobType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "type",
ADD COLUMN     "type" "EmpType" NOT NULL DEFAULT E'HR';

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "mode" DROP DEFAULT,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT E'ASSIGNED';
