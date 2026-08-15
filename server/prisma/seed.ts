import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create or ensure Admin User
  const adminHashedPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopsphere.com" },
    update: { role: "admin", enabled: true },
    create: {
      email: "admin@shopsphere.com",
      password: adminHashedPassword,
      name: "ShopSphere Admin",
      role: "admin",
      enabled: true,
      address: "123 Innovation Way, Tech Park, Bangkok",
    },
  });
  console.log("Admin user ready:", admin.email);

  // 2. Create Categories
  const categoriesData = [
    { name: "Smart Audio" },
    { name: "Wearable Tech" },
    { name: "Minimalist Essentials" },
    { name: "Workspace & Desk" },
  ];

  const categoryMap = new Map<string, number>();

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log("Categories created:", Array.from(categoryMap.keys()));

  // 3. Create Sample Products
  const products = [
    {
      title: "Nova ANC Wireless Headphones",
      description: "Premium active noise-cancelling over-ear headphones with 40-hour battery life, high-res audio drivers, and ultra-plush memory foam earcups.",
      price: 5490,
      quantity: 35,
      sold: 12,
      categoryName: "Smart Audio",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Aura True Wireless Earbuds",
      description: "Ergonomic spatial audio earbuds featuring transparency mode, IPX7 water resistance, and fast wireless charging case.",
      price: 2890,
      quantity: 50,
      sold: 28,
      categoryName: "Smart Audio",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Pulse Ultra Smartwatch Series 5",
      description: "Advanced fitness tracker with vibrant AMOLED always-on display, ECG heart monitoring, sleep staging, and GPS tracking.",
      price: 6990,
      quantity: 20,
      sold: 15,
      categoryName: "Wearable Tech",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Verve Hybrid Fitness Band",
      description: "Sleek and lightweight activity tracker with 14-day battery life, continuous SpO2 monitoring, and 50m water resistance.",
      price: 1590,
      quantity: 45,
      sold: 9,
      categoryName: "Wearable Tech",
      imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Studio Minimalist Mechanical Keyboard",
      description: "Hot-swappable 75% mechanical keyboard with custom lubricated switches, RGB backlighting, and sound-dampening acoustic foam.",
      price: 3490,
      quantity: 25,
      sold: 18,
      categoryName: "Workspace & Desk",
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Precision Ergonomic Wireless Mouse",
      description: "High-precision 4000 DPI sensor with silent tactile clicks, hyper-fast scroll wheel, and multi-device Bluetooth switching.",
      price: 1890,
      quantity: 40,
      sold: 22,
      categoryName: "Workspace & Desk",
      imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Matte Black Thermal Travel Tumbler",
      description: "Double-wall vacuum-insulated stainless steel tumbler keeps beverages hot for 12 hours or ice-cold for 24 hours with leakproof lid.",
      price: 790,
      quantity: 60,
      sold: 34,
      categoryName: "Minimalist Essentials",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Full-Grain Italian Leather Wallet",
      description: "Slim bifold RFID-blocking wallet crafted from vegetable-tanned full-grain leather with dedicated quick-access card slots.",
      price: 1290,
      quantity: 30,
      sold: 14,
      categoryName: "Minimalist Essentials",
      imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    },
  ];

  for (const item of products) {
    const existing = await prisma.product.findFirst({
      where: { title: item.title },
    });

    const categoryId = categoryMap.get(item.categoryName);

    if (!existing) {
      await prisma.product.create({
        data: {
          title: item.title,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          sold: item.sold,
          categoryId: categoryId,
          images: {
            create: [
              {
                asset_id: `seed_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                public_id: `seed_img_${Math.random().toString(36).substring(7)}`,
                url: item.imageUrl,
                secure_url: item.imageUrl,
              },
            ],
          },
        },
      });
      console.log(`Created product: ${item.title}`);
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
