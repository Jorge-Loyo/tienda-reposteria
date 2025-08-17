-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total" REAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "address" TEXT,
    "identityCard" TEXT,
    "phone" TEXT,
    "instagram" TEXT,
    "paymentMethod" TEXT,
    "shippingZoneIdentifier" TEXT,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE_DE_PAGO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("address", "createdAt", "customerEmail", "customerName", "id", "identityCard", "instagram", "paymentMethod", "phone", "shippingZoneIdentifier", "status", "total", "updatedAt") SELECT "address", "createdAt", "customerEmail", "customerName", "id", "identityCard", "instagram", "paymentMethod", "phone", "shippingZoneIdentifier", "status", "total", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check("Order");
PRAGMA foreign_keys=ON;
