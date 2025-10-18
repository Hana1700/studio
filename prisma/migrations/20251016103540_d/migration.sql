-- CreateTable
CREATE TABLE "Structure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "SubDepartment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    CONSTRAINT "SubDepartment_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "threeDigits" TEXT,
    "fourDigits" TEXT,
    "fourDigitsXX" TEXT,
    "fourDigitsYY" TEXT,
    "structureId" TEXT NOT NULL,
    "subDepartmentId" TEXT,
    CONSTRAINT "Contact_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contact_subDepartmentId_fkey" FOREIGN KEY ("subDepartmentId") REFERENCES "SubDepartment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
