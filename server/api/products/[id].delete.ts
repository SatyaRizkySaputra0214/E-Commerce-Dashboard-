import { and, eq, isNull } from 'drizzle-orm';
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';
import { products } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { requireAdmin } from '../../utils/session';
import { parseId } from '../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAdmin(event);
  if (!auth.ok) return auth.response;

  const id = parseId(getRouterParam(event, 'id'));
  if (!id) {
    setResponseStatus(event, 400);
    return apiFailure('Invalid product id.');
  }

  try {
    const db = useDb();
    const rows = await db
      .update(products)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning({ id: products.id });
    const row = rows[0];
    if (!row) {
      setResponseStatus(event, 404);
      return apiFailure('Product not found.');
    }
    return apiSuccess({ id: row.id }, 'Product successfully deleted.');
  } catch {
    setResponseStatus(event, 500);
    return apiFailure('Failed to delete product. Please try again.');
  }
});
