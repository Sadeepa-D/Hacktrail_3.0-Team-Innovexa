-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('JOB', 'INTERNSHIP', 'FREELANCE', 'PART_TIME', 'FULL_TIME', 'VOLUNTEER', 'PROJECT');

-- CreateEnum
CREATE TYPE "OpportunityCategory" AS ENUM ('TECHNOLOGY', 'DESIGN', 'MARKETING', 'WRITING', 'TUTORING', 'LABOR', 'FOOD_SERVICE', 'EVENT', 'AGRICULTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'FILLED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('FIXED', 'HOURLY', 'MONTHLY', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('TECHNICAL', 'DESIGN', 'COMMUNICATION', 'MANAGEMENT', 'LANGUAGE', 'SOFT_SKILL', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_OPPORTUNITY', 'APPLICATION_RECEIVED', 'APPLICATION_STATUS_CHANGED', 'SKILL_INQUIRY', 'SYSTEM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpire" TIMESTAMP(3),
ALTER COLUMN "fname" DROP NOT NULL,
ALTER COLUMN "lname" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "OpportunityType" NOT NULL DEFAULT 'JOB',
    "category" "OpportunityCategory" NOT NULL DEFAULT 'OTHER',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'DRAFT',
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "salary" DOUBLE PRECISION,
    "salaryMax" DOUBLE PRECISION,
    "salaryType" "SalaryType" NOT NULL DEFAULT 'FIXED',
    "companyname" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "userId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phonenum" TEXT NOT NULL,
    "email" TEXT,
    "category" "SkillCategory" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "qualification" TEXT,
    "userId" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION,
    "availability" TEXT,
    "experience" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "coverLetter" TEXT,
    "resume" TEXT,
    "portfolio" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "expectedSalary" DOUBLE PRECISION,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applicantNotes" TEXT,
    "employerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedOpportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Opportunity_userId_idx" ON "Opportunity"("userId");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");

-- CreateIndex
CREATE INDEX "Opportunity_category_idx" ON "Opportunity"("category");

-- CreateIndex
CREATE INDEX "Opportunity_type_idx" ON "Opportunity"("type");

-- CreateIndex
CREATE INDEX "Opportunity_createdAt_idx" ON "Opportunity"("createdAt");

-- CreateIndex
CREATE INDEX "Skill_userId_idx" ON "Skill"("userId");

-- CreateIndex
CREATE INDEX "Skill_category_idx" ON "Skill"("category");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_opportunityId_idx" ON "Application"("opportunityId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_opportunityId_applicantId_key" ON "Application"("opportunityId", "applicantId");

-- CreateIndex
CREATE INDEX "SavedOpportunity_userId_idx" ON "SavedOpportunity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedOpportunity_userId_opportunityId_key" ON "SavedOpportunity"("userId", "opportunityId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
