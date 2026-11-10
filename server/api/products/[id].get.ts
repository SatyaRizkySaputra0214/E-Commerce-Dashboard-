import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';
import { apiFailure, apiSuccess } from '../../utils/api';
import { useDb } from '../../utils/db';
import { findActiveProduct, toProduct } from '../../utils/product';
import { requireAuth } from '../../utils/session';
import { parseId } from '../../utils/validation';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  if (!auth.ok) return auth.response;

  const id = parseId(getRouterParam(event, 'id'));
  if (!id) {
    setResponseStatus(event, 404);
    return apiFailure('Product not found.');
  }

  const row = await findActiveProduct(useDb(), id);
  if (!row) {
    setResponseStatus(event, 404);
    return apiFailure('Product not found.');
  }
  return apiSuccess(toProduct(row), 'Product retrieved.');
});
