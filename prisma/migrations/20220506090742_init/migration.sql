-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "muted" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupUuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "lastSeenMessageKey" TEXT,
    "permissions" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    CONSTRAINT "Member_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "Group" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_lastSeenMessageKey_fkey" FOREIGN KEY ("lastSeenMessageKey") REFERENCES "Message" ("key") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupUuid" TEXT,
    "contactUsername" TEXT,
    "key" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "writtenByUser" BOOLEAN NOT NULL,
    "authorUsername" TEXT,
    "active" BOOLEAN NOT NULL,
    CONSTRAINT "Message_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "Contact" ("username") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_contactUsername_fkey" FOREIGN KEY ("contactUsername") REFERENCES "Contact" ("username") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "Group" ("uuid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_username_key" ON "Contact"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Group_uuid_key" ON "Group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Member_username_key" ON "Member"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Message_key_key" ON "Message"("key");
