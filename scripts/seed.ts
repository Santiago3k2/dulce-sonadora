import { createClient } from '@supabase/supabase-js';
import { categories } from '../lib/data/categories';
import { products } from '../lib/data/products';

// Migra los datos actuales (lib/data) a Supabase. Idempotente (upsert por slug).
process.loadEnvFile('.env.local');

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  const catRows = categories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    group: c.group,
    group_label: c.groupLabel,
    image: c.image ?? null,
    description: c.description ?? null,
    sort_order: i,
    is_active: true,
  }));
  {
    const { error } = await sb.from('categories').upsert(catRows, { onConflict: 'slug' });
    if (error) throw error;
  }

  const { data: cats, error: cge } = await sb.from('categories').select('id,slug');
  if (cge) throw cge;
  const idBySlug = Object.fromEntries((cats ?? []).map((c) => [c.slug, c.id]));

  const prodRows = products.map((p, i) => {
    const m = p.name.match(/^Ref\s+([0-9A-Za-z]+)/);
    return {
      ref: m ? m[1] : null,
      slug: p.slug,
      name: p.name,
      category_id: idBySlug[p.category] ?? null,
      description: p.description,
      price_retail: p.priceRetail,
      price_wholesale: p.priceWholesale,
      wholesale_min_qty: p.wholesaleMinQty,
      colors: p.colors,
      color_images: p.colorImages ?? null,
      sizes: p.sizes,
      images: p.images,
      is_featured: p.isFeatured,
      is_new: p.isNew,
      in_stock: p.inStock,
      is_active: true,
      stock: 0,
      sort_order: i,
    };
  });
  {
    const { error } = await sb.from('products').upsert(prodRows, { onConflict: 'slug' });
    if (error) throw error;
  }

  console.log(`✅ Seed: ${catRows.length} categorías, ${prodRows.length} productos`);
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
