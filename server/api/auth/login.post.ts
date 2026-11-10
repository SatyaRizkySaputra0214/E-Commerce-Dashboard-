import { sql } from 'drizzle-orm';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import type { AuthUser } from '#shared/types/auth';
import { users } from '../../database/schema';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { hashPassword, verifyPassword } from '../../utils/password';
import { createSession } from '../../utils/session';

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

/** Hash with the same cost as real hashes, used to equalise login timing for unknown emails. */
const DUMMY_HASH = hashPassword('loka-timing-equalizer');

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event).catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  const errors: Record<string, string> = {};
  if (!email) errors.email = 'Email is required.';
  if (!password) errors.password = 'Password is required.';
  if (Object.keys(errors).length > 0) {
    setResponseStatus(event, 422);
    return apiFailure('Validation failed.', errors);
  }

  try {
    const db = useDb();
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1);
    const user = rows[0];
    if (!user) {
      verifyPassword(password, DUMMY_HASH);
      setResponseStatus(event, 401);
      return apiFailure('Invalid email or password.');
    }
    if (!verifyPassword(password, user.passwordHash)) {
      setResponseStatus(event, 401);
      return apiFailure('Invalid email or password.');
    }
    await createSession(event, user.id);
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
    return apiSuccess(authUser, 'Login successful.');
  } catch {
    setResponseStatus(event, 500);
    return apiFailure('Login failed. Please try again.');
  }
});
