import { loadEnvConfig } from "@next/env";
import { sql } from "drizzle-orm";

import { createDatabaseClient } from "../src/db/client";
import { parseServerEnvironment } from "../src/lib/env/schema";

async function checkDatabase(): Promise<void> {
  const { combinedEnv } = loadEnvConfig(process.cwd());
  const env = parseServerEnvironment(combinedEnv);
  const { database, pool } = createDatabaseClient(env.DATABASE_URL);

  try {
    await database.execute(sql`select 1 as healthy`);
    console.log("PostgreSQL connection: OK");
  } finally {
    await pool.end();
  }
}

checkDatabase().catch((error: unknown) => {
  console.error("PostgreSQL connection failed", error);
  process.exitCode = 1;
});
