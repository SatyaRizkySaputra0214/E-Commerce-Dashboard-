import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery, setResponseStatus } from 'h3';
import { orders } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { toOrderListItem } from '../../utils/order';
import { requireAuth } from '../../utils/session';
import { isValidOrderStatus } from '../../utils/validation';

/** Escapes LIKE wildcards so user input matches literally inside the ilike pattern. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const query = getQuery(event);
  const rawStatus = typeof query.status === 'string' ? query.status.trim().toLowerCase() : '';
  const search = typeof query.search === 'string' ? query.search.trim() : '';

  if (rawStatus !== '' && rawStatus !== 'all' && !isValidOrderStatus(rawStatus)) {
    setResponseStatus(event, 400);
    return apiFailure('Invalid status parameter. Allowed values: pending, processing, completed, cancelled, all.');
  }

  const db = useDb();
  const selectQuery = db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      orderDate: orders.orderDate,
      total: orders.total,
      status: orders.status,
    })
    .from(orders);

  const conditions = [];
  
  if (search !== '') {
    const searchPattern = `%${escapeLike(search)}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, searchPattern),
        ilike(orders.customerName, searchPattern),
        ilike(orders.customerEmail, searchPattern),
      ),
    );
  }

  if (rawStatus !== '' && rawStatus !== 'all' && isValidOrderStatus(rawStatus)) {
    conditions.push(eq(orders.status, rawStatus));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const page = Math.max(1, parseInt(typeof query.page === 'string' ? query.page : '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(typeof query.limit === 'string' ? query.limit : '10', 10)));

  const [rows, totalRows] = await Promise.all([
    whereClause
      ? selectQuery.where(whereClause).orderBy(desc(orders.orderDate), desc(orders.id)).limit(limit).offset((page - 1) * limit)
      : selectQuery.orderBy(desc(orders.orderDate), desc(orders.id)).limit(limit).offset((page - 1) * limit),
    db
      .select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(orders)
      .where(whereClause ?? sql`true`),
  ]);

  const total = totalRows[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return apiSuccess(
    {
      orders: rows.map(toOrderListItem),
      total,
      page,
      limit,
      totalPages,
    },
    'Orders retrieved.',
  );
});
