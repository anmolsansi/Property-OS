"use strict";

// Render's Free plan does not support pre-deploy commands. This runs before
// the NestJS process starts. Never auto-baseline a populated database.
const { execFileSync } = require("node:child_process");
const { readdirSync, existsSync } = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const appDir = path.resolve(__dirname, "..");
const migrationsDir = path.join(appDir, "prisma", "migrations");
const prisma = new PrismaClient();

function runPrisma(args) {
  execFileSync("npx", ["--no-install", "prisma", ...args], {
    cwd: appDir,
    stdio: "inherit",
    env: process.env,
  });
}

async function databaseState() {
  const [row] = await prisma.$queryRaw`
    SELECT
      EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = '_prisma_migrations'
      ) AS has_migrations,
      (
        SELECT COUNT(*)::int FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name <> '_prisma_migrations'
      ) AS table_count
  `;
  return row;
}

async function main() {
  const state = await databaseState();

  if (!state.has_migrations && state.table_count === 0) {
    console.log("Empty Postgres database detected. Preparing a demo baseline.");
    // The repository's first checked-in migration alters pre-existing tables.
    // It cannot run directly against a fresh database. db push creates the
    // current complete schema without dropping data, because the DB is empty.
    runPrisma(["db", "push", "--skip-generate"]);

    if (!existsSync(migrationsDir)) {
      throw new Error("Prisma migration directory is missing");
    }

    const migrations = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => existsSync(path.join(migrationsDir, name, "migration.sql")))
      .sort();

    if (migrations.length === 0) {
      throw new Error("No Prisma migrations found. Refusing to baseline.");
    }

    for (const migration of migrations) {
      runPrisma(["migrate", "resolve", "--applied", migration]);
    }
  } else if (!state.has_migrations) {
    throw new Error(
      "Existing tables have no Prisma migration history. Refusing to modify " +
      "a populated database. Review and baseline it manually."
    );
  }

  // For an already tracked database, apply only pending checked-in migrations.
  runPrisma(["migrate", "deploy"]);
}

main()
  .catch((error) => {
    console.error("Database preparation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
