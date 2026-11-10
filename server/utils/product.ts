import { and, eq, isNull } from 'drizzle-orm';
import type { Product } from '#shared/types/api';
import { products } from '../database/schema';
import type { Db } from './db';

type ProductRow = typeof products.$inferSelect;

/** Column subset shared by full-row and projected selects. */
type ProductFields = Pick<ProductRow, 'id' | 'name' | 'category' | 'price' | 'stock'>;

/** Maps a products table row to the API product shape (numeric price → number). */
export function toProduct(row: ProductFields): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    stock: row.stock,
  };
}

/** Finds a single active (non-deleted) product row by id. */
export async function findActiveProduct(db: Db, id: number): Promise<ProductRow | null> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}
