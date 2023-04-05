/*
  Warnings:

  - You are about to drop the column `firstName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empType` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "organization",
DROP COLUMN "type",
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "empType" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "jobType" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_EmployeeToSkills" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToSkills_AB_unique" ON "_EmployeeToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToSkills_B_index" ON "_EmployeeToSkills"("B");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToSkills" ADD FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToSkills" ADD FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
