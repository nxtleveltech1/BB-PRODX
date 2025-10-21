#!/usr/bin/env node
/**
 * Sync Locator data from Excel to public/data/locations.json
 * - Reads: public/Agents/Master database - Admin.xlsx (sheet: first)
 * - Writes: public/data/locations.json (merged)
 * - Geocodes missing coordinates via Nominatim with on-disk cache
 */

import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const ROOT = process.cwd();
const EXCEL_PATH = path.join(ROOT, 'public', 'Agents', 'Master database - Admin.xlsx');
const CSV_DIR = path.join(ROOT, 'public', 'Agents');
const JSON_PATH = path.join(ROOT, 'public', 'data', 'locations.json');
const CACHE_PATH = path.join(ROOT, 'public', 'data', 'geocode-cache.json');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

function mapCategoryToType(cat) {
  const c = norm(cat);
  if (c.includes('direct') || c.includes('agent') || c.includes('distrib')) return 'distributor';
  return 'retail';
}

function composeAddress(row) {
  const parts = [
    row['Delivery Address Line 1'],
    row['Town / Suburb'],
    row['Delivery Address Line 2'],
  ]
    .map((s) => String(s || '').trim())
    .filter(Boolean);
  const pc = String(row['Delivery Address postal code'] || '').trim();
  if (pc) parts.push(pc);
  if (!/south africa/i.test(parts.join(' '))) parts.push('South Africa');
  return parts.join(', ');
}

function composeAddressCSV(row){
  const parts = [row['Street Address'], row['Area']]
    .map((s)=>String(s||'').trim())
    .filter(Boolean);
  if (!/south africa/i.test(parts.join(' '))) parts.push('South Africa');
  return parts.join(', ');
}

async function geocode(address, cache) {
  const key = norm(address);
  if (cache[key]) return cache[key];
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('q', address);
  url.searchParams.set('limit', '1');
  const res = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'BB-PRODX-Locator-Sync/1.0 (no-reply@betterbeing.example)'
    },
  });
  if (!res.ok) throw new Error(`Geocode failed ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data) && data.length) {
    const { lat, lon } = data[0];
    const coord = { lat: parseFloat(lat), lng: parseFloat(lon) };
    cache[key] = coord;
    await fs.promises.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
    return coord;
  }
  cache[key] = null;
  await fs.promises.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  return null;
}

async function main() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('Excel file not found:', EXCEL_PATH);
    process.exit(1);
  }
  // Load Excel
  const wb = xlsx.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  // Load CSV files if present (pattern matches Locator exports)
  const csvFiles = fs
    .readdirSync(CSV_DIR)
    .filter((f) => /Master database - Admin - Locator.*\.csv$/i.test(f))
    .map((f) => path.join(CSV_DIR, f));

  for (const csvPath of csvFiles) {
    try {
      const wbCsv = xlsx.readFile(csvPath);
      const sh = wbCsv.Sheets[wbCsv.SheetNames[0]];
      const csvRows = xlsx.utils.sheet_to_json(sh, { defval: '' });
      // Normalize to excel-like field names to reuse merge logic
      for (const r of csvRows) {
        r['Category'] = r['Category'] || 'Retail Store';
        r['Contact Name'] = r['Contact Name'] || r['Name'];
        r['Delivery Address Line 1'] = composeAddressCSV(r);
        r['Town / Suburb'] = '';
        r['Delivery Address Line 2'] = '';
        r['Delivery Address postal code'] = '';
        r['Cell Number'] = r['Contact Number'] || r['Phone'] || '';
        rows.push(r);
      }
      console.log(`Loaded CSV: ${path.basename(csvPath)} rows=${csvRows.length}`);
    } catch (e) {
      console.warn('Failed to load CSV', csvPath, e.message);
    }
  }

  const existing = fs.existsSync(JSON_PATH)
    ? JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'))
    : [];
  const byName = new Map(existing.map((e) => [norm(e.name), e]));

  const cache = fs.existsSync(CACHE_PATH)
    ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
    : {};

  const merged = [...existing];
  const usedIds = new Set(merged.map((m) => m.id));

  let added = 0;
  let geocoded = 0;

  for (const r of rows) {
    const name = String(r['Name'] || '').trim();
    if (!name) continue;
    const key = norm(name);
    const current = byName.get(key);
    const type = mapCategoryToType(r['Category']);
    const phone = String(r['Cell Number'] || '').toString().replace(/\s+/g, '');
    const address = composeAddress(r);
    const agent = String(r['Contact Name'] || name).trim();

    if (current) {
      // Update phone/agent/address if missing
      if (!current.phone && phone) current.phone = phone;
      if (!current.agent && agent) current.agent = agent;
      if (!current.address && address) current.address = address;
      // Geocode if missing coordinates
      if (!current.coordinates || current.coordinates.lat == null || current.coordinates.lng == null) {
        const coord = await geocode(address, cache).catch(() => null);
        if (coord) {
          current.coordinates = coord;
          geocoded++;
        }
        // Respect Nominatim usage policy: pause between requests
        await new Promise((r) => setTimeout(r, 1200));
      }
      continue;
    }

    // Create new entry
    let baseId = `${type}-${slugify(name)}`;
    let id = baseId;
    let i = 1;
    while (usedIds.has(id)) {
      i++;
      id = `${baseId}-${i}`;
    }
    usedIds.add(id);

    const entry = {
      id,
      type,
      name,
      address,
      phone: phone || undefined,
      agent,
      coordinates: undefined,
    };

    // Geocode new entry
    const coord = await geocode(address, cache).catch(() => null);
    if (coord) {
      entry.coordinates = coord;
      geocoded++;
    }
    await new Promise((r) => setTimeout(r, 1200));

    merged.push(entry);
    byName.set(key, entry);
    added++;
  }

  // Final tidy: remove undefined fields and sort by name
  const final = merged.map((m) => {
    const o = { ...m };
    Object.keys(o).forEach((k) => (o[k] === undefined ? delete o[k] : null));
    return o;
  }).sort((a, b) => a.name.localeCompare(b.name));

  await fs.promises.writeFile(JSON_PATH, JSON.stringify(final, null, 2));
  console.log(`Sync complete. Added ${added} new locations, geocoded ${geocoded}. Total: ${final.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
