import { sql } from 'drizzle-orm';
import { check, index, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { OrderStatus } from '../../shared/types/api';
import type { UserRole } from '../../shared/types/auth';

/**
 * Loka Store Admin — database schema (source of truth).
 * DDL migrations are generated with `yarn db:generate` (drizzle-kit) and stored in `drizzle/`.
 */

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    role: text('role').$type<UserRole>().notNull().default('staff'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [check('users_role_check', sql`${table.role} in ('admin', 'staff')`)],
);

export const products = pgTable(
  'products',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    stock: integer('stock').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    check('products_price_check', sql`${table.price} >= 0`),
    check('products_stock_check', sql`${table.stock} >= 0`),
    index('idx_products_category').on(table.category),
    index('idx_products_deleted_at').on(table.deletedAt),
  ],
);

export const orders = pgTable(
  'orders',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    orderNumber: text('order_number').notNull().unique(),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),
    status: text('status').$type<OrderStatus>().notNull().default('pending'),
    total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
    orderDate: timestamp('order_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    check('orders_status_check', sql`${table.status} in ('pending', 'processing', 'completed', 'cancelled')`),
    check('orders_total_check', sql`${table.total} >= 0`),
    index('idx_orders_status').on(table.status),
    index('idx_orders_order_date').on(table.orderDate),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
    productName: text('product_name').notNull(),
    unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    check('order_items_unit_price_check', sql`${table.unitPrice} >= 0`),
    check('order_items_quantity_check', sql`${table.quantity} > 0`),
    check('order_items_subtotal_check', sql`${table.subtotal} >= 0`),
    index('idx_order_items_order_id').on(table.orderId),
    index('idx_order_items_product_id').on(table.productId),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    tokenHash: text('token_hash').notNull().unique(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('idx_sessions_expires_at').on(table.expiresAt)],
);
