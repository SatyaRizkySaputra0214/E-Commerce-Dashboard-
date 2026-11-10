import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { products } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { toProduct } from '../../utils/product';
import { requireAdmin } from '../../utils/session';
import { parseProductInput } from '../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAdmin(event);
  if (!auth.ok) return auth.response;

  const body = await readBody(event).catch(() => null);
  const parsed = parseProductInput(body);
  if (!parsed.ok) {
    setResponseStatus(event, 422);
    return apiFailure('Validation failed.', parsed.errors);
  }

  try {
    const db = useDb();
    const rows = await db
      .insert(products)
      .values({
        name: parsed.values.name,
        category: parsed.values.category,
        price: parsed.values.price.toFixed(2),
        stock: parsed.values.stock,
      })
      .returning();
    const row = rows[0];
    if (!row) throw new Error('Insert returned no rows.');
    setResponseStatus(event, 201);
    return apiSuccess(toProduct(row), 'Product successfully created.');
  } catch {
    setResponseStatus(event, 500);
    return apiFailure('Failed to create product. Please try again.');
  }
});
