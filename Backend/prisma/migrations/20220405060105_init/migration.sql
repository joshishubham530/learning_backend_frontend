-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "First_Name" TEXT NOT NULL,
    "Last_Name" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone_No" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Organisation" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Email_key" ON "Employee"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Phone_No_key" ON "Employee"("Phone_No");
