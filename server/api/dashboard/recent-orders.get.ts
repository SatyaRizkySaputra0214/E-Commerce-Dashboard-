import { desc } from 'drizzle-orm';
import { defineEventHandler } from 'h3';
import type { RecentOrder } from '#shared/types/api';
import { orders } from '../../database/schema';
import { apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { requireAuth } from '../../utils/session';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const db = useDb();
  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      orderDate: orders.orderDate,
      total: orders.total,
      status: orders.status,
    })
    .from(orders)
    .orderBy(desc(orders.orderDate), desc(orders.id))
    .limit(5);
  const recentOrders: RecentOrder[] = rows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    orderDate: row.orderDate.toISOString(),
    total: Number(row.total),
    status: row.status,
  }));
  return apiSuccess(recentOrders, 'Recent orders retrieved.');
});
