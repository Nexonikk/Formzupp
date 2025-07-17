import { RateLimiterMemory } from "rate-limiter-flexible";
import { headers } from "next/headers";

export const rateLimiter = new RateLimiterMemory({
  points: 4,
  duration: 400,
});

export async function GetUserIP() {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "";
  return ip;
}
