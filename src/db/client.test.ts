import { Pool } from "pg";
import { describe, expect, it } from "vitest";

import { createDatabaseClient } from "@/db/client";

describe("createDatabaseClient", () => {
  it("can reuse a pool without importing the Next.js server-only boundary", async () => {
    const pool = new Pool({
      connectionString: "postgresql://user:password@localhost:5432/portfoliocms",
    });

    const client = createDatabaseClient(
      "postgresql://user:password@localhost:5432/portfoliocms",
      pool,
    );

    expect(client.pool).toBe(pool);
    await pool.end();
  });
});
