/*
  Warnings:

  - You are about to drop the column `userId` on the `PlayerPayments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PlayerPunishments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Punishment` table. All the data in the column will be lost.
  - You are about to drop the column `timePeriod` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminUserId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminUserId` to the `PlayerPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `PlayerPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminUserId` to the `PlayerPunishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `PlayerPunishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminUserId` to the `Punishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `Punishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminUserId` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerPayments" DROP CONSTRAINT "PlayerPayments_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerPunishments" DROP CONSTRAINT "PlayerPunishments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Punishment" DROP CONSTRAINT "Punishment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_userId_fkey";

-- DropIndex
DROP INDEX "Season_timePeriod_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "adminUserId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlayerPayments" DROP COLUMN "userId",
ADD COLUMN     "adminUserId" TEXT NOT NULL,
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerPunishments" DROP COLUMN "userId",
ADD COLUMN     "adminUserId" TEXT NOT NULL,
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Punishment" DROP COLUMN "userId",
ADD COLUMN     "adminUserId" TEXT NOT NULL,
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "timePeriod",
DROP COLUMN "userId",
ADD COLUMN     "adminUserId" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_slug_key" ON "AdminUser"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPayments" ADD CONSTRAINT "PlayerPayments_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPayments" ADD CONSTRAINT "PlayerPayments_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPunishments" ADD CONSTRAINT "PlayerPunishments_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPunishments" ADD CONSTRAINT "PlayerPunishments_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
