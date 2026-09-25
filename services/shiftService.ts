import { prisma } from "@/lib/prisma";

export async function getActiveShift(tenantId: string, cashierId: string) {
  return await prisma.shift.findFirst({
    where: {
      tenantId,
      cashierId,
      status: "OPEN",
    },
    include: {
      counter: true,
      branch: true,
    },
  });
}

export async function openShift(data: {
  tenantId: string;
  branchId: string;
  counterId: string;
  cashierId: string;
  openingCash: number;
  notes?: string | null;
}) {
  return await prisma.shift.create({
    data: {
      tenantId: data.tenantId,
      branchId: data.branchId,
      counterId: data.counterId,
      cashierId: data.cashierId,
      openingCash: data.openingCash,
      notes: data.notes || null,
      status: "OPEN",
    },
  });
}

export async function closeShift(shiftId: string, closingCash: number, notes?: string | null) {
  const shift = await prisma.shift.findUnique({
    where: { id: shiftId },
    include: {
      payments: true,
    },
  });

  if (!shift) throw new Error("Shift not found");

  // Sum cash payments
  const cashPayments = shift.payments
    .filter((p) => p.method === "CASH")
    .reduce((acc: number, p: { amount: unknown }) => acc + Number(p.amount), 0);

  const expectedCash = Number(shift.openingCash) + cashPayments;
  const cashVariance = closingCash - expectedCash;

  return await prisma.shift.update({
    where: { id: shiftId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      closingCash,
      expectedCash,
      cashVariance,
      notes: notes ? `${shift.notes ?? ""}\nClose note: ${notes}` : shift.notes,
    },
  });
}
