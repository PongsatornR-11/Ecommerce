import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be greater than 0"),
    quantity: z.number().int().min(0, "Quantity cannot be negative"),
    categoryId: z.number().int().positive().optional().nullable(),
    images: z
      .array(
        z.object({
          asset_id: z.string(),
          public_id: z.string(),
          url: z.string().url(),
          secure_url: z.string().url(),
        })
      )
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    quantity: z.number().int().min(0).optional(),
    categoryId: z.number().int().positive().optional().nullable(),
    images: z
      .array(
        z.object({
          asset_id: z.string(),
          public_id: z.string(),
          url: z.string().url(),
          secure_url: z.string().url(),
        })
      )
      .optional(),
  }),
});

export const searchProductSchema = z.object({
  body: z.object({
    query: z.string().optional(),
    category: z.array(z.number().int()).optional(),
    price: z.array(z.number()).length(2).optional(),
  }),
});
