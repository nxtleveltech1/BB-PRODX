// Compare row counts between two Postgres databases (old vs new)
// Auto-discovers URLs from server/.env (old) and .env.neon.optimized (new)

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';

const { Client } = pg;

const repoRoot = process.cwd();

function parseEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath);
    return dotenv.parse(raw);
  } catch (err) {
    return {};
  }
}

function getUrls() {
  const serverEnv = parseEnvFile(path.join(repoRoot, 'server', '.env'));
  const neonOptimized = parseEnvFile(path.join(repoRoot, '.env.neon.optimized'));
  const rootEnvLocal = parseEnvFile(path.join(repoRoot, '.env.local'));

  // Prefer explicit args if provided
  const argOld = process.env.OLD_DATABASE_URL || process.argv[2];
  const argNew = process.env.NEW_DATABASE_URL || process.argv[3];

  const oldUrl = argOld || serverEnv.DATABASE_URL || rootEnvLocal.DATABASE_URL;
  const newUrl = argNew || neonOptimized.DATABASE_URL || rootEnvLocal.DATABASE_URL;

  return { oldUrl, newUrl };
}

async function getTableCounts(connString) {
  const client = new Client({ connectionString: connString, statement_timeout: 60000, query_timeout: 60000, connectionTimeoutMillis: 15000 });
  await client.connect();
  try {
    const { rows: tables } = await client.query(
      `SELECT table_schema, table_name
       FROM information_schema.tables
       WHERE table_type='BASE TABLE'
         AND table_schema NOT IN ('pg_catalog','information_schema')
       ORDER BY table_schema, table_name;`
    );

    const counts = {};
    for (const { table_schema, table_name } of tables) {
      const fq = `${table_schema}."${table_name}"`;
      try {
        const res = await client.query(`SELECT COUNT(*)::bigint AS c FROM ${fq};`);
        counts[`${table_schema}.${table_name}`] = BigInt(res.rows[0].c).toString();
      } catch (e) {
        counts[`${table_schema}.${table_name}`] = 'ERROR';
      }
    }

    return counts;
  } finally {
    await client.end();
  }
}

function diffCounts(oldCounts, newCounts) {
  const tableSet = new Set([...Object.keys(oldCounts), ...Object.keys(newCounts)]);
  const diffs = [];
  for (const t of [...tableSet].sort()) {
    const a = oldCounts[t] ?? 'MISSING';
    const b = newCounts[t] ?? 'MISSING';
    if (a !== b) {
      diffs.push({ table: t, old: a, new: b });
    }
  }
  return diffs;
}

function printSummary(label, counts) {
  const keys = Object.keys(counts).sort();
  let total = 0n;
  for (const k of keys) {
    const v = counts[k];
    if (v !== 'ERROR' && v !== 'MISSING') total += BigInt(v);
  }
  console.log(`\n=== ${label} (${keys.length} tables) ===`);
  for (const k of keys) {
    console.log(`${k}\t${counts[k]}`);
  }
  console.log(`Total rows: ${total.toString()}`);
}

(async () => {
  const { oldUrl, newUrl } = getUrls();

  if (!oldUrl || !newUrl) {
    console.error('Could not resolve both OLD and NEW database URLs.');
    console.error('Pass as args: node scripts/compare-db-row-counts.mjs <OLD_URL> <NEW_URL>');
    console.error('Or set env: OLD_DATABASE_URL, NEW_DATABASE_URL');
    process.exit(2);
  }

  console.log('Old DB URL host:', new URL(oldUrl).host);
  console.log('New DB URL host:', new URL(newUrl).host);

  console.log('\nConnecting to OLD database...');
  const oldCounts = await getTableCounts(oldUrl);
  console.log('Connecting to NEW database...');
  const newCounts = await getTableCounts(newUrl);

  printSummary('OLD Database', oldCounts);
  printSummary('NEW Database', newCounts);

  const diffs = diffCounts(oldCounts, newCounts);
  console.log(`\n=== Differences (${diffs.length}) ===`);
  if (diffs.length === 0) {
    console.log('All table counts match.');
  } else {
    for (const d of diffs) {
      console.log(`${d.table}\tOLD=${d.old}\tNEW=${d.new}`);
    }
  }
})();

