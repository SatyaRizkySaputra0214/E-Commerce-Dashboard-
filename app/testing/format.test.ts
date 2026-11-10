import { describe, expect, it } from 'vitest';
import { formatDateTimeWIB, formatIDR } from '#shared/utils/format';

describe('formatIDR', () => {
  it('formats whole rupiah without decimals', () => {
    expect(formatIDR(250000)).toBe('Rp250.000');
  });

  it('formats millions with id-ID grouping', () => {
    expect(formatIDR(2390000)).toBe('Rp2.390.000');
  });

  it('rounds fractional values', () => {
    expect(formatIDR(149999.99)).toBe('Rp150.000');
  });

  it('handles zero', () => {
    expect(formatIDR(0)).toBe('Rp0');
  });
});

describe('formatDateTimeWIB', () => {
  it('renders the WIB timezone label', () => {
    expect(formatDateTimeWIB('2026-11-10T07:30:00Z')).toMatch(/WIB$/);
  });

  it('converts UTC to Jakarta time (UTC+7)', () => {
    const result = formatDateTimeWIB('2026-11-10T07:30:00Z');
    expect(result).toContain('10 Nov 2026');
    expect(result).toContain('14:30');
  });
});
