import { prisma } from "@/lib/prisma";
import { CreatePurchaseInput } from "@/validations/purchase";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export async function createPurchase(input: CreatePurchaseInput) {
  const purchase = await prisma.$transaction(async (tx) => {
    const newPurchase = await tx.purchase.create({
      data: {
        tenantId: input.tenantId,
        branchId: input.branchId,
        supplierId: input.supplierId,
        userId: input.userId,
        invoiceNo: input.invoiceNo,
        status: "RECEIVED",
        subtotal: input.subtotal,
        discount: input.discount,
        tax: input.tax,
        grandTotal: input.grandTotal,
        paidAmount: input.paidAmount,
        dueAmount: input.dueAmount,
        notes: input.notes || null,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : new Date(),
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    });

    // Stock addition and ledger
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
          purchasePrice: item.unitPrice, // Update latest purchase cost
        },
      });

      await tx.stockMovement.create({
        data: {
          tenantId: input.tenantId,
          productId: item.productId,
          type: "PURCHASE",
          quantity: new Prisma.Decimal(item.quantity),
          unitCost: item.unitPrice,
          reference: input.invoiceNo,
          reason: `Purchase Bill ${input.invoiceNo}`,
          createdById: input.userId,
        },
      });
    }

    // Update supplier due
    if (input.dueAmount > 0) {
      await tx.supplier.update({
        where: { id: input.supplierId },
        data: {
          dueBalance: { increment: input.dueAmount },
        },
      });
    }

    return newPurchase;
  });

  await logAction({
    tenantId: input.tenantId,
    userId: input.userId,
    action: "CREATE_PURCHASE",
    entity: "Purchase",
    entityId: purchase.id,
    details: { invoiceNo: purchase.invoiceNo, grandTotal: purchase.grandTotal },
  });

  return purchase;
}

export async function getPurchases(tenantId: string) {
  return await prisma.purchase.findMany({
    where: { tenantId },
    include: {
      items: { include: { product: true } },
      supplier: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
