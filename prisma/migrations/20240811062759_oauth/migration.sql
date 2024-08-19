-- CreateTable
CREATE TABLE "oAuthRefreshToken" (
    "uid" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oAuthRefreshToken_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "oAuthConnection" (
    "uid" TEXT NOT NULL,
    "useruid" TEXT NOT NULL,
    "orguid" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oAuthConnection_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "oAuthRefreshToken_token_key" ON "oAuthRefreshToken"("token");

-- AddForeignKey
ALTER TABLE "oAuthRefreshToken" ADD CONSTRAINT "oAuthRefreshToken_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oAuthConnection" ADD CONSTRAINT "oAuthConnection_useruid_fkey" FOREIGN KEY ("useruid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oAuthConnection" ADD CONSTRAINT "oAuthConnection_orguid_fkey" FOREIGN KEY ("orguid") REFERENCES "Organization"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
