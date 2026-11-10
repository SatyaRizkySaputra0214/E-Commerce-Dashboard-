import { defineEventHandler } from 'h3';
import { apiSuccess } from '../../utils/api';
import { requireAuth } from '../../utils/session';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;
  return apiSuccess(auth.user, 'Current user retrieved.');
});
