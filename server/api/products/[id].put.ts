import { and, eq, isNull } from 'drizzle-orm';
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3';
import { products } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { toProduct } from '../../utils/product';
import { requireAdmin } from '../../utils/session';
import { parseId, parseProductInput } from '../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAdmin(event);
  if (!auth.ok) return auth.response;

  const id = parseId(getRouterParam(event, 'id'));
  if (!id) {
    setResponseStatus(event, 400);
    return apiFailure('Invalid product id.');
  }

  const body = await readBody(event).catch(() => null);
  const parsed = parseProductInput(body);
  if (!parsed.ok) {
    setResponseStatus(event, 422);
    return apiFailure('Validation failed.', parsed.errors);
  }

  try {
    const db = useDb();
    const rows = await db
      .update(products)
      .set({
        name: parsed.values.name,
        category: parsed.values.category,
        price: parsed.values.price.toFixed(2),
        stock: parsed.values.stock,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning();
    const row = rows[0];
    if (!row) {
      setResponseStatus(event, 404);
      return apiFailure('Product not found.');
    }
    return apiSuccess(toProduct(row), 'Product successfully updated.');
  } catch {
    setResponseStatus(event, 500);
    return apiFailure('Failed to update product. Please try again.');
  }
});
