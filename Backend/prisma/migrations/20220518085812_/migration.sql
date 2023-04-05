-- CreateTable
CREATE TABLE "LastApplied" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LastApplied_id_key" ON "LastApplied"("id");

-- AddForeignKey
ALTER TABLE "LastApplied" ADD CONSTRAINT "LastApplied_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastApplied" ADD CONSTRAINT "LastApplied_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
