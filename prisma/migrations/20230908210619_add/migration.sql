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
INSERT INTO "new_Event" ("description", "end", "id", "name", "ownerId", "rsvp", "start") SELECT "description", "end", "id", "name", "ownerId", "rsvp", "start" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
CREATE INDEX "Event_id_idx" ON "Event"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
