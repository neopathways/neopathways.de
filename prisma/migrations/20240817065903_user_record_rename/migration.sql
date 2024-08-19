/*
  Warnings:

  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_orguid_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_useruid_fkey";

-- DropTable
DROP TABLE "Record";

-- CreateTable
CREATE TABLE "UserRecord" (
    "uid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "outdated" BOOLEAN NOT NULL DEFAULT false,
    "category" "RecordCategory" NOT NULL,
    "tags" "RecordTag"[],
    "data" JSONB NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,

    CONSTRAINT "UserRecord_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "OverallCollectedAccuracy" (
    "uid" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OverallCollectedAccuracy_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "UserRecord" ADD CONSTRAINT "UserRecord_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecord" ADD CONSTRAINT "UserRecord_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallCollectedAccuracy" ADD CONSTRAINT "OverallCollectedAccuracy_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallCollectedAccuracy" ADD CONSTRAINT "OverallCollectedAccuracy_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
