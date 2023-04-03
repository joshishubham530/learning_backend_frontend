/*
  Warnings:

  - A unique constraint covering the columns `[recoveryCode]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Employee_recoveryCode_key" ON "Employee"("recoveryCode");
