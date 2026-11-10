import { and, eq, gt } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';
import { createError, deleteCookie, getCookie, setCookie, setResponseStatus, type H3Event } from 'h3';
import type { ApiFailure } from '#shared/types/api';
import type { AuthUser } from '#shared/types/auth';
import { sessions, users } from '../database/schema';
import { apiFailure } from './api';
import { useDb, type Db } from './db';

export const SESSION_COOKIE = 'loka_admin_session';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export type AuthGuard = { ok: true; user: AuthUser } | { ok: false; response: ApiFailure };

/** Reads the session secret from the environment. */
export function useSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session secret is not configured. Set SESSION_SECRET in your environment.',
    });
  }
  return secret;
}

/** Generates the opaque session token handed to the browser (HttpOnly cookie). */
export function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Derives the HMAC-SHA256 hash stored in the sessions table. */
export function hashSessionToken(token: string, secret: string): string {
  return createHmac('sha256', secret).update(token).digest('hex');
}

/** Creates a DB-backed session for the user and sets the session cookie. */
export async function createSession(event: H3Event, userId: number): Promise<void> {
  const db: Db = useDb();
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token, useSessionSecret());
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await db.insert(sessions).values({ tokenHash, userId, expiresAt });
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

/** Resolves the logged-in user from the session cookie, or null. */
export async function getSessionUser(event: H3Event): Promise<AuthUser | null> {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;
  const db: Db = useDb();
  const tokenHash = hashSessionToken(token, useSessionSecret());
  const rows = await db
    .select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return { id: row.id, email: row.email, fullName: row.fullName, role: row.role };
}

/** Deletes the current session server-side and clears the cookie. */
export async function destroySession(event: H3Event): Promise<void> {
  const token = getCookie(event, SESSION_COOKIE);
  deleteCookie(event, SESSION_COOKIE, { path: '/' });
  if (!token) return;
  const db: Db = useDb();
  await db.delete(sessions).where(eq(sessions.tokenHash, hashSessionToken(token, useSessionSecret())));
}

/**
 * Guard for authenticated endpoints.
 * On success returns the user; on failure returns the 401 failure envelope (status already set).
 */
export async function requireAuth(event: H3Event): Promise<AuthGuard> {
  const user = await getSessionUser(event);
  if (!user) {
    setResponseStatus(event, 401);
    return { ok: false, response: apiFailure('Authentication required. Please log in.') };
  }
  return { ok: true, user };
}

/**
 * Guard for admin-only endpoints.
 * Unauthenticated → 401; authenticated non-admin → 403 (status already set).
 */
export async function requireAdmin(event: H3Event): Promise<AuthGuard> {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth;
  if (auth.user.role !== 'admin') {
    setResponseStatus(event, 403);
    return { ok: false, response: apiFailure('Admin role required for this action.') };
  }
  return auth;
}
