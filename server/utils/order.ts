import { asc, eq } from 'drizzle-orm';
import type { OrderDetail, OrderItem, OrderListItem } from '#shared/types/api';
import { orderItems, orders } from '../database/schema';
import type { Db } from './db';

type OrderRow = typeof orders.$inferSelect;
type OrderItemRow = typeof orderItems.$inferSelect;

type OrderListItemFields = Pick<OrderRow, 'id' | 'orderNumber' | 'customerName' | 'customerEmail' | 'orderDate' | 'total' | 'status'>;

type OrderItemFields = Pick<OrderItemRow, 'id' | 'orderId' | 'productId' | 'productName' | 'unitPrice' | 'quantity' | 'subtotal'>;

/** Maps an order database row to an OrderListItem for table listings. */
export function toOrderListItem(row: OrderListItemFields): OrderListItem {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    orderDate: row.orderDate instanceof Date ? row.orderDate.toISOString() : new Date(row.orderDate).toISOString(),
    total: Number(row.total),
    status: row.status,
  };
}

/** Maps an order_item database row to an OrderItem shape with numeric prices. */
export function toOrderItem(row: OrderItemFields): OrderItem {
  return {
    id: row.id,
    orderId: row.orderId,
    productId: row.productId,
    productName: row.productName,
    unitPrice: Number(row.unitPrice),
    quantity: row.quantity,
    subtotal: Number(row.subtotal),
  };
}

/** Combines an order row and its items into a full OrderDetail. */
export function toOrderDetail(order: OrderRow, items: OrderItemFields[]): OrderDetail {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    total: Number(order.total),
    orderDate: order.orderDate instanceof Date ? order.orderDate.toISOString() : new Date(order.orderDate).toISOString(),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : new Date(order.createdAt).toISOString(),
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : new Date(order.updatedAt).toISOString(),
    items: items.map(toOrderItem),
  };
}

/** Retrieves an order and all of its snapshot items by order ID, or null. */
export async function findOrderWithItems(db: Db, id: number): Promise<OrderDetail | null> {
  const orderRows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = orderRows[0];
  if (!order) return null;

  const itemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, id)).orderBy(asc(orderItems.id));

  return toOrderDetail(order, itemRows);
}
