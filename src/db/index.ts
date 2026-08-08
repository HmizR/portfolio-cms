import "server-only";

import { Pool } from "pg";

import { createDatabaseClient } from "@/db/client";
import { env } from "@/lib/env/server";

declare global {
  var databasePool: Pool | undefined;
}

const { database: db, pool } = createDatabaseClient(
  env.DATABASE_URL,
  globalThis.databasePool,
);

if (process.env.NODE_ENV !== "production") {
  globalThis.databasePool = pool;
}

export { db, pool };
