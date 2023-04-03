/*
  Warnings:

  - You are about to drop the column `Email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `First_Name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `Last_Name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `Organisation` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `Phone_No` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Employee_Email_key";

-- DropIndex
DROP INDEX "Employee_Phone_No_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "Email",
DROP COLUMN "First_Name",
DROP COLUMN "Last_Name",
DROP COLUMN "Organisation",
DROP COLUMN "Phone_No",
DROP COLUMN "Type",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "organization" TEXT NOT NULL,
ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");
