export const RESERVATION_RATE_LIMIT_MAX = 10;
export const RESERVATION_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type RateLimitEntry = { count: number; resetAt: number };

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export type RateLimiter = {
  check: (key: string) => RateLimitResult;
  reset: () => void;
};

export function createRateLimiter(options: {
  max?: number;
  windowMs?: number;
  now?: () => number;
} = {}): RateLimiter {
  const max = options.max ?? RESERVATION_RATE_LIMIT_MAX;
  const windowMs = options.windowMs ?? RESERVATION_RATE_LIMIT_WINDOW_MS;
  const now = options.now ?? Date.now;
  const entries = new Map<string, RateLimitEntry>();

  function removeExpiredEntries(currentTime: number) {
    for (const [key, entry] of entries) {
      if (entry.resetAt <= currentTime) entries.delete(key);
    }
  }

  return {
    check(key) {
      const currentTime = now();
      removeExpiredEntries(currentTime);
      const entry = entries.get(key);

      if (!entry || entry.resetAt <= currentTime) {
        entries.set(key, { count: 1, resetAt: currentTime + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (entry.count < max) {
        entry.count += 1;
        return { allowed: true, retryAfterSeconds: 0 };
      }

      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000)),
      };
    },
    reset() {
      entries.clear();
    },
  };
}

// This limiter is intentionally process-local for the current single-instance deployment.
// It resets on process restart; multiple instances will require shared storage later.
export const reservationRateLimiter = createRateLimiter();
