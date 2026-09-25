import { z } from "zod";

export const purchaseItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
  totalPrice: z.coerce.number().min(0),
});

export const createPurchaseSchema = z.object({
  tenantId: z.string().min(1),
  branchId: z.string().min(1),
  supplierId: z.string().min(1, "Supplier is required"),
  userId: z.string().min(1),
  invoiceNo: z.string().min(1, "Invoice number is required"),
  items: z.array(purchaseItemSchema).min(1, "At least one item required"),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
  grandTotal: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  dueAmount: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  purchaseDate: z.string().optional(),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
