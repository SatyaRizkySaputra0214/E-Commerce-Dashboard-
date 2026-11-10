import { defineEventHandler } from 'h3';
import { apiSuccess } from '../../utils/api';
import { destroySession, requireAuth } from '../../utils/session';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;
  await destroySession(event);
  return apiSuccess(null, 'Logged out successfully.');
});
