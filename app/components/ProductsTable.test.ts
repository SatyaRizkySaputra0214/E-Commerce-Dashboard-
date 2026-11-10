import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { Product } from '#shared/types/api';
import AppIcon from './AppIcon.vue';
import ProductsTable from './ProductsTable.vue';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Toba Overshirt',
    category: 'Apparel',
    price: 349000,
    stock: 24,
  },
  {
    id: 2,
    name: 'Batik Cushion Cover',
    category: 'Home Living',
    price: 159000,
    stock: 3,
  },
];

describe('ProductsTable', () => {
  it('renders product rows with name, category, price, and stock', () => {
    const wrapper = mount(ProductsTable, {
      props: {
        products: sampleProducts,
        isAdmin: true,
      },
      global: {
        components: { AppIcon },
      },
    });

    const text = wrapper.text();
    expect(text).toContain('Toba Overshirt');
    expect(text).toContain('Apparel');
    expect(text).toContain('Rp349.000');
    expect(text).toContain('24');

    expect(text).toContain('Batik Cushion Cover');
    expect(text).toContain('Home Living');
    expect(text).toContain('Rp159.000');
    expect(text).toContain('3');
  });

  it('highlights low stock products (stock < 5)', () => {
    const wrapper = mount(ProductsTable, {
      props: {
        products: sampleProducts,
        isAdmin: true,
      },
      global: {
        components: { AppIcon },
      },
    });

    // The second product has stock 3 (< 5), so it should have text-pending-ink class
    const lowStockElements = wrapper.findAll('.text-pending-ink');
    expect(lowStockElements.length).toBeGreaterThan(0);
  });

  it('renders edit and delete action buttons when isAdmin is true and emits events', async () => {
    const wrapper = mount(ProductsTable, {
      props: {
        products: sampleProducts,
        isAdmin: true,
      },
      global: {
        components: { AppIcon },
      },
    });

    const editButtons = wrapper.findAll('button[aria-label^="Edit"]');
    const deleteButtons = wrapper.findAll('button[aria-label^="Delete"]');

    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);

    await editButtons[0]?.trigger('click');
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([sampleProducts[0]]);

    await deleteButtons[1]?.trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual([sampleProducts[1]]);
  });

  it('hides edit and delete action buttons when isAdmin is false', () => {
    const wrapper = mount(ProductsTable, {
      props: {
        products: sampleProducts,
        isAdmin: false,
      },
      global: {
        components: { AppIcon },
      },
    });

    const editButtons = wrapper.findAll('button[aria-label^="Edit"]');
    const deleteButtons = wrapper.findAll('button[aria-label^="Delete"]');

    expect(editButtons.length).toBe(0);
    expect(deleteButtons.length).toBe(0);
  });
});
