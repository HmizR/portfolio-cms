import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function createDatabaseClient(databaseUrl: string, existingPool?: Pool) {
  const pool =
    existingPool ??
    new Pool({
      connectionString: databaseUrl,
      max: 10,
    });

  return {
    database: drizzle({ client: pool }),
    pool,
  };
}
