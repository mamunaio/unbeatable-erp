import { prisma } from "@/lib/prisma";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export async function getStockMovements(tenantId: string, limit = 100) {
  return await prisma.stockMovement.findMany({
    where: { tenantId },
    include: {
      product: { select: { id: true, name: true, sku: true, unit: true } },
      warehouse: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createStockAdjustment({
  tenantId,
  productId,
  quantity,
  type,
  reason,
  userId,
}: {
  tenantId: string;
  productId: string;
  quantity: number;
  type: "ADJUSTMENT" | "DAMAGE" | "WASTAGE" | "CORRECTION";
  reason: string;
  userId?: string;
}) {
  const result = await prisma.$transaction(async (tx) => {
    // Increment or decrement based on quantity sign or type
    const product = await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        tenantId,
        productId,
        type,
        quantity: new Prisma.Decimal(quantity),
        reason,
        createdById: userId ?? null,
      },
    });

    return { product, movement };
  });

  await logAction({
    tenantId,
    userId,
    action: `STOCK_${type}`,
    entity: "StockMovement",
    entityId: result.movement.id,
    details: { productId, quantity, reason },
  });

  return result;
}

export async function getInventorySummary(tenantId: string) {
  const products = await prisma.product.findMany({
    where: { tenantId, isActive: true },
    select: {
      id: true,
      stock: true,
      purchasePrice: true,
      reorderPoint: true,
    },
  });

  let totalStockValue = 0;
  let totalItemsCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const p of products) {
    const stockNum = Number(p.stock);
    const priceNum = Number(p.purchasePrice);
    const reorderNum = Number(p.reorderPoint);

    totalStockValue += stockNum * priceNum;
    totalItemsCount += stockNum;

    if (stockNum <= 0) {
      outOfStockCount++;
    } else if (stockNum <= reorderNum) {
      lowStockCount++;
    }
  }

  return {
    totalProducts: products.length,
    totalStockValue,
    totalItemsCount,
    lowStockCount,
    outOfStockCount,
  };
}
