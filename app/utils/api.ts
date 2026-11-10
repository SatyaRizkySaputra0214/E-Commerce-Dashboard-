import type { ApiFailure } from '#shared/types/api';

/** Extracts the failure envelope from a $fetch error, if present. */
export function getApiFailure(error: unknown): ApiFailure | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const data = (error as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) return undefined;
  if ((data as { success?: unknown }).success !== false) return undefined;
  return data as ApiFailure;
}
