import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const changeStatusSchema = z.object({
  body: z.object({
    id: z.number().int().positive("User ID must be a positive integer"),
    enabled: z.boolean(),
  }),
});

export const changeRoleSchema = z.object({
  body: z.object({
    id: z.number().int().positive("User ID must be a positive integer"),
    role: z.enum(["user", "admin"]),
  }),
});

export const saveAddressSchema = z.object({
  body: z.object({
    address: z.string().min(3, "Address must be at least 3 characters long"),
  }),
});
