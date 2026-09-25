import { prisma } from "@/lib/prisma";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export interface StockTransferInput {
  tenantId: string;
  sourceWarehouseId?: string | null;
  destinationWarehouseId?: string | null;
  userId: string;
  transferNo: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitCost?: number;
  }>;
  notes?: string | null;
}

export async function createStockTransfer(input: StockTransferInput) {
  const result = await prisma.$transaction(async (tx) => {
    // Process items
    for (const item of input.items) {
      // 1. Check source product stock
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error(`Product ${item.productId} not found`);

      // 2. Record TRANSFER_OUT
      await tx.stockMovement.create({
        data: {
          tenantId: input.tenantId,
          productId: item.productId,
          warehouseId: input.sourceWarehouseId || null,
          type: "TRANSFER_OUT",
          quantity: new Prisma.Decimal(-item.quantity),
          unitCost: new Prisma.Decimal(item.unitCost ?? Number(product.purchasePrice)),
          reference: input.transferNo,
          reason: `Stock Transfer Out (${input.transferNo}) to destination`,
          createdById: input.userId,
        },
      });

      // 3. Record TRANSFER_IN
      await tx.stockMovement.create({
        data: {
          tenantId: input.tenantId,
          productId: item.productId,
          warehouseId: input.destinationWarehouseId || null,
          type: "TRANSFER_IN",
          quantity: new Prisma.Decimal(item.quantity),
          unitCost: new Prisma.Decimal(item.unitCost ?? Number(product.purchasePrice)),
          reference: input.transferNo,
          reason: `Stock Transfer In (${input.transferNo}) from source`,
          createdById: input.userId,
        },
      });
    }

    return { success: true, transferNo: input.transferNo };
  });

  await logAction({
    tenantId: input.tenantId,
    userId: input.userId,
    action: "STOCK_TRANSFER",
    entity: "StockMovement",
    entityId: input.transferNo,
    details: { transferNo: input.transferNo, itemsCount: input.items.length, notes: input.notes },
  });

  return result;
}
