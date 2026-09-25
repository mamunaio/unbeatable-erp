import { z } from "zod";

export const customerSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().trim().min(1, "Customer name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().email().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  type: z.enum(["WALK_IN", "RETAIL", "WHOLESALE", "REGULAR"]).default("RETAIL"),
  creditLimit: z.coerce.number().min(0).default(0),
});

export const supplierSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().trim().min(1, "Supplier name is required"),
  contactName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
});

export const expenseSchema = z.object({
  tenantId: z.string().min(1),
  branchId: z.string().min(1),
  categoryId: z.string().min(1, "Expense category is required"),
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().optional(),
  paidThrough: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const shiftSchema = z.object({
  tenantId: z.string().min(1),
  branchId: z.string().min(1),
  counterId: z.string().min(1),
  cashierId: z.string().min(1),
  openingCash: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable(),
});
