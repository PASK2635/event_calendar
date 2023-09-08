-- CreateTable
CREATE TABLE "EventParticipants" (
    "eventId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "userId"),
    CONSTRAINT "EventParticipants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_User" ("id", "name") SELECT "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
