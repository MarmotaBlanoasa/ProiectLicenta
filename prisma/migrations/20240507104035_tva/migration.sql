-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LineItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "tva" REAL NOT NULL DEFAULT 19,
    "invoiceId" TEXT,
    "billId" TEXT,
    CONSTRAINT "LineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LineItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LineItem" ("billId", "description", "id", "invoiceId", "price", "quantity") SELECT "billId", "description", "id", "invoiceId", "price", "quantity" FROM "LineItem";
DROP TABLE "LineItem";
ALTER TABLE "new_LineItem" RENAME TO "LineItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
