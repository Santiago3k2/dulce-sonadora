import { createClient } from '@supabase/supabase-js';

process.loadEnvFile('.env.local');

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SITE = 'https://dulce-sonadora.vercel.app';
const VENDOR = 'Dulce Soñadora';
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gql(query, variables = {}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://${SHOP}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors && JSON.stringify(json.errors).includes('THROTTLED')) {
      await sleep(2000);
      continue;
    }
    return json;
  }
  throw new Error('Throttled repetidamente');
}

const absUrl = (img) => (img.startsWith('http') ? img : SITE + img);

// ── Colecciones ──
async function ensureCollection(title, descriptionHtml) {
  const q = `query($q:String!){ collections(first:1, query:$q){ nodes{ id title } } }`;
  const found = await gql(q, { q: `title:'${title.replace(/'/g, '')}'` });
  const existing = found.data?.collections?.nodes?.find((c) => c.title === title);
  if (existing) return existing.id;
  const m = `mutation($input:CollectionInput!){ collectionCreate(input:$input){ collection{ id } userErrors{ field message } } }`;
  const r = await gql(m, { input: { title, descriptionHtml: descriptionHtml || '' } });
  const errs = r.data?.collectionCreate?.userErrors;
  if (errs?.length) throw new Error('Colección "' + title + '": ' + JSON.stringify(errs));
  return r.data.collectionCreate.collection.id;
}

// ── ¿Producto ya migrado? (por tag src:slug) ──
async function productExists(slug) {
  const r = await gql(`query($q:String!){ products(first:1, query:$q){ nodes{ id } } }`, {
    q: `tag:src:${slug}`,
  });
  return r.data?.products?.nodes?.[0]?.id || null;
}

function buildVariantsAndOptions(colors, sizes, price) {
  const c = [...new Set((colors || []).map((x) => String(x).trim()).filter(Boolean))];
  const s = [...new Set((sizes || []).map((x) => String(x).trim()).filter(Boolean))];
  const options = [];
  if (c.length) options.push({ name: 'Color', values: c.map((name) => ({ name })) });
  if (s.length) options.push({ name: 'Talla', values: s.map((name) => ({ name })) });

  const priceStr = String(Math.max(0, Math.round(price || 0)));
  const baseVariant = (optionValues) => ({
    price: priceStr,
    optionValues,
    inventoryItem: { tracked: false },
    inventoryPolicy: 'CONTINUE',
  });

  let variants = [];
  if (c.length && s.length) {
    for (const cv of c)
      for (const sv of s)
        variants.push(
          baseVariant([
            { optionName: 'Color', name: cv },
            { optionName: 'Talla', name: sv },
          ])
        );
  } else if (c.length) {
    variants = c.map((cv) => baseVariant([{ optionName: 'Color', name: cv }]));
  } else if (s.length) {
    variants = s.map((sv) => baseVariant([{ optionName: 'Talla', name: sv }]));
  } else {
    variants = [{ price: priceStr, inventoryItem: { tracked: false }, inventoryPolicy: 'CONTINUE' }];
  }
  // Shopify: máx 100 variantes
  if (variants.length > 100) variants = variants.slice(0, 100);
  return { options, variants };
}

async function migrateProduct(p, collectionId) {
  const exists = await productExists(p.slug);
  if (exists) return { skipped: true, id: exists };

  const { options, variants } = buildVariantsAndOptions(p.colors, p.sizes, p.price_retail);
  const files = (p.images || []).slice(0, 20).map((img) => ({
    originalSource: absUrl(img),
    contentType: 'IMAGE',
  }));

  const tags = ['src:' + p.slug];
  if (p.ref) tags.push('Ref ' + p.ref);
  if (p.is_featured) tags.push('destacado');
  if (p.is_new) tags.push('nuevo');

  const input = {
    title: p.name,
    descriptionHtml: p.description || '',
    status: p.is_active ? 'ACTIVE' : 'DRAFT',
    vendor: VENDOR,
    tags,
    productOptions: options.length ? options : undefined,
    variants,
    files: files.length ? files : undefined,
  };

  const m = `mutation($input:ProductSetInput!){ productSet(synchronous:true, input:$input){ product{ id } userErrors{ field message } } }`;
  const r = await gql(m, { input });
  const errs = r.data?.productSet?.userErrors;
  if (errs?.length) return { error: JSON.stringify(errs) };
  const productId = r.data?.productSet?.product?.id;
  if (!productId) return { error: 'sin id: ' + JSON.stringify(r.errors || r) };

  if (collectionId) {
    await gql(
      `mutation($id:ID!,$ids:[ID!]!){ collectionAddProducts(id:$id, productIds:$ids){ userErrors{ message } } }`,
      { id: collectionId, ids: [productId] }
    );
  }
  return { id: productId, variants: variants.length, images: files.length };
}

async function main() {
  console.log(`Tienda: ${SHOP} | límite: ${LIMIT === Infinity ? 'todos' : LIMIT}\n`);

  const { data: categories } = await sb
    .from('categories')
    .select('id,slug,name,description')
    .order('sort_order');
  const { data: products } = await sb
    .from('products')
    .select('*')
    .order('sort_order');

  // Colecciones
  const colByCat = {};
  console.log('— Colecciones —');
  for (const cat of categories || []) {
    try {
      const id = await ensureCollection(cat.name, cat.description);
      colByCat[cat.id] = id;
      console.log(`  ✓ ${cat.name}`);
    } catch (e) {
      console.log(`  ✗ ${cat.name}: ${e.message}`);
    }
  }

  // Productos
  console.log('\n— Productos —');
  let ok = 0,
    skip = 0,
    fail = 0,
    n = 0;
  for (const p of products || []) {
    if (n >= LIMIT) break;
    n++;
    try {
      const res = await migrateProduct(p, colByCat[p.category_id]);
      if (res.skipped) {
        skip++;
        console.log(`  ↷ ${p.name.slice(0, 50)} (ya existía)`);
      } else if (res.error) {
        fail++;
        console.log(`  ✗ ${p.name.slice(0, 50)} — ${res.error}`);
      } else {
        ok++;
        console.log(`  ✓ ${p.name.slice(0, 50)} — ${res.variants} variantes, ${res.images} fotos`);
      }
    } catch (e) {
      fail++;
      console.log(`  ✗ ${p.name.slice(0, 50)} — ${e.message}`);
    }
    await sleep(400);
  }

  console.log(`\nResultado: ${ok} creados, ${skip} ya existían, ${fail} con error.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
