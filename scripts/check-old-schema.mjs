import pg from 'pg';
const { Client } = pg;

const OLD_DB_URL = 'postgresql://neondb_owner:npg_dQkiO8UXsKx9@ep-round-bird-a97tgd78-pooler.gwc.azure.neon.tech/neondb?sslmode=require';

async function checkSchema() {
  const client = new Client({
    connectionString: OLD_DB_URL,
    statement_timeout: 60000,
    connectionTimeoutMillis: 15000
  });

  await client.connect();

  try {
    // Get products table schema
    console.log('=== PRODUCTS TABLE COLUMNS ===\n');
    const { rows: productColumns } = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
      ORDER BY ordinal_position;
    `);

    for (const col of productColumns) {
      console.log(`${col.column_name} | ${col.data_type} | nullable: ${col.is_nullable} | default: ${col.column_default || 'none'}`);
    }

    // Get sample product data
    console.log('\n=== SAMPLE PRODUCTS (all columns) ===\n');
    const { rows: products } = await client.query(`SELECT * FROM products LIMIT 5;`);
    console.log(`Total products in old database: ${products.length}`);
    console.log(JSON.stringify(products, null, 2));

    // Check all tables
    console.log('\n=== ALL TABLES IN OLD DATABASE ===\n');
    const { rows: tables } = await client.query(`
      SELECT table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    for (const t of tables) {
      const { rows: count } = await client.query(`SELECT COUNT(*) FROM public."${t.table_name}";`);
      console.log(`${t.table_name} | columns: ${t.column_count} | rows: ${count[0].count}`);
    }

  } finally {
    await client.end();
  }
}

checkSchema().catch(console.error);
