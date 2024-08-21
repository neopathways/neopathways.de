/*
  Warnings:

  - The `price` column on the `Material` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "currency" TEXT,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;
