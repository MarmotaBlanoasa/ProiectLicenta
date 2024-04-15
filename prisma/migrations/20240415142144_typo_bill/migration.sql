/*
  Warnings:

  - Made the column `vendorId` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    CONSTRAINT "Bill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bill_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bill" ("amount", "categoryId", "date", "id", "notes", "paymentMethod", "userId", "vendorId") SELECT "amount", "categoryId", "date", "id", "notes", "paymentMethod", "userId", "vendorId" FROM "Bill";
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
