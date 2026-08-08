import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import { createDatabaseClient } from "../src/db/client";
import { parseServerEnvironment } from "../src/lib/env/schema";

function loadEnvironment() {
  loadEnvConfig(process.cwd());
  return parseServerEnvironment(process.env);
}

function getSafeTestDatabaseUrl(): {
  databaseName: string;
  databaseUrl: string;
  maintenanceUrl: string;
} {
  const { DATABASE_URL, TEST_DATABASE_URL } = loadEnvironment();
  const url = new URL(TEST_DATABASE_URL ?? DATABASE_URL);

  if (!TEST_DATABASE_URL) {
    url.pathname = `${url.pathname}_test`;
  }
  const databaseName = url.pathname.slice(1);

  if (!/^[a-z0-9_]+_test$/.test(databaseName)) {
    throw new Error("TEST_DATABASE_URL must target a database whose name ends in _test.");
  }

  const maintenanceUrl = new URL(url);
  maintenanceUrl.pathname = "/postgres";

  return {
    databaseName,
    databaseUrl: url.toString(),
    maintenanceUrl: maintenanceUrl.toString(),
  };
}

export async function prepareTestDatabase(): Promise<string> {
  const { databaseName, databaseUrl, maintenanceUrl } = getSafeTestDatabaseUrl();
  const maintenancePool = new Pool({ connectionString: maintenanceUrl });

  try {
    const existing = await maintenancePool.query<{ exists: boolean }>(
      "select exists(select 1 from pg_database where datname = $1) as exists",
      [databaseName],
    );

    if (!existing.rows[0]?.exists) {
      await maintenancePool.query(`create database "${databaseName}"`);
    }
  } finally {
    await maintenancePool.end();
  }

  const { database, pool } = createDatabaseClient(databaseUrl);

  try {
    await migrate(database, { migrationsFolder: "drizzle" });
    await pool.query(
      "truncate table rate_limits, verifications, sessions, accounts, users restart identity cascade",
    );
  } finally {
    await pool.end();
  }

  return databaseUrl;
}
