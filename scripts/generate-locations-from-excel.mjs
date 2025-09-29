#!/usr/bin/env node
/**
 * Generate public/data/locations.json from the Excel master list.
 *
 * Usage:
 *   node scripts/generate-locations-from-excel.mjs [--input path] [--output path] [--sheet NAME] [--geocode]
 */

import fs from 'fs';
import path from 'path';
import process from 'process';
import xlsx from 'xlsx';

const repoRoot = process.cwd();
const defaultInput = path.join(repoRoot, 'public', 'Agents', 'Master database - Admin.xlsx');
const defaultOutput = path.join(repoRoot, 'public', 'data', 'locations.json');

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  const next = process.argv[i + 1];
  if (a.startsWith('--')) {
    if (next && !next.startsWith('--')) {
      args.set(a.replace(/^--/, ''), next);
      i++;
    } else {
      args.set(a.replace(/^--/, ''), true);
    }
  }
}

const inputPath = args.get('input') || defaultInput;
const outputPath = args.get('output') || defaultOutput;
const sheetNameFilter = args.get('sheet');
const doGeocode = Boolean(args.get('geocode'));
const limit = args.get('limit') ? Number(args.get('limit')) : undefined;
const emailParam = args.get('email') || 'noreply@example.com';
const defaultCountry = args.get('country') || 'South Africa';

function norm(s) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function pick(obj, keys) {
  for (const k of keys) {
    const cand = Object.keys(obj).find(
      (h) => h && String(h).toLowerCase().replace(/\s+/g, '') === String(k).toLowerCase().replace(/\s+/g, '')
    );
    if (cand && obj[cand] != null && String(obj[cand]).trim() !== '') return obj[cand];
  }
  return undefined;
}

function firstNonEmpty(...vals) {
  for (const v of vals) if (v != null && String(v).trim() !== '') return v;
  return undefined;
}

function toFloat(v) {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

async function geocodeAddress(addr) {
  if (!addr) return undefined;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('q', addr);
  url.searchParams.set('limit', '1');
  url.searchParams.set('email', emailParam);
  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': `betterbeing-bb-prodx/1.0 (${emailParam})`,
      'Accept-Language': 'en',
    },
  });
  if (!res.ok) return undefined;
  const data = await res.json();
  if (Array.isArray(data) && data[0]) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return undefined;
}

function guessType(val, row) {
  const v = String(val || '').toLowerCase();
  if (v.includes('dist') || v.includes('agent') || v.includes('wholesale')) return 'distributor';
  if (v.includes('retail') || v.includes('store') || v.includes('shop')) return 'retail';
  // Hints from row content
  const hasAgent = Object.keys(row).some((k) => String(k).toLowerCase().includes('agent'));
  return hasAgent ? 'distributor' : 'retail';
}

function buildAddress(obj) {
  const parts = [];
  const address1 = pick(obj, ['address1', 'address 1', 'address', 'street address', 'delivery address line 1']);
  const address2 = pick(obj, ['address2', 'address 2', 'suite', 'unit', 'delivery address line 2']);
  const suburb = pick(obj, ['suburb', 'district', 'town / suburb']);
  const city = pick(obj, ['city', 'town']);
  const province = pick(obj, ['province', 'state', 'region']);
  const postal = pick(obj, ['postcode', 'postal', 'zip', 'delivery address postal code']);
  const country = pick(obj, ['country']);
  for (const p of [address1, address2, suburb, city, province, postal, country]) {
    const n = norm(p);
    if (n) parts.push(n);
  }
  let addr = parts.join(', ');
  // If no country provided and address looks South African, hint it
  if (!new RegExp(`\\b(${defaultCountry}|za)\\b`, 'i').test(addr)) {
    addr = addr ? `${addr}, ${defaultCountry}` : defaultCountry;
  }
  return addr;
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input Excel not found: ${inputPath}`);
    process.exit(1);
  }

  const wb = xlsx.readFile(inputPath, { cellDates: false });
  const sheets = wb.SheetNames;
  const targetSheets = sheetNameFilter
    ? sheets.filter((n) => String(n).toLowerCase() === String(sheetNameFilter).toLowerCase())
    : sheets;

  const out = [];
  let counter = 0;
  // Simple in-memory cache for geocoding duplicate addresses
  const geoCache = new Map();

  let processed = 0;
  for (const sName of targetSheets) {
    const ws = wb.Sheets[sName];
    if (!ws) continue;
    const rows = xlsx.utils.sheet_to_json(ws, { raw: true, defval: '' });
    for (const row of rows) {
      if (limit && processed >= limit) break;
      // Basic picks
      const name = firstNonEmpty(
        pick(row, ['outletname', 'outlet', 'name', 'storename', 'company', 'retailer name']),
        'Unnamed Outlet'
      );
      const typeRaw = pick(row, ['type', 'category', 'outlettype']);
      const type = guessType(typeRaw, row);
      const address = buildAddress(row) || pick(row, ['address']) || '';
      const phone = firstNonEmpty(
        pick(row, ['phone', 'tel', 'telephone', 'mobile', 'cell', 'cell number']),
      );
      const website = pick(row, ['website', 'url', 'link']);
      const vendor = pick(row, ['vendor', 'wholesaler', 'distributor']);
      const agent = pick(row, ['agent', 'salesrep', 'rep', 'sales rep', 'agent name', 'contact name']);

      let lat = toFloat(firstNonEmpty(pick(row, ['lat', 'latitude', 'y'])));
      let lng = toFloat(firstNonEmpty(pick(row, ['lng', 'lon', 'long', 'longitude', 'x'])));

      if ((!lat || !lng) && doGeocode) {
        try {
          let geo = geoCache.get(address);
          if (!geo) {
            geo = await geocodeAddress(address);
            if (geo) geoCache.set(address, geo);
          }
          if (geo) {
            lat = geo.lat;
            lng = geo.lng;
            // Throttle between requests to be polite
            await new Promise((r) => setTimeout(r, 1100));
          }
        } catch {
          // ignore
        }
      }

      if (!lat || !lng) {
        // Skip rows without valid coordinates if we cannot geocode
        continue;
      }

      const id = `${type}-${norm(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${++counter}`;
      out.push({
        id,
        type,
        name: norm(name),
        address: norm(address),
        phone: phone ? norm(phone) : undefined,
        website: website ? String(website).trim() : undefined,
        vendor: vendor ? norm(vendor) : undefined,
        agent: agent ? norm(agent) : undefined,
        coordinates: { lat, lng },
      });
      processed++;
    }
  }

  // Ensure output dir exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} locations to ${path.relative(repoRoot, outputPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
