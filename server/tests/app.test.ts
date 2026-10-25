import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { createProductSchema } from "../src/schemas/product.schema";
import { CartService } from "../src/services/cart.service";
import prisma from "../src/config/prisma";

// Mock Prisma
vi.mock("../src/config/prisma", () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
      },
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      category: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
      cart: {
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn((cb) => (typeof cb === "function" ? cb({
        cart: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn() },
        productOnCart: { deleteMany: vi.fn() },
      }) : cb)),
    },
  };
});

describe("Ecommerce Server API Integration Tests", () => {
  const app = createApp();

  it("GET /health should return 200 and status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
  });

  it("POST /api/register should reject missing fields with 400 validation error", async () => {
    const res = await request(app).post("/api/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toBeDefined();
  });

  it("POST /api/login should reject invalid email format with 400", async () => {
    const res = await request(app).post("/api/login").send({
      email: "not-an-email",
      password: "pass",
    });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
  });

  it("GET unknown endpoint should return 404 AppError", async () => {
    const res = await request(app).get("/api/non-existent-route");
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("fail");
  });

  it("POST /api/current-admin without auth should return 401", async () => {
    const res = await request(app).post("/api/current-admin");
    expect(res.status).toBe(401);
  });

  it("createProductSchema accepts local disk upload relative paths", () => {
    const validData = {
      title: "Test Product",
      description: "A product with local image uploads",
      price: 199.99,
      quantity: 10,
      categoryId: 1,
      images: [
        {
          url: "/uploads/1745400000000-sample.png",
          asset_id: "disk-asset-1",
          public_id: "1745400000000-sample.png",
          secure_url: "/uploads/1745400000000-sample.png",
        },
      ],
    };
    const parsed = createProductSchema.safeParse({ body: validData });
    expect(parsed.success).toBe(true);
  });

  it("CartService.saveUserCart aggregates duplicate product counts and checks stock", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValueOnce([
      { id: 10, title: "Limited Item", price: 50, quantity: 3 } as any,
    ]);

    // Send 2 items of product 10 with count 2 each -> total requested = 4, available = 3
    await expect(
      CartService.saveUserCart(1, [
        { id: 10, count: 2 },
        { id: 10, count: 2 },
      ])
    ).rejects.toThrow(/Insufficient stock/);
  });
});
