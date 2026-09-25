import { prisma } from "@/lib/prisma";
import { generateInvoiceNo } from "@/lib/formatters";
import { CreateSaleInput } from "@/validations/sale";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export async function createSale(input: CreateSaleInput) {
  const invoiceNo = generateInvoiceNo("INV");

  const sale = await prisma.$transaction(async (tx) => {
    // 1. Create Sale record
    const createdSale = await tx.sale.create({
      data: {
        tenantId: input.tenantId,
        branchId: input.branchId,
        counterId: input.counterId || null,
        shiftId: input.shiftId || null,
        customerId: input.customerId || null,
        cashierId: input.cashierId,
        invoiceNo,
        status: "COMPLETED",
        subtotal: input.subtotal,
        discount: input.discount,
        tax: input.tax,
        grandTotal: input.grandTotal,
        paidAmount: input.paidAmount,
        dueAmount: input.dueAmount,
        changeAmount: input.changeAmount,
        notes: input.notes || null,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            costPrice: item.costPrice,
            discount: item.discount,
            taxRate: item.taxRate,
            totalPrice: item.totalPrice,
          })),
        },
        payments: {
          create: input.payments.map((p) => ({
            tenantId: input.tenantId,
            customerId: input.customerId || null,
            shiftId: input.shiftId || null,
            method: p.method,
            amount: p.amount,
            referenceNo: p.referenceNo || null,
            notes: p.notes || null,
          })),
        },
      },
      include: {
        items: true,
        payments: true,
        customer: true,
      },
    });

    // 2. Decrement stock for each item & create StockMovement ledger
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: {
          tenantId: input.tenantId,
          productId: item.productId,
          type: "SALE",
          quantity: new Prisma.Decimal(-item.quantity),
          unitCost: item.costPrice,
          reference: invoiceNo,
          reason: `Sale ${invoiceNo}`,
          createdById: input.cashierId,
        },
      });
    }

    // 3. Update customer due if credit/due exists
    if (input.customerId && input.dueAmount > 0) {
      await tx.customer.update({
        where: { id: input.customerId },
        data: {
          dueBalance: {
            increment: input.dueAmount,
          },
        },
      });
    }

    return createdSale;
  });

  await logAction({
    tenantId: input.tenantId,
    userId: input.cashierId,
    action: "CREATE_SALE",
    entity: "Sale",
    entityId: sale.id,
    details: { invoiceNo: sale.invoiceNo, grandTotal: sale.grandTotal, itemsCount: sale.items.length },
  });

  return sale;
}

export async function getSales(tenantId: string, limit = 50) {
  return await prisma.sale.findMany({
    where: { tenantId },
    include: {
      items: true,
      payments: true,
      customer: true,
      cashier: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
