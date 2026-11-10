import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { OrderListItem } from '#shared/types/api';
import AppIcon from './AppIcon.vue';
import OrdersTable from './OrdersTable.vue';
import StatusPill from './StatusPill.vue';

const sampleOrders: OrderListItem[] = [
  {
    id: 1,
    orderNumber: 'ORD-2026-0001',
    customerName: 'Dewi Anggraini',
    customerEmail: 'dewi.anggraini@example.com',
    orderDate: '2026-10-14T03:44:36.276Z',
    total: 598000,
    status: 'completed',
  },
  {
    id: 2,
    orderNumber: 'ORD-2026-0002',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    orderDate: '2026-10-19T03:44:36.470Z',
    total: 1016000,
    status: 'pending',
  },
];

describe('OrdersTable', () => {
  it('renders order rows with order number, customer name, total, and status', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: sampleOrders },
      global: {
        components: { AppIcon, StatusPill },
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });

    const text = wrapper.text();
    expect(text).toContain('ORD-2026-0001');
    expect(text).toContain('Dewi Anggraini');
    expect(text).toContain('Rp598.000');
    expect(text).toContain('Completed');

    expect(text).toContain('ORD-2026-0002');
    expect(text).toContain('Budi Santoso');
    expect(text).toContain('Rp1.016.000');
    expect(text).toContain('Pending');
  });

  it('links each row to the corresponding order detail page', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: sampleOrders },
      global: {
        components: { AppIcon, StatusPill },
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });

    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);
    expect(links[0]?.attributes('href')).toBe('/orders/1');
    expect(links[1]?.attributes('href')).toBe('/orders/2');
  });
});
