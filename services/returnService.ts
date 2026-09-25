import { prisma } from "@/lib/prisma";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export interface ProcessReturnInput {
  tenantId: string;
  saleId: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    costPrice: number;
    condition: "RESELLABLE" | "DAMAGED" | "EXPIRED";
  }>;
  refundAmount: number;
  refundMethod: "CASH" | "BKASH" | "NAGAD" | "CARD";
  reason: string;
}

export async function processSaleReturn(input: ProcessReturnInput) {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch sale
    const sale = await tx.sale.findUnique({
      where: { id: input.saleId },
      include: { items: true },
    });

    if (!sale) throw new Error("Sale not found");

    // 2. Adjust stock and create stock movements based on condition
    for (const item of input.items) {
      if (item.condition === "RESELLABLE") {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            tenantId: input.tenantId,
            productId: item.productId,
            type: "RETURN",
            quantity: new Prisma.Decimal(item.quantity),
            unitCost: item.costPrice,
            reference: sale.invoiceNo,
            reason: `Return (Resellable): ${input.reason}`,
            createdById: input.userId,
          },
        });
      } else {
        await tx.stockMovement.create({
          data: {
            tenantId: input.tenantId,
            productId: item.productId,
            type: "DAMAGE",
            quantity: new Prisma.Decimal(0), // Do not increment available sellable stock
            unitCost: item.costPrice,
            reference: sale.invoiceNo,
            reason: `Return (${item.condition}): ${input.reason}`,
            createdById: input.userId,
          },
        });
      }
    }

    // 3. Record Refund Payment
    await tx.payment.create({
      data: {
        tenantId: input.tenantId,
        saleId: sale.id,
        customerId: sale.customerId,
        method: input.refundMethod,
        amount: new Prisma.Decimal(input.refundAmount),
        status: "REFUNDED",
        notes: `Refund for return. Reason: ${input.reason}`,
      },
    });

    // 4. Update Sale status
    const updatedSale = await tx.sale.update({
      where: { id: sale.id },
      data: {
        status: "PARTIALLY_RETURNED",
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return updatedSale;
  });

  await logAction({
    tenantId: input.tenantId,
    userId: input.userId,
    action: "SALE_RETURN",
    entity: "Sale",
    entityId: input.saleId,
    details: { refundAmount: input.refundAmount, reason: input.reason, itemsCount: input.items.length },
  });

  return result;
}
