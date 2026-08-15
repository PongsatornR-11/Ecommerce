const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Create or update Default Users
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      enabled: true,
    },
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      enabled: true,
    },
  });
  console.log('Upserted Admin User:', adminUser.email);

  const customerUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {
      password: userPassword,
      name: 'Customer User',
      role: 'user',
      enabled: true,
    },
    create: {
      email: 'user@gmail.com',
      password: userPassword,
      name: 'Customer User',
      role: 'user',
      enabled: true,
    },
  });
  console.log('Upserted Customer User:', customerUser.email);

  // 2. Create or update Categories
  const categoryNames = [
    'Laptops',
    'Desktops',
    'Monitors',
    'Gaming Consoles',
    'Accessories',
    'Mouse',
    'Keyboard',
    'Storage'
  ];

  const categories = {};
  for (const name of categoryNames) {
    let cat = await prisma.category.findFirst({
      where: { name: name }
    });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: name }
      });
      console.log(`Created Category: ${name}`);
    } else {
      console.log(`Category Exists: ${name} (ID: ${cat.id})`);
    }
    categories[name] = cat;
  }

  // Helper function to seed product
  async function seedProduct(productData) {
    const existing = await prisma.product.findFirst({
      where: { title: productData.title }
    });

    if (existing) {
      console.log(`Product already exists: ${productData.title}`);
      return;
    }

    const { images, categoryName, ...rest } = productData;
    const category = categories[categoryName];

    const createdProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: category.id,
        images: {
          create: images
        }
      }
    });
    console.log(`Created Product: ${createdProduct.title}`);
  }

  // 3. Define Mock Products
  const mockProducts = [
    // Laptops
    {
      title: 'Apple MacBook Pro 16-inch (M3 Max)',
      description: 'Supercharged by M3 Max, featuring a 16-core CPU, 40-core GPU, 48GB Unified Memory, and 1TB SSD. The ultimate workstation for professionals.',
      price: 125000,
      quantity: 5,
      categoryName: 'Laptops',
      images: [
        {
          asset_id: 'mbp16_asset',
          public_id: 'mock/mbp16',
          url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
          secure_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
        }
      ]
    },
    {
      title: 'Dell XPS 15 OLED Laptop',
      description: 'Stunning 15.6-inch 3.5K OLED touch display, Intel Core i9, 32GB RAM, 1TB SSD, and NVIDIA RTX 4060 graphics inside a sleek aluminum chassis.',
      price: 85000,
      quantity: 8,
      categoryName: 'Laptops',
      images: [
        {
          asset_id: 'xps15_asset',
          public_id: 'mock/xps15',
          url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
          secure_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
        }
      ]
    },
    // Desktops
    {
      title: 'Apple Mac Studio (M2 Ultra)',
      description: 'Enormous performance in a compact footprint. 24-core CPU, 60-core GPU, 64GB Unified Memory, and 2TB SSD storage.',
      price: 159000,
      quantity: 3,
      categoryName: 'Desktops',
      images: [
        {
          asset_id: 'macstudio_asset',
          public_id: 'mock/macstudio',
          url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
          secure_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
        }
      ]
    },
    {
      title: 'Pro Gaming Desktop RTX 4090',
      description: 'Ultimate gaming rig with AMD Ryzen 9 7950X3D, GeForce RTX 4090 24GB, 64GB DDR5 RAM, and 4TB NVMe SSD in a liquid-cooled case.',
      price: 145000,
      quantity: 4,
      categoryName: 'Desktops',
      images: [
        {
          asset_id: 'gamingpc_asset',
          public_id: 'mock/gamingpc',
          url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
          secure_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800'
        }
      ]
    },
    // Monitors
    {
      title: 'Samsung Odyssey Neo G9 49-inch',
      description: 'Dual QHD 49-inch curved gaming monitor with Quantum Mini LED, 240Hz refresh rate, 1ms response time, and HDR2000 support.',
      price: 45000,
      quantity: 7,
      categoryName: 'Monitors',
      images: [
        {
          asset_id: 'g9monitor_asset',
          public_id: 'mock/g9monitor',
          url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
          secure_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
        }
      ]
    },
    // Gaming Consoles
    {
      title: 'Sony PlayStation 5 Pro',
      description: 'Experience next-gen gaming with advanced ray tracing, sharper image clarity, higher frame rates, and a 2TB SSD.',
      price: 29900,
      quantity: 12,
      categoryName: 'Gaming Consoles',
      images: [
        {
          asset_id: 'ps5_asset',
          public_id: 'mock/ps5',
          url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
          secure_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800'
        }
      ]
    },
    // Mouse
    {
      title: 'Logitech MX Master 3S Wireless Mouse',
      description: 'Ergonomic performance mouse with 8K DPI tracking, ultra-quiet clicks, and MagSpeed electromagnetic scrolling.',
      price: 3990,
      quantity: 25,
      categoryName: 'Mouse',
      images: [
        {
          asset_id: 'mxmaster3s_asset',
          public_id: 'mock/mxmaster3s',
          url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
          secure_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'
        }
      ]
    },
    // Keyboard
    {
      title: 'Keychron Q1 Pro Mechanical Keyboard',
      description: 'Fully customizable wireless mechanical keyboard with QMK/VIA support, CNC aluminum body, and hot-swappable switches.',
      price: 6990,
      quantity: 15,
      categoryName: 'Keyboard',
      images: [
        {
          asset_id: 'keychronq1_asset',
          public_id: 'mock/keychronq1',
          url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
          secure_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
        }
      ]
    },
    // Storage
    {
      title: 'Samsung 990 PRO NVMe M.2 SSD 2TB',
      description: 'PCIe Gen4 internal SSD offering blazing read/write speeds up to 7450/6900 MB/s for PC gaming and heavy workloads.',
      price: 6500,
      quantity: 30,
      categoryName: 'Storage',
      images: [
        {
          asset_id: 'ssd990pro_asset',
          public_id: 'mock/ssd990pro',
          url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
          secure_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'
        }
      ]
    }
  ];

  // Seed all products
  for (const product of mockProducts) {
    await seedProduct(product);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
