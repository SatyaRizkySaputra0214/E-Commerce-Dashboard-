import { describe, expect, it } from 'vitest';
import { toProduct } from './product';

describe('toProduct', () => {
  it('maps database row with string price to product object with numeric price', () => {
    const row = {
      id: 1,
      name: 'Toba Overshirt',
      category: 'Apparel',
      price: '349000.00',
      stock: 24,
    };
    const product = toProduct(row);
    expect(product).toEqual({
      id: 1,
      name: 'Toba Overshirt',
      category: 'Apparel',
      price: 349000,
      stock: 24,
    });
    expect(typeof product.price).toBe('number');
  });

  it('handles decimal prices correctly', () => {
    const row = {
      id: 2,
      name: 'Special Blend Coffee',
      category: 'Coffee',
      price: '149500.50',
      stock: 5,
    };
    const product = toProduct(row);
    expect(product.price).toBe(149500.5);
  });

  it('handles zero stock and zero price', () => {
    const row = {
      id: 3,
      name: 'Free Sample',
      category: 'Promo',
      price: '0.00',
      stock: 0,
    };
    const product = toProduct(row);
    expect(product.price).toBe(0);
    expect(product.stock).toBe(0);
  });
});
