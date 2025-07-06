-- AlterTable
ALTER TABLE "Order" ADD COLUMN "shippingZoneIdentifier" TEXT;

-- CreateTable
CREATE TABLE "ShippingZone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" REAL NOT NULL DEFAULT 0,
    "freeShippingThreshold" REAL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingZone_identifier_key" ON "ShippingZone"("identifier");
