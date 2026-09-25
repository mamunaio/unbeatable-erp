import { prisma } from "@/lib/prisma";
import { logAction } from "./auditLogService";
import { Prisma } from "@prisma/client";

export async function getCustomers(tenantId: string) {
  return await prisma.customer.findMany({
    where: { tenantId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomer(data: {
  tenantId: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  type?: "WALK_IN" | "RETAIL" | "WHOLESALE" | "REGULAR";
  creditLimit?: number;
}) {
  const customer = await prisma.customer.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      type: data.type || "RETAIL",
      creditLimit: data.creditLimit || 0,
    },
  });

  await logAction({
    tenantId: data.tenantId,
    action: "CREATE_CUSTOMER",
    entity: "Customer",
    entityId: customer.id,
    details: { name: customer.name, phone: customer.phone },
  });

  return customer;
}

export async function recordCustomerDuePayment({
  tenantId,
  customerId,
  amount,
  method,
  referenceNo,
  notes,
  userId,
}: {
  tenantId: string;
  customerId: string;
  amount: number;
  method: "CASH" | "BKASH" | "NAGAD" | "BANK";
  referenceNo?: string | null;
  notes?: string | null;
  userId?: string;
}) {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Decrement customer due
    const customer = await tx.customer.update({
      where: { id: customerId },
      data: {
        dueBalance: {
          decrement: amount,
        },
      },
    });

    // 2. Create Payment record
    const payment = await tx.payment.create({
      data: {
        tenantId,
        customerId,
        amount: new Prisma.Decimal(amount),
        method,
        status: "PAID",
        referenceNo: referenceNo || null,
        notes: notes ? `Customer due collection: ${notes}` : "Customer due collection",
      },
    });

    return { customer, payment };
  });

  await logAction({
    tenantId,
    userId,
    action: "CUSTOMER_DUE_PAYMENT",
    entity: "Payment",
    entityId: result.payment.id,
    details: { customerId, amount, method, remainingDue: result.customer.dueBalance },
  });

  return result;
}

export async function getSuppliers(tenantId: string) {
  return await prisma.supplier.findMany({
    where: { tenantId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSupplier(data: {
  tenantId: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}) {
  return await prisma.supplier.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      contactName: data.contactName || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    },
  });
}

export async function recordSupplierDuePayment({
  tenantId,
  supplierId,
  amount,
  method,
  referenceNo,
  notes,
  userId,
}: {
  tenantId: string;
  supplierId: string;
  amount: number;
  method: string;
  referenceNo?: string | null;
  notes?: string | null;
  userId?: string;
}) {
  const result = await prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.update({
      where: { id: supplierId },
      data: {
        dueBalance: {
          decrement: amount,
        },
      },
    });

    return supplier;
  });

  await logAction({
    tenantId,
    userId,
    action: "SUPPLIER_DUE_PAYMENT",
    entity: "Supplier",
    entityId: supplierId,
    details: { supplierId, amount, method, remainingDue: result.dueBalance },
  });

  return result;
}
