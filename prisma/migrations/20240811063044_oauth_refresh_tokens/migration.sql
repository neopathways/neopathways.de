/*
  Warnings:

  - Added the required column `orguid` to the `oAuthRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oAuthRefreshToken" ADD COLUMN     "orguid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "oAuthRefreshToken" ADD CONSTRAINT "oAuthRefreshToken_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
