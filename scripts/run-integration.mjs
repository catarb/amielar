import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required to run integration tests.");
  process.exit(1);
}

async function findIntegrationTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findIntegrationTests(fullPath));
    } else if (/\.integration\.test\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = (await findIntegrationTests(path.resolve("src"))).sort();
if (files.length === 0) {
  console.error("No integration test files were found.");
  process.exit(1);
}

const vitest = path.resolve("node_modules/vitest/vitest.mjs");
const child = spawn(process.execPath, [vitest, "run", ...files], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Integration tests terminated by ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
