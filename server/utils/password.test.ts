import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('hashPassword', () => {
  it('stores a scrypt hash with a random salt', () => {
    const stored = hashPassword('AdminDemo123!');
    expect(stored).toMatch(/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/);
  });

  it('produces a different hash for the same password', () => {
    expect(hashPassword('same-password')).not.toBe(hashPassword('same-password'));
  });
});

describe('verifyPassword', () => {
  it('verifies the correct password', () => {
    const stored = hashPassword('AdminDemo123!');
    expect(verifyPassword('AdminDemo123!', stored)).toBe(true);
  });

  it('rejects a wrong password', () => {
    const stored = hashPassword('AdminDemo123!');
    expect(verifyPassword('WrongDemo123!', stored)).toBe(false);
  });

  it('rejects malformed stored values', () => {
    expect(verifyPassword('x', '')).toBe(false);
    expect(verifyPassword('x', 'md5:aa:bb')).toBe(false);
    expect(verifyPassword('x', 'scrypt:zz:zz')).toBe(false);
    expect(verifyPassword('x', 'scrypt::')).toBe(false);
  });
});
