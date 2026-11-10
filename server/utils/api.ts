import type { ApiFailure, ApiSuccess } from '#shared/types/api';

/** Wraps a payload in the standard success envelope. */
export function apiSuccess<T>(data: T, message = 'Request successful.'): ApiSuccess<T> {
  return { success: true, message, data };
}

/** Wraps an error message in the standard failure envelope. */
export function apiFailure(message: string, errors?: Record<string, string>): ApiFailure {
  return errors === undefined ? { success: false, message } : { success: false, message, errors };
}
