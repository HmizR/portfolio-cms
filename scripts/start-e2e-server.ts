import { spawn } from "node:child_process";
import path from "node:path";

import { prepareTestDatabase } from "./test-database";

async function main(): Promise<void> {
  const databaseUrl = await prepareTestDatabase();
  const nextBinary = path.resolve("node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextBinary, "dev", "-p", "3100"], {
    env: {
      ...process.env,
      APP_URL: "http://127.0.0.1:3100",
      DATABASE_URL: databaseUrl,
      NEXT_DIST_DIR: ".next-e2e",
    },
    stdio: "inherit",
  });

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => child.kill(signal));
  }

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

void main();
