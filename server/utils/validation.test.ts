import { describe, expect, it } from 'vitest';
import { isValidOrderStatus, parseFiniteNumber, parseId, parseProductInput, parseStatusUpdateInput } from './validation';

describe('parseFiniteNumber', () => {
  it('accepts finite numbers and numeric strings', () => {
    expect(parseFiniteNumber(12.5)).toBe(12.5);
    expect(parseFiniteNumber(0)).toBe(0);
    expect(parseFiniteNumber(-3)).toBe(-3);
    expect(parseFiniteNumber(' 149000 ')).toBe(149000);
    expect(parseFiniteNumber('12.50')).toBe(12.5);
  });

  it('rejects non-numeric, empty, and non-finite input', () => {
    expect(parseFiniteNumber('abc')).toBeNull();
    expect(parseFiniteNumber('12abc')).toBeNull();
    expect(parseFiniteNumber('12e')).toBeNull();
    expect(parseFiniteNumber('')).toBeNull();
    expect(parseFiniteNumber('   ')).toBeNull();
    expect(parseFiniteNumber(true)).toBeNull();
    expect(parseFiniteNumber(false)).toBeNull();
    expect(parseFiniteNumber(null)).toBeNull();
    expect(parseFiniteNumber(undefined)).toBeNull();
    expect(parseFiniteNumber({})).toBeNull();
    expect(parseFiniteNumber(Number.NaN)).toBeNull();
    expect(parseFiniteNumber(Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('parseId', () => {
  it('accepts positive integer strings', () => {
    expect(parseId('1')).toBe(1);
    expect(parseId('42')).toBe(42);
  });

  it('rejects malformed, zero, negative, and overflowing ids', () => {
    expect(parseId(undefined)).toBeNull();
    expect(parseId('')).toBeNull();
    expect(parseId('abc')).toBeNull();
    expect(parseId('12.5')).toBeNull();
    expect(parseId('-1')).toBeNull();
    expect(parseId('1e3')).toBeNull();
    expect(parseId('0')).toBeNull();
    expect(parseId(' 5')).toBeNull();
    expect(parseId('99999999999')).toBeNull();
  });
});

describe('parseProductInput', () => {
  it('accepts a valid payload and trims name and category', () => {
    const result = parseProductInput({ name: '  Toba Coffee  ', category: 'Coffee', price: '149000.5', stock: 24 });
    expect(result).toEqual({ ok: true, values: { name: 'Toba Coffee', category: 'Coffee', price: 149000.5, stock: 24 } });
  });

  it('accepts numeric types and zero stock', () => {
    const result = parseProductInput({ name: 'Kopi Sachet', category: 'Coffee', price: 2500, stock: 0 });
    expect(result).toEqual({ ok: true, values: { name: 'Kopi Sachet', category: 'Coffee', price: 2500, stock: 0 } });
  });

  it('requires name and category', () => {
    const result = parseProductInput({ price: 10, stock: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBe('Product name is required.');
      expect(result.errors.category).toBe('Category is required.');
    }
  });

  it('rejects whitespace-only name and category', () => {
    const result = parseProductInput({ name: '   ', category: '', price: 10, stock: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBe('Product name is required.');
      expect(result.errors.category).toBe('Category is required.');
    }
  });

  it('rejects missing price and stock', () => {
    const result = parseProductInput({ name: 'A', category: 'B' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.price).toBe('Price is required.');
      expect(result.errors.stock).toBe('Stock is required.');
    }
  });

  it('rejects zero and negative prices', () => {
    expect(parseProductInput({ name: 'A', category: 'B', price: 0, stock: 1 })).toMatchObject({
      ok: false,
      errors: { price: 'Price must be greater than zero.' },
    });
    expect(parseProductInput({ name: 'A', category: 'B', price: -5, stock: 1 })).toMatchObject({
      ok: false,
      errors: { price: 'Price must be greater than zero.' },
    });
  });

  it('rejects non-numeric prices', () => {
    expect(parseProductInput({ name: 'A', category: 'B', price: 'abc', stock: 1 })).toMatchObject({
      ok: false,
      errors: { price: 'Price must be a number.' },
    });
    expect(parseProductInput({ name: 'A', category: 'B', price: '', stock: 1 })).toMatchObject({
      ok: false,
      errors: { price: 'Price must be a number.' },
    });
  });

  it('rejects prices above the numeric(12,2) bound', () => {
    expect(parseProductInput({ name: 'A', category: 'B', price: 10000000000, stock: 1 })).toMatchObject({
      ok: false,
      errors: { price: 'Price must be 9999999999.99 or less.' },
    });
  });

  it('rejects decimal, negative, and non-numeric stock', () => {
    expect(parseProductInput({ name: 'A', category: 'B', price: 10, stock: 2.5 })).toMatchObject({
      ok: false,
      errors: { stock: 'Stock must be a whole number.' },
    });
    expect(parseProductInput({ name: 'A', category: 'B', price: 10, stock: -1 })).toMatchObject({
      ok: false,
      errors: { stock: 'Stock cannot be negative.' },
    });
    expect(parseProductInput({ name: 'A', category: 'B', price: 10, stock: 'many' })).toMatchObject({
      ok: false,
      errors: { stock: 'Stock must be a whole number.' },
    });
  });

  it('rejects stock above the integer bound', () => {
    expect(parseProductInput({ name: 'A', category: 'B', price: 10, stock: 2147483648 })).toMatchObject({
      ok: false,
      errors: { stock: 'Stock must be 2147483647 or less.' },
    });
  });

  it('rejects overly long name and category', () => {
    const long = 'a'.repeat(256);
    expect(parseProductInput({ name: long, category: 'B', price: 10, stock: 1 })).toMatchObject({
      ok: false,
      errors: { name: 'Product name must be 255 characters or fewer.' },
    });
    expect(parseProductInput({ name: 'A', category: long, price: 10, stock: 1 })).toMatchObject({
      ok: false,
      errors: { category: 'Category must be 255 characters or fewer.' },
    });
  });

  it('rejects non-object payloads', () => {
    expect(parseProductInput(null).ok).toBe(false);
    expect(parseProductInput('nope').ok).toBe(false);
    expect(parseProductInput(undefined).ok).toBe(false);
  });
});

describe('isValidOrderStatus', () => {
  it('accepts valid statuses', () => {
    expect(isValidOrderStatus('pending')).toBe(true);
    expect(isValidOrderStatus('processing')).toBe(true);
    expect(isValidOrderStatus('completed')).toBe(true);
    expect(isValidOrderStatus('cancelled')).toBe(true);
  });

  it('rejects invalid or non-string statuses', () => {
    expect(isValidOrderStatus('shipped')).toBe(false);
    expect(isValidOrderStatus('')).toBe(false);
    expect(isValidOrderStatus('PENDING')).toBe(false);
    expect(isValidOrderStatus(null)).toBe(false);
    expect(isValidOrderStatus(undefined)).toBe(false);
    expect(isValidOrderStatus(123)).toBe(false);
  });
});

describe('parseStatusUpdateInput', () => {
  it('accepts valid status values and trims whitespace', () => {
    const result = parseStatusUpdateInput({ status: '  processing  ' });
    expect(result).toEqual({ ok: true, status: 'processing' });
  });

  it('requires status field', () => {
    const missing = parseStatusUpdateInput({});
    expect(missing).toEqual({ ok: false, errors: { status: 'Order status is required.' } });

    const empty = parseStatusUpdateInput({ status: '   ' });
    expect(empty).toEqual({ ok: false, errors: { status: 'Order status is required.' } });
  });

  it('rejects unknown status values', () => {
    const invalid = parseStatusUpdateInput({ status: 'in_transit' });
    expect(invalid).toEqual({
      ok: false,
      errors: { status: 'Status must be one of: pending, processing, completed, cancelled.' },
    });
  });
});
