import { describe, expect, it } from 'vitest';
import { createSessionToken, hashSessionToken } from './session';

describe('createSessionToken', () => {
  it('creates long opaque base64url tokens', () => {
    const token = createSessionToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBeGreaterThanOrEqual(40);
  });

  it('creates unique tokens', () => {
    expect(createSessionToken()).not.toBe(createSessionToken());
  });
});

describe('hashSessionToken', () => {
  it('derives a stable HMAC-SHA256 hash for a secret', () => {
    const first = hashSessionToken('token', 'secret');
    expect(first).toBe(hashSessionToken('token', 'secret'));
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it('differs per token and per secret', () => {
    const base = hashSessionToken('token', 'secret');
    expect(hashSessionToken('token', 'other-secret')).not.toBe(base);
    expect(hashSessionToken('other-token', 'secret')).not.toBe(base);
  });
});
