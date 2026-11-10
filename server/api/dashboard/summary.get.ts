import { isNull, sql } from 'drizzle-orm';
import { defineEventHandler, setResponseStatus } from 'h3';
import type { DashboardSummary } from '#shared/types/api';
import { orders, products } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { requireAuth } from '../../utils/session';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const db = useDb();
  const productRows = await db
    .select({
      totalProducts: sql<number>`count(*)`.mapWith(Number),
      lowStockProducts: sql<number>`count(*) filter (where ${products.stock} < 5)`.mapWith(Number),
    })
    .from(products)
    .where(isNull(products.deletedAt));
  const orderRows = await db
    .select({
      totalOrders: sql<number>`count(*)`.mapWith(Number),
      completedOrderValue: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'completed'), 0)`.mapWith(Number),
    })
    .from(orders);

  const productRow = productRows[0];
  const orderRow = orderRows[0];
  if (!productRow || !orderRow) {
    setResponseStatus(event, 500);
    return apiFailure('Failed to compute the dashboard summary.');
  }
  const summary: DashboardSummary = {
    totalProducts: productRow.totalProducts,
    totalOrders: orderRow.totalOrders,
    completedOrderValue: orderRow.completedOrderValue,
    lowStockProducts: productRow.lowStockProducts,
  };
  return apiSuccess(summary, 'Dashboard summary retrieved.');
});
