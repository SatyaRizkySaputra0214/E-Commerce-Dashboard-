import type { OrderStatus } from '#shared/types/api';

/** Upper bounds mirroring the products table (text ≤ 255, numeric(12,2), integer). */
const MAX_TEXT_LENGTH = 255;
const MAX_PRICE = 9999999999.99;
const MAX_STOCK = 2147483647;

export const ORDER_STATUSES: readonly OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'] as const;

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type ProductParseResult = { ok: true; values: ProductInput } | { ok: false; errors: Record<string, string> };

export type StatusParseResult = { ok: true; status: OrderStatus } | { ok: false; errors: Record<string, string> };

/** Parses a value that may arrive as a number or a numeric string; rejects anything else. */
export function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Parses a positive-integer route parameter, returning null when malformed. */
export function parseId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return parsed > 0 && parsed <= MAX_STOCK ? parsed : null;
}

/** Validates a product payload from a request body; collects every field error at once. */
export function parseProductInput(body: unknown): ProductParseResult {
  const errors: Record<string, string> = {};
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};

  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const category = typeof record.category === 'string' ? record.category.trim() : '';
  const price = parseFiniteNumber(record.price);
  const stock = parseFiniteNumber(record.stock);

  if (!name) errors.name = 'Product name is required.';
  else if (name.length > MAX_TEXT_LENGTH) errors.name = 'Product name must be 255 characters or fewer.';

  if (!category) errors.category = 'Category is required.';
  else if (category.length > MAX_TEXT_LENGTH) errors.category = 'Category must be 255 characters or fewer.';

  if (price === null) errors.price = record.price === undefined ? 'Price is required.' : 'Price must be a number.';
  else if (price <= 0) errors.price = 'Price must be greater than zero.';
  else if (price > MAX_PRICE) errors.price = 'Price must be 9999999999.99 or less.';

  if (stock === null) errors.stock = record.stock === undefined ? 'Stock is required.' : 'Stock must be a whole number.';
  else if (!Number.isInteger(stock)) errors.stock = 'Stock must be a whole number.';
  else if (stock < 0) errors.stock = 'Stock cannot be negative.';
  else if (stock > MAX_STOCK) errors.stock = 'Stock must be 2147483647 or less.';

  if (Object.keys(errors).length > 0 || price === null || stock === null) return { ok: false, errors };
  return { ok: true, values: { name, category, price, stock } };
}

/** Checks whether a value is one of the valid order status strings. */
export function isValidOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Validates a status update payload from a request body. */
export function parseStatusUpdateInput(body: unknown): StatusParseResult {
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const status = typeof record.status === 'string' ? record.status.trim() : '';

  if (!status) {
    return { ok: false, errors: { status: 'Order status is required.' } };
  }

  if (!isValidOrderStatus(status)) {
    return {
      ok: false,
      errors: { status: 'Status must be one of: pending, processing, completed, cancelled.' },
    };
  }

  return { ok: true, status };
}
