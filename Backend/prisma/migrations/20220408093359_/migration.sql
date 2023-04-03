-- DropIndex
DROP INDEX "Employee_recoveryCode_key";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "recoveryCode" DROP NOT NULL;
