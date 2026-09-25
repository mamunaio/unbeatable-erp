import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  taxRate: z.coerce.number().min(0).default(0),
  totalPrice: z.coerce.number().min(0),
});

export const paymentInputSchema = z.object({
  method: z.enum(["CASH", "CARD", "BANK", "BKASH", "NAGAD", "ROCKET", "CREDIT", "OTHER"]).default("CASH"),
  amount: z.coerce.number().min(0),
  referenceNo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createSaleSchema = z.object({
  tenantId: z.string().min(1),
  branchId: z.string().min(1),
  counterId: z.string().optional().nullable(),
  shiftId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  cashierId: z.string().min(1),
  
  items: z.array(saleItemSchema).min(1, "At least one item is required in cart"),
  
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
  grandTotal: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  dueAmount: z.coerce.number().min(0).default(0),
  changeAmount: z.coerce.number().min(0).default(0),
  
  payments: z.array(paymentInputSchema).default([]),
  notes: z.string().optional().nullable(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
