import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * 5 requests per 10 minutes per IP. Returns a no-op limiter when Upstash
 * env vars are missing so local dev and preview deploys don't block.
 */
export type Limiter = Pick<Ratelimit, "limit">;

let cached: Limiter | null = null;

export function getLimiter(): Limiter {
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cached = {
      limit: async () => ({
        success: true,
        limit: Infinity,
        remaining: Infinity,
        reset: 0,
        pending: Promise.resolve(),
      }),
    };
    return cached;
  }

  cached = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "ratelimit:contact",
  });
  return cached;
}
