import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics(tenantId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Today's sales
  const todaySales = await prisma.sale.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfDay, lte: endOfDay },
      status: "COMPLETED",
    },
    include: {
      items: true,
      payments: true,
    },
  });

  let todaySalesAmount = 0;
  let todayGrossProfit = 0;
  let todayOrdersCount = todaySales.length;

  for (const sale of todaySales) {
    todaySalesAmount += Number(sale.grandTotal);
    for (const item of sale.items) {
      const revenue = Number(item.totalPrice);
      const cost = Number(item.costPrice) * Number(item.quantity);
      todayGrossProfit += revenue - cost;
    }
  }

  // 2. Low stock count
  const lowStockProducts = await prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      stock: { lte: prisma.product.fields.reorderPoint },
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      reorderPoint: true,
    },
    take: 5,
  });

  // 3. Recent sales
  const recentSales = await prisma.sale.findMany({
    where: { tenantId },
    include: {
      customer: { select: { name: true } },
      cashier: { select: { name: true } },
      payments: { select: { method: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // 4. Customer due total
  const customerDue = await prisma.customer.aggregate({
    where: { tenantId, isActive: true },
    _sum: { dueBalance: true },
  });

  return {
    todaySalesAmount,
    todayGrossProfit,
    todayOrdersCount,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentSales,
    totalCustomerDue: Number(customerDue._sum.dueBalance || 0),
  };
}
