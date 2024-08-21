/*
  Warnings:

  - Added the required column `useruid` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'TRANSFER', 'PAYMENT', 'WITHDRAWAL', 'DEPOSIT');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "useruid" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
