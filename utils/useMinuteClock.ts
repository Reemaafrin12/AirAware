import { useEffect, useState } from 'react';

/** Re-renders freshness labels at minute-level precision. */
export function useMinuteClock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return now;
}
