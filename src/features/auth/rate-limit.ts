import "server-only";

import { createHmac } from "node:crypto";

import { pool } from "@/db";
import { env } from "@/lib/env/server";

export const LOGIN_RATE_LIMIT_MAX = 5;
export const LOGIN_RATE_LIMIT_WINDOW_MINUTES = 15;

const windowMilliseconds = LOGIN_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

function loginRateLimitKey(email: string): string {
  const digest = createHmac("sha256", env.AUTH_SECRET)
    .update(email)
    .digest("hex");
  return `login:${digest}`;
}

export async function consumeLoginAttempt(email: string): Promise<boolean> {
  const key = loginRateLimitKey(email);
  const now = Date.now();
  const windowStart = now - windowMilliseconds;
  const result = await pool.query<{ count: number }>(
    `insert into rate_limits (id, key, count, last_request)
     values ($1, $1, 1, $2)
     on conflict (key) do update set
       count = case
         when rate_limits.last_request < $3 then 1
         else rate_limits.count + 1
       end,
       last_request = case
         when rate_limits.last_request < $3 then $2
         else rate_limits.last_request
       end
     returning count`,
    [key, now, windowStart],
  );

  return (result.rows[0]?.count ?? LOGIN_RATE_LIMIT_MAX + 1) <= LOGIN_RATE_LIMIT_MAX;
}

export async function clearLoginAttempts(email: string): Promise<void> {
  await pool.query("delete from rate_limits where key = $1", [loginRateLimitKey(email)]);
}
