import { z } from "zod";

export const productSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  name: z.string().trim().min(1, "Product name is required").max(180),
  sku: z.string().trim().min(1, "SKU is required").max(80),
  barcode: z.string().trim().max(80).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  unitId: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be positive").default(0),
  sellingPrice: z.coerce.number().min(0, "Selling price must be positive").default(0),
  wholesalePrice: z.coerce.number().min(0).optional().nullable(),
  mrp: z.coerce.number().min(0).optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0).default(0),
  reorderPoint: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
