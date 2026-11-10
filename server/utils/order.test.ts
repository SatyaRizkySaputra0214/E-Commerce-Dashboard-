import { describe, expect, it } from 'vitest';
import { toOrderDetail, toOrderItem, toOrderListItem } from './order';

describe('toOrderListItem', () => {
  it('maps database row with string total to OrderListItem with numeric total', () => {
    const row = {
      id: 1,
      orderNumber: 'ORD-2026-0001',
      customerName: 'Dewi Anggraini',
      customerEmail: 'dewi.anggraini@example.com',
      orderDate: new Date('2026-10-14T03:44:36.276Z'),
      total: '598000.00',
      status: 'completed' as const,
    };
    const item = toOrderListItem(row);
    expect(item).toEqual({
      id: 1,
      orderNumber: 'ORD-2026-0001',
      customerName: 'Dewi Anggraini',
      customerEmail: 'dewi.anggraini@example.com',
      orderDate: '2026-10-14T03:44:36.276Z',
      total: 598000,
      status: 'completed',
    });
    expect(typeof item.total).toBe('number');
  });

  it('handles string orderDate values', () => {
    const row = {
      id: 2,
      orderNumber: 'ORD-2026-0002',
      customerName: 'Budi Santoso',
      customerEmail: 'budi.santoso@example.com',
      orderDate: '2026-10-19T03:44:36.470Z' as unknown as Date,
      total: '1016000.00',
      status: 'completed' as const,
    };
    const item = toOrderListItem(row);
    expect(item.orderDate).toBe('2026-10-19T03:44:36.470Z');
  });
});

describe('toOrderItem', () => {
  it('maps database order item with numeric strings to numbers', () => {
    const row = {
      id: 10,
      orderId: 1,
      productId: 5,
      productName: 'Toba Overshirt',
      unitPrice: '349000.00',
      quantity: 2,
      subtotal: '698000.00',
    };
    const item = toOrderItem(row);
    expect(item).toEqual({
      id: 10,
      orderId: 1,
      productId: 5,
      productName: 'Toba Overshirt',
      unitPrice: 349000,
      quantity: 2,
      subtotal: 698000,
    });
    expect(typeof item.unitPrice).toBe('number');
    expect(typeof item.subtotal).toBe('number');
  });
});

describe('toOrderDetail', () => {
  it('combines order row and items into a full OrderDetail', () => {
    const orderRow = {
      id: 1,
      orderNumber: 'ORD-2026-0001',
      customerName: 'Dewi Anggraini',
      customerEmail: 'dewi.anggraini@example.com',
      status: 'completed' as const,
      total: '598000.00',
      orderDate: new Date('2026-10-14T03:44:36.276Z'),
      createdAt: new Date('2026-11-10T03:44:35.867Z'),
      updatedAt: new Date('2026-11-10T03:44:35.867Z'),
    };
    const items = [
      {
        id: 1,
        orderId: 1,
        productId: 1,
        productName: 'Toba Overshirt',
        unitPrice: '349000.00',
        quantity: 1,
        subtotal: '349000.00',
      },
    ];
    const detail = toOrderDetail(orderRow, items);
    expect(detail.id).toBe(1);
    expect(detail.orderNumber).toBe('ORD-2026-0001');
    expect(detail.total).toBe(598000);
    expect(detail.items).toHaveLength(1);
    expect(detail.items[0]?.productName).toBe('Toba Overshirt');
  });
});
