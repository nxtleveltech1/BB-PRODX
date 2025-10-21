import pg from 'pg';
const { Client } = pg;

const OLD_DB_URL = 'postgresql://neondb_owner:npg_dQkiO8UXsKx9@ep-round-bird-a97tgd78-pooler.gwc.azure.neon.tech/neondb?sslmode=require';

async function checkProducts() {
  const client = new Client({
    connectionString: OLD_DB_URL,
    statement_timeout: 60000,
    connectionTimeoutMillis: 15000
  });

  await client.connect();

  try {
    // Get all products
    console.log('=== ALL PRODUCTS IN OLD DATABASE ===\n');
    const { rows: products } = await client.query(`
      SELECT
        id,
        name,
        slug,
        price,
        compare_at_price,
        description,
        short_description,
        status,
        featured,
        created_at
      FROM products
      ORDER BY id;
    `);

    console.log(`Total products found: ${products.length}\n`);

    for (const p of products) {
      console.log(`ID: ${p.id}`);
      console.log(`Name: ${p.name}`);
      console.log(`Slug: ${p.slug}`);
      console.log(`Price: ${p.price}`);
      console.log(`Compare At Price: ${p.compare_at_price}`);
      console.log(`Status: ${p.status}`);
      console.log(`Featured: ${p.featured}`);
      console.log(`Created: ${p.created_at}`);
      if (p.description) {
        console.log(`Description: ${p.description.substring(0, 100)}...`);
      }
      console.log('---\n');
    }

    // Get categories
    console.log('\n=== CATEGORIES ===\n');
    const { rows: categories } = await client.query('SELECT * FROM categories ORDER BY id;');
    console.log(`Total categories: ${categories.length}`);
    for (const c of categories) {
      console.log(`- ${c.name} (${c.slug})`);
    }

    // Get subcategories
    console.log('\n=== SUBCATEGORIES ===\n');
    const { rows: subcategories } = await client.query('SELECT * FROM subcategories ORDER BY id;');
    console.log(`Total subcategories: ${subcategories.length}`);
    for (const s of subcategories) {
      console.log(`- ${s.name} (${s.slug}) - category_id: ${s.category_id}`);
    }

  } finally {
    await client.end();
  }
}

checkProducts().catch(console.error);
