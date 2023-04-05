-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "about" TEXT NOT NULL DEFAULT E'very good comapny',
ADD COLUMN     "companySize" TEXT NOT NULL DEFAULT E'50-100 Employee',
ADD COLUMN     "industry" TEXT NOT NULL DEFAULT E'IT',
ADD COLUMN     "website" TEXT NOT NULL DEFAULT E'www.asfal.caa';

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT E'ASSIGNED';
