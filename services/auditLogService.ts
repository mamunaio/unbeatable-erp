import { prisma } from "@/lib/prisma";

export async function logAction({
  tenantId,
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
}: {
  tenantId: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        tenantId,
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        details: typeof details === "object" ? JSON.stringify(details) : details ?? null,
        ipAddress: ipAddress ?? null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error);
    return null;
  }
}
