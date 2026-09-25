import { prisma } from "@/lib/prisma";

export async function getExpenses(tenantId: string) {
  return await prisma.expense.findMany({
    where: { tenantId },
    include: {
      category: true,
      branch: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(data: {
  tenantId: string;
  branchId: string;
  categoryId: string;
  title: string;
  amount: number;
  date?: string;
  paidThrough?: string | null;
  reference?: string | null;
  notes?: string | null;
}) {
  return await prisma.expense.create({
    data: {
      tenantId: data.tenantId,
      branchId: data.branchId,
      categoryId: data.categoryId,
      title: data.title,
      amount: data.amount,
      date: data.date ? new Date(data.date) : new Date(),
      paidThrough: data.paidThrough || null,
      reference: data.reference || null,
      notes: data.notes || null,
    },
  });
}

export async function getExpenseCategories(tenantId: string) {
  return await prisma.expenseCategory.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}
