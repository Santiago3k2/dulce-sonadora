import { products } from '../lib/data/products';
import { createClient } from '@supabase/supabase-js';

/**
 * Sincroniza la tabla `products` de Supabase con lib/data/products.ts:
 *  - upsert (por slug) de todo el catálogo
 *  - elimina los slugs que se quitaron del catálogo (REMOVE)
 * Uso:  DRY=1 npx tsx scripts/sync-supabase.ts   (solo valida, no escribe)
 *            npx tsx scripts/sync-supabase.ts     (aplica los cambios)
 */

process.loadEnvFile('.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const DRY = process.env.DRY === '1';

// Productos retirados del catálogo (se borran de la tienda)
const REMOVE = ['menta-top-pantalon-cuadros-teal', 'satin-negro-mickey-minnie-corazones'];

async function main() {
  const { data: cats, error: ce } = await sb.from('categories').select('id, slug');
  if (ce) throw ce;
  const catMap = Object.fromEntries((cats ?? []).map((c) => [c.slug, c.id]));

  const rows = products.map((p, i) => {
    const m = p.name.match(/^Ref\s+([0-9A-Za-z]+)/);
    return {
      ref: m ? m[1] : null,
      slug: p.slug,
      name: p.name,
      category_id: catMap[p.category] ?? null,
      description: p.description ?? '',
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
      sort_order: i,
    };
  });

  // Validaciones
  const noCat = rows.filter((r) => !r.category_id).map((r) => `${r.slug} (${products.find((p) => p.slug === r.slug)?.category})`);
  if (noCat.length) {
    console.error('Productos sin category_id (categoría inexistente):', noCat);
    process.exit(1);
  }
  const slugs = rows.map((r) => r.slug);
  const dups = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dups.length) {
    console.error('Slugs duplicados:', [...new Set(dups)]);
    process.exit(1);
  }

  console.log(`Catálogo: ${rows.length} productos, ${Object.keys(catMap).length} categorías. A eliminar: ${REMOVE.join(', ')}`);
  if (DRY) {
    console.log('DRY=1 -> validación OK, no se escribió nada.');
    return;
  }

  const { error: ue } = await sb.from('products').upsert(rows, { onConflict: 'slug' });
  if (ue) throw ue;
  console.log(`✓ Upsert: ${rows.length} productos`);

  const { error: de, count } = await sb.from('products').delete({ count: 'exact' }).in('slug', REMOVE);
  if (de) {
    console.warn(`No se pudo borrar (${de.message}); desactivando en su lugar.`);
    await sb.from('products').update({ is_active: false }).in('slug', REMOVE);
  } else {
    console.log(`✓ Eliminados: ${count ?? 0}`);
  }

  const { count: total } = await sb
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  console.log(`✓ Productos activos en Supabase: ${total}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
