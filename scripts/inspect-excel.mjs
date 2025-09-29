#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const input = process.argv[2] || path.join(process.cwd(), 'public', 'Agents', 'Master database - Admin.xlsx');
if (!fs.existsSync(input)) {
  console.error('File not found:', input);
  process.exit(1);
}
const wb = xlsx.readFile(input, { cellDates: false });
console.log('Sheets:', wb.SheetNames);
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const rows = xlsx.utils.sheet_to_json(ws, { raw: true, defval: '' });
  console.log(`\n=== ${name} ===`);
  console.log('Row count:', rows.length);
  if (rows[0]) {
    const keys = Object.keys(rows[0]);
    console.log('Columns:', keys);
    // Show first 3 rows sample
    for (let i = 0; i < Math.min(rows.length, 3); i++) {
      console.log(`#${i + 1}:`, rows[i]);
    }
  }
}

