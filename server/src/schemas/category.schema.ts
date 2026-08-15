import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
});

export const userCartSchema = z.object({
  body: z.object({
    cart: z.array(
      z.object({
        id: z.number().int().positive(),
        count: z.number().int().positive("Item count must be at least 1"),
        price: z.number().positive(),
      })
    ),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderId: z.number().int().positive(),
    orderStatus: z.enum(["Not Process", "Processing", "Completed", "Cancelled"]),
  }),
});
