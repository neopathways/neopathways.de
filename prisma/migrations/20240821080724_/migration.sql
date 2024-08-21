-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_useruid_fkey";

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "useruid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
