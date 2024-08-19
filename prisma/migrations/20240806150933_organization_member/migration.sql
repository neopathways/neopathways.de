/*
  Warnings:

  - You are about to drop the `_OrganizationMemberOf` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('ADMIN', 'MEMBER', 'MODERATOR', 'OWNER');

-- DropForeignKey
ALTER TABLE "_OrganizationMemberOf" DROP CONSTRAINT "_OrganizationMemberOf_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationMemberOf" DROP CONSTRAINT "_OrganizationMemberOf_B_fkey";

-- DropTable
DROP TABLE "_OrganizationMemberOf";

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "uid" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "OrganizationRole" NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
