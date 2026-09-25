import { prisma } from "@/lib/prisma";
import { ProductInput } from "@/validations/product";
import { logAction } from "./auditLogService";

export async function getProducts(tenantId: string, search?: string, categoryId?: string) {
  return await prisma.product.findMany({
    where: {
      tenantId,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { sku: { contains: search } },
              { barcode: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      brand: true,
      unit: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(tenantId: string, id: string) {
  return await prisma.product.findFirst({
    where: { id, tenantId },
    include: { category: true, brand: true, unit: true, stockMovements: { take: 10, orderBy: { createdAt: "desc" } } },
  });
}

export async function createProduct(input: ProductInput, userId?: string) {
  const slug =
    input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
    input.sku.toLowerCase();

  const product = await prisma.$transaction(async (tx) => {
    // Ensure tenant exists (fallback for development demo)
    await tx.tenant.upsert({
      where: { id: input.tenantId },
      update: {},
      create: { id: input.tenantId, name: "Main Business", slug: input.tenantId },
    });

    const newProduct = await tx.product.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        slug,
        sku: input.sku,
        barcode: input.barcode || null,
        categoryId: input.categoryId || null,
        brandId: input.brandId || null,
        unitId: input.unitId || null,
        description: input.description || null,
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
        wholesalePrice: input.wholesalePrice ?? null,
        mrp: input.mrp ?? null,
        taxRate: input.taxRate,
        stock: input.stock,
        reorderPoint: input.reorderPoint,
        isActive: input.isActive,
      },
    });

    if (input.stock > 0) {
      await tx.stockMovement.create({
        data: {
          tenantId: input.tenantId,
          productId: newProduct.id,
          type: "ADJUSTMENT",
          quantity: input.stock,
          unitCost: input.purchasePrice,
          reason: "Initial opening stock",
          createdById: userId ?? null,
        },
      });
    }

    return newProduct;
  });

  await logAction({
    tenantId: input.tenantId,
    userId,
    action: "CREATE_PRODUCT",
    entity: "Product",
    entityId: product.id,
    details: { name: product.name, sku: product.sku, price: product.sellingPrice },
  });

  return product;
}
