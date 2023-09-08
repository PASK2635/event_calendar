/*
  Warnings:

  - You are about to drop the column `ownerid` on the `Event` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start" TEXT NOT NULL,
    "end" TEXT,
    "rsvp" TEXT,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("description", "end", "id", "name", "rsvp", "start") SELECT "description", "end", "id", "name", "rsvp", "start" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
