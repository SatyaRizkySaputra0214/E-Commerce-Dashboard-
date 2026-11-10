import { eq } from 'drizzle-orm';
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3';
import { orders } from '../../../database/schema';
import { apiFailure, apiSuccess } from '../../../utils/api';
import { useDb } from '../../../utils/db';
import { toOrderListItem } from '../../../utils/order';
import { requireAdmin } from '../../../utils/session';
import { parseId, parseStatusUpdateInput } from '../../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAdmin(event);
  if (!auth.ok) return auth.response;

  const id = parseId(getRouterParam(event, 'id'));
  if (!id) {
    setResponseStatus(event, 400);
    return apiFailure('Invalid order id.');
  }

  const body = await readBody(event).catch(() => null);
  const parsed = parseStatusUpdateInput(body);
  if (!parsed.ok) {
    setResponseStatus(event, 422);
    return apiFailure('Validation failed.', parsed.errors);
  }

  try {
    const db = useDb();
    const rows = await db
      .update(orders)
      .set({
        status: parsed.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    const row = rows[0];
    if (!row) {
      setResponseStatus(event, 404);
      return apiFailure('Order not found.');
    }

    return apiSuccess(toOrderListItem(row), 'Order status successfully updated.');
  } catch {
    setResponseStatus(event, 500);
    return apiFailure('Failed to update order status. Please try again.');
  }
});
