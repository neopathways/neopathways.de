/*
  Warnings:

  - Added the required column `sha512` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sha512` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "sha512" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "sha512" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DentalTherapy" (
    "uid" TEXT NOT NULL,
    "teeth" INTEGER[],
    "type" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "sha512" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTherapy_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "_DentalTherapyToMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DentalTherapyToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DentalTherapyToMaterial_AB_unique" ON "_DentalTherapyToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_DentalTherapyToMaterial_B_index" ON "_DentalTherapyToMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DentalTherapyToTransaction_AB_unique" ON "_DentalTherapyToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_DentalTherapyToTransaction_B_index" ON "_DentalTherapyToTransaction"("B");

-- AddForeignKey
ALTER TABLE "_DentalTherapyToMaterial" ADD CONSTRAINT "_DentalTherapyToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "DentalTherapy"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DentalTherapyToMaterial" ADD CONSTRAINT "_DentalTherapyToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DentalTherapyToTransaction" ADD CONSTRAINT "_DentalTherapyToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "DentalTherapy"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DentalTherapyToTransaction" ADD CONSTRAINT "_DentalTherapyToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
