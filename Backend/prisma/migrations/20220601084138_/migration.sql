-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "department" TEXT NOT NULL DEFAULT E'Department',
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "opening" DROP DEFAULT;
