/*
  Warnings:

  - You are about to drop the `IPGeocode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "IPGeocode";

-- CreateTable
CREATE TABLE "Location" (
    "uid" TEXT NOT NULL,
    "ip" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "altitudeAccuracy" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "continent_code" TEXT,
    "continent_name" TEXT,
    "country_code" TEXT,
    "country_name" TEXT,
    "subdivision_code" TEXT,
    "subdivision_name" TEXT,
    "city_name" TEXT,
    "postal_code" TEXT,
    "timezone" TEXT,
    "address" TEXT,
    "notes" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationRef" TEXT,
    "contact" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "uid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "merchantRef" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_ip_key" ON "Location"("ip");

-- CreateIndex
CREATE INDEX "Location_latitude_longitude_idx" ON "Location"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_locationRef_fkey" FOREIGN KEY ("locationRef") REFERENCES "Location"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_merchantRef_fkey" FOREIGN KEY ("merchantRef") REFERENCES "Merchant"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
