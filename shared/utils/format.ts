/** Formats an IDR amount as `Rp250.000` — no decimals, id-ID digit grouping. */
export function formatIDR(value: number): string {
  return `Rp${Math.round(value).toLocaleString('id-ID')}`;
}

/** Formats a date in Asia/Jakarta as e.g. `10 Nov 2026, 14.30 WIB`. */
export function formatDateTimeWIB(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(value);
  return `${formatted} WIB`;
}
