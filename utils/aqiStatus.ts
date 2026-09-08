import type { AQIReading } from '../types/airQuality';

export function formatAQIUpdateStatus(reading: AQIReading, now = Date.now()): string {
  if (!reading.fetchedAt) return 'Last updated: unavailable';

  const elapsedMinutes = Math.max(0, Math.floor((now - reading.fetchedAt) / 60_000));
  const age = elapsedMinutes === 0 ? 'just now' : `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;

  return reading.dataSource === 'cache'
    ? `Showing cached data from ${age} (offline)`
    : `Live data - Last updated ${age}`;
}
