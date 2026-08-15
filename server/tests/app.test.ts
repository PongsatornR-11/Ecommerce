import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

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
      $transaction: vi.fn((cb) => (typeof cb === "function" ? cb({}) : cb)),
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
});
