/*
  Warnings:

  - You are about to drop the `_EmployeeToSkills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmployeeToSkills" DROP CONSTRAINT "_EmployeeToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToSkills" DROP CONSTRAINT "_EmployeeToSkills_B_fkey";

-- DropTable
DROP TABLE "_EmployeeToSkills";

-- CreateTable
CREATE TABLE "EmployeeSkills" (
    "employeeId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "value" INTEGER,

    CONSTRAINT "EmployeeSkills_pkey" PRIMARY KEY ("employeeId","skillId")
);

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
