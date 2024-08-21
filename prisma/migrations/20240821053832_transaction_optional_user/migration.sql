-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_useruid_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "useruid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
