/*
  Warnings:

  - A unique constraint covering the columns `[useruid,orguid]` on the table `oAuthConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "IPGeocode" (
    "uid" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "continent_code" TEXT NOT NULL,
    "continent_name" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "subdivision_code" TEXT NOT NULL,
    "subdivision_name" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "postal_code" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "accuracy_radius" INTEGER NOT NULL,

    CONSTRAINT "IPGeocode_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "IPGeocode_ip_key" ON "IPGeocode"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "oAuthConnection_useruid_orguid_key" ON "oAuthConnection"("useruid", "orguid");
