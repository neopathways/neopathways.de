-- CreateEnum
CREATE TYPE "RecordCategory" AS ENUM ('IDENTIFICATION', 'BIOGRAPHICAL', 'DEMOGRAPHIC', 'MEDICAL', 'FINANCIAL', 'ONLINE_ACTIVITY', 'BEHAVIORAL', 'PREFERENCES', 'LOCATION', 'BIOMETRIC', 'LEGAL', 'PSYCHOLOGICAL', 'INTERESTS', 'COMMUNICATION', 'INTERACTION', 'OTHER');

-- CreateEnum
CREATE TYPE "RecordTag" AS ENUM ('SCAN', 'IMAGE', 'FACE', 'FINGERPRINT', 'VOICEPRINT', 'IRIS', 'TEXT', 'VOICE', 'VIDEO', 'LOCATION', 'CONTACT', 'EMAIL', 'MESSAGE', 'CHAT', 'VOICECALL', 'VIDEOCALL', 'VIDEOCONFERENCE', 'DOCUMENT', 'FORM', 'QUESTIONNAIRE', 'APPLICATION', 'TRANSACTION', 'CONTRACT', 'AGREEMENT', 'PERMISSION', 'CONSENT', 'APPROVAL', 'CONFIRMATION', 'VERIFICATION', 'VALIDATION', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "uid" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "issuedToId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Organization" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "UserRecord" (
    "uid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "outdated" BOOLEAN NOT NULL DEFAULT false,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,
    "category" "RecordCategory" NOT NULL,
    "tags" "RecordTag"[],
    "data" JSONB NOT NULL,

    CONSTRAINT "UserRecord_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUser_AB_unique" ON "_OrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "_OrganizationToUser"("B");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_issuedToId_fkey" FOREIGN KEY ("issuedToId") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecord" ADD CONSTRAINT "UserRecord_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecord" ADD CONSTRAINT "UserRecord_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
