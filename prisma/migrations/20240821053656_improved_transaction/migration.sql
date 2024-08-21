/*
  Warnings:

  - Made the column `amount` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "tax" DOUBLE PRECISION,
ADD COLUMN     "taxIncluded" BOOLEAN,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "currency" SET NOT NULL;
