-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "threeDigits" TEXT,
    "fourDigits" TEXT,
    "fourDigitsXX" TEXT,
    "fourDigitsYY" TEXT,
    "structureId" TEXT NOT NULL,
    "subDepartmentId" TEXT,
    CONSTRAINT "Contact_subDepartmentId_fkey" FOREIGN KEY ("subDepartmentId") REFERENCES "SubDepartment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("fourDigits", "fourDigitsXX", "fourDigitsYY", "id", "name", "structureId", "subDepartmentId", "threeDigits", "title") SELECT "fourDigits", "fourDigitsXX", "fourDigitsYY", "id", "name", "structureId", "subDepartmentId", "threeDigits", "title" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
