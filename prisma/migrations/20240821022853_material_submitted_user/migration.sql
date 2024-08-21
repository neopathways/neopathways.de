/*
  Warnings:

  - Added the required column `useruid` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "useruid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
