import { and, asc, eq, ilike, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery } from 'h3';
import type { ProductListData } from '#shared/types/api';
import { products } from '../../database/schema';
import { apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { toProduct } from '../../utils/product';
import { requireAuth } from '../../utils/session';

/** Escapes LIKE wildcards so user input matches literally inside the ilike pattern. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const query = getQuery(event);
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const category = typeof query.category === 'string' ? query.category.trim() : '';
  const page = Math.max(1, parseInt(typeof query.page === 'string' ? query.page : '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(typeof query.limit === 'string' ? query.limit : '10', 10)));

  const active = isNull(products.deletedAt);
  const conditions = [active];
  if (search !== '') conditions.push(ilike(products.name, `%${escapeLike(search)}%`));
  if (category !== '') conditions.push(eq(products.category, category));
  const filtered = and(...conditions);

  const db = useDb();
  const [productRows, categoryRows, totalRows] = await Promise.all([
    db
      .select({ id: products.id, name: products.name, category: products.category, price: products.price, stock: products.stock })
      .from(products)
      .where(filtered)
      .orderBy(asc(products.name), asc(products.id))
      .limit(limit)
      .offset((page - 1) * limit),
    db.selectDistinct({ category: products.category }).from(products).where(active).orderBy(asc(products.category)),
    db
      .select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(products)
      .where(filtered),
  ]);

  const total = totalRows[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const data: ProductListData = {
    products: productRows.map(toProduct),
    categories: categoryRows.map((row) => row.category),
    total,
    page,
    limit,
    totalPages,
  };
  return apiSuccess(data, 'Products retrieved.');
});
