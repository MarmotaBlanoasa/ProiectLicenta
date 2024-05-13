/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN "taxId" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN "taxId" TEXT;

-- CreateTable
CREATE TABLE "AccountingAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AccountingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitCost" REAL NOT NULL,
    "totalCost" REAL NOT NULL DEFAULT 0,
    "minimumLevel" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryChanges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventoryItemId" TEXT NOT NULL,
    "quantityUsed" INTEGER NOT NULL,
    "dateUsed" DATETIME NOT NULL,
    "invoiceId" TEXT,
    "billId" TEXT,
    CONSTRAINT "InventoryChanges_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryChanges_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventoryChanges_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "businessName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "taxInfo" TEXT,
    "bankBalance" REAL NOT NULL DEFAULT 0,
    "cashBalance" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("address", "businessName", "createdAt", "email", "id", "phone", "taxInfo", "updatedAt") SELECT "address", "businessName", "createdAt", "email", "id", "phone", "taxInfo", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "dateIssued" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "nextBillingDate" DATETIME,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountingAccountId" TEXT,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_accountingAccountId_fkey" FOREIGN KEY ("accountingAccountId") REFERENCES "AccountingAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "dateIssued", "dueDate", "id", "invoiceNumber", "nextBillingDate", "paidAmount", "recurring", "status", "totalAmount", "userId") SELECT "clientId", "dateIssued", "dueDate", "id", "invoiceNumber", "nextBillingDate", "paidAmount", "recurring", "status", "totalAmount", "userId" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE TABLE "new_Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "amountPaid" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "accountingAccountId" TEXT,
    CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bill_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_accountingAccountId_fkey" FOREIGN KEY ("accountingAccountId") REFERENCES "AccountingAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bill" ("amount", "amountPaid", "date", "dueDate", "id", "notes", "status", "userId", "vendorId") SELECT "amount", "amountPaid", "date", "dueDate", "id", "notes", "status", "userId", "vendorId" FROM "Bill";
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
