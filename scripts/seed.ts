import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq, isNull, lt, sql } from 'drizzle-orm';
import { hashPassword } from '../server/utils/password';
import * as schema from '../server/database/schema';
import type { OrderStatus } from '../shared/types/api';
import type { UserRole } from '../shared/types/auth';

if (existsSync(resolve('.env'))) process.loadEnvFile(resolve('.env'));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Add it to your .env file.');
  process.exit(1);
}

const client = postgres(databaseUrl, { prepare: false, max: 1 });
const db = drizzle(client, { schema });

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

interface SeedProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface SeedOrderItem {
  product: string;
  quantity: number;
}

interface SeedOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  hoursAgo: number;
  items: SeedOrderItem[];
}

const seedUsers: SeedUser[] = [
  { email: 'admin@example.com', password: 'AdminDemo123!', fullName: 'Aditya Pranata', role: 'admin' },
  { email: 'staff@example.com', password: 'StaffDemo123!', fullName: 'Nadia Wibowo', role: 'staff' },
];

const seedProducts: SeedProduct[] = [
  { name: 'Toba Overshirt', category: 'Apparel', price: 349000, stock: 24 },
  { name: 'Rinjani Tee', category: 'Apparel', price: 129000, stock: 86 },
  { name: 'Sunda Knit Cardigan', category: 'Apparel', price: 419000, stock: 12 },
  { name: 'Bali Linen Shirt', category: 'Apparel', price: 389000, stock: 18 },
  { name: 'Jalan Canvas Tote', category: 'Accessories', price: 189000, stock: 40 },
  { name: 'Sapta Leather Belt', category: 'Accessories', price: 249000, stock: 15 },
  { name: 'Nusa Twill Cap', category: 'Accessories', price: 99000, stock: 60 },
  { name: 'Arunika Sunglasses', category: 'Accessories', price: 359000, stock: 3 },
  { name: 'Batik Cushion Cover', category: 'Home Living', price: 159000, stock: 4 },
  { name: 'Terang Ceramic Mug', category: 'Home Living', price: 89000, stock: 54 },
  { name: 'Hutan Scented Candle', category: 'Home Living', price: 139000, stock: 33 },
  { name: 'Laut Woven Basket', category: 'Home Living', price: 219000, stock: 9 },
];

const seedOrders: SeedOrder[] = [
  {
    orderNumber: 'ORD-2026-0001',
    customerName: 'Dewi Anggraini',
    customerEmail: 'dewi.anggraini@example.com',
    status: 'completed',
    hoursAgo: 27 * 24,
    items: [
      { product: 'Toba Overshirt', quantity: 1 },
      { product: 'Sapta Leather Belt', quantity: 1 },
    ],
  },
  {
    orderNumber: 'ORD-2026-0002',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    status: 'completed',
    hoursAgo: 22 * 24,
    items: [
      { product: 'Sunda Knit Cardigan', quantity: 2 },
      { product: 'Terang Ceramic Mug', quantity: 2 },
    ],
  },
  {
    orderNumber: 'ORD-2026-0003',
    customerName: 'Sari Wijaya',
    customerEmail: 'sari.wijaya@example.com',
    status: 'cancelled',
    hoursAgo: 18 * 24,
    items: [{ product: 'Arunika Sunglasses', quantity: 1 }],
  },
  {
    orderNumber: 'ORD-2026-0004',
    customerName: 'Agus Pratama',
    customerEmail: 'agus.pratama@example.com',
    status: 'completed',
    hoursAgo: 14 * 24,
    items: [
      { product: 'Bali Linen Shirt', quantity: 1 },
      { product: 'Jalan Canvas Tote', quantity: 1 },
      { product: 'Nusa Twill Cap', quantity: 2 },
    ],
  },
  {
    orderNumber: 'ORD-2026-0005',
    customerName: 'Rina Kusuma',
    customerEmail: 'rina.kusuma@example.com',
    status: 'processing',
    hoursAgo: 9 * 24,
    items: [{ product: 'Batik Cushion Cover', quantity: 3 }],
  },
  {
    orderNumber: 'ORD-2026-0006',
    customerName: 'Fajar Nugroho',
    customerEmail: 'fajar.nugroho@example.com',
    status: 'cancelled',
    hoursAgo: 5 * 24,
    items: [{ product: 'Hutan Scented Candle', quantity: 1 }],
  },
  {
    orderNumber: 'ORD-2026-0007',
    customerName: 'Maya Lestari',
    customerEmail: 'maya.lestari@example.com',
    status: 'pending',
    hoursAgo: 3 * 24,
    items: [
      { product: 'Laut Woven Basket', quantity: 1 },
      { product: 'Rinjani Tee', quantity: 2 },
    ],
  },
  {
    orderNumber: 'ORD-2026-0008',
    customerName: 'Eko Putra',
    customerEmail: 'eko.putra@example.com',
    status: 'processing',
    hoursAgo: 26,
    items: [
      { product: 'Toba Overshirt', quantity: 1 },
      { product: 'Nusa Twill Cap', quantity: 1 },
    ],
  },
  {
    orderNumber: 'ORD-2026-0009',
    customerName: 'Intan Permata',
    customerEmail: 'intan.permata@example.com',
    status: 'pending',
    hoursAgo: 6,
    items: [{ product: 'Sapta Leather Belt', quantity: 2 }],
  },
  {
    orderNumber: 'ORD-2026-0010',
    customerName: 'Rizky Hakim',
    customerEmail: 'rizky.hakim@example.com',
    status: 'pending',
    hoursAgo: 1,
    items: [{ product: 'Terang Ceramic Mug', quantity: 4 }],
  },
];

function findProduct(name: string): SeedProduct {
  const product = seedProducts.find((entry) => entry.name === name);
  if (!product) throw new Error(`Seed product not found: ${name}`);
  return product;
}

try {
  await db.transaction(async (tx) => {
    for (const user of seedUsers) {
      await tx
        .insert(schema.users)
        .values({
          email: user.email,
          passwordHash: hashPassword(user.password),
          fullName: user.fullName,
          role: user.role,
        })
        .onConflictDoUpdate({
          target: schema.users.email,
          set: {
            passwordHash: hashPassword(user.password),
            fullName: user.fullName,
            role: user.role,
            updatedAt: new Date(),
          },
        });
    }

    await tx.execute(sql`truncate table order_items, orders, products restart identity cascade`);

    const productIds = new Map<string, number>();
    for (const product of seedProducts) {
      const inserted = await tx
        .insert(schema.products)
        .values({
          name: product.name,
          category: product.category,
          price: String(product.price),
          stock: product.stock,
        })
        .returning({ id: schema.products.id });
      productIds.set(product.name, inserted[0].id);
    }

    for (const order of seedOrders) {
      const orderDate = new Date(Date.now() - order.hoursAgo * 3_600_000);
      const insertedOrder = await tx
        .insert(schema.orders)
        .values({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: order.status,
          total: '0',
          orderDate,
        })
        .returning({ id: schema.orders.id });
      const orderId = insertedOrder[0].id;

      let total = 0;
      for (const item of order.items) {
        const product = findProduct(item.product);
        const productId = productIds.get(product.name);
        if (productId === undefined) throw new Error(`Product id missing for ${product.name}`);
        const subtotal = product.price * item.quantity;
        total += subtotal;
        await tx.insert(schema.orderItems).values({
          orderId,
          productId,
          productName: product.name,
          unitPrice: String(product.price),
          quantity: item.quantity,
          subtotal: String(subtotal),
        });
      }
      await tx
        .update(schema.orders)
        .set({ total: String(total) })
        .where(eq(schema.orders.id, orderId));
    }
  });

  const [userCount] = await db.select({ value: sql<number>`count(*)`.mapWith(Number) }).from(schema.users);
  const [productCount] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(schema.products)
    .where(isNull(schema.products.deletedAt));
  const [lowStockCount] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(schema.products)
    .where(and(isNull(schema.products.deletedAt), lt(schema.products.stock, 5)));
  const [orderCount] = await db.select({ value: sql<number>`count(*)`.mapWith(Number) }).from(schema.orders);
  const [orderItemCount] = await db.select({ value: sql<number>`count(*)`.mapWith(Number) }).from(schema.orderItems);
  const [completedValue] = await db
    .select({
      value: sql<number>`coalesce(sum(${schema.orders.total}) filter (where ${schema.orders.status} = 'completed'), 0)`.mapWith(Number),
    })
    .from(schema.orders);
  console.log(
    `Seed complete: ${userCount.value} users, ${productCount.value} products (${lowStockCount.value} low stock), ` +
      `${orderCount.value} orders, ${orderItemCount.value} order items, completed value ${completedValue.value}.`,
  );
} catch (error) {
  console.error('Seed failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end();
}
