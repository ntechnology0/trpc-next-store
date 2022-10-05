-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('superadministrator', 'administrator', 'moderator');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'administrator';
