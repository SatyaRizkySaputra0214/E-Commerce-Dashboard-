import { asc, eq, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery, getRouterParam, setResponseStatus } from 'h3';
import type { OrderDetail } from '#shared/types/api';
import { orderItems, orders } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { toOrderDetail } from '../../utils/order';
import { requireAuth } from '../../utils/session';
import { parseId } from '../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const id = parseId(getRouterParam(event, 'id'));
  if (!id) {
    setResponseStatus(event, 404);
    return apiFailure('Order not found.');
  }

  const query = getQuery(event);
  const itemsPage = Math.max(1, parseInt(typeof query.itemsPage === 'string' ? query.itemsPage : '1', 10));
  const itemsLimit = Math.min(100, Math.max(1, parseInt(typeof query.itemsLimit === 'string' ? query.itemsLimit : '10', 10)));

  const db = useDb();
  const orderRows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = orderRows[0];
  if (!order) {
    setResponseStatus(event, 404);
    return apiFailure('Order not found.');
  }

  const [itemRows, totalItemsRows] = await Promise.all([
    db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))
      .orderBy(asc(orderItems.id))
      .limit(itemsLimit)
      .offset((itemsPage - 1) * itemsLimit),
    db
      .select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(orderItems)
      .where(eq(orderItems.orderId, id)),
  ]);

  const totalItems = totalItemsRows[0]?.total ?? 0;
  const totalPages = Math.ceil(totalItems / itemsLimit);

  const detail: OrderDetail = {
    ...toOrderDetail(order, itemRows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      productId: row.productId,
      productName: row.productName,
      unitPrice: row.unitPrice,
      quantity: row.quantity,
      subtotal: row.subtotal,
    }))),
    itemsTotal: totalItems,
    itemsPage,
    itemsLimit,
    itemsTotalPages: totalPages,
  };

  return apiSuccess(detail, 'Order details retrieved.');
});
