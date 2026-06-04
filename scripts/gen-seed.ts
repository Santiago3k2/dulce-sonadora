import { categories } from '../lib/data/categories';
import { products } from '../lib/data/products';
import { writeFileSync } from 'fs';

/** Genera scripts/seed.sql a partir de los datos actuales (one-time / re-seed). */

const q = (v: string | null | undefined) =>
  v == null ? 'null' : `'${v.replace(/'/g, "''")}'`;
const jb = (v: unknown) =>
  `'${JSON.stringify(v ?? null).replace(/'/g, "''")}'::jsonb`;

let sql = '-- ════ CATEGORÍAS ════\n';
categories.forEach((c, i) => {
  sql +=
    `insert into public.categories (slug,name,"group",group_label,image,description,sort_order,is_active) values (` +
    `${q(c.slug)},${q(c.name)},${q(c.group)},${q(c.groupLabel)},${q(c.image)},${q(c.description)},${i},true) ` +
    `on conflict (slug) do update set name=excluded.name,"group"=excluded."group",group_label=excluded.group_label,image=excluded.image,description=excluded.description,sort_order=excluded.sort_order;\n`;
});

sql += '\n-- ════ PRODUCTOS ════\n';
products.forEach((p, i) => {
  const m = p.name.match(/^Ref\s+([0-9A-Za-z]+)/);
  const ref = m ? m[1] : null;
  sql +=
    `insert into public.products (ref,slug,name,category_id,description,price_retail,price_wholesale,wholesale_min_qty,colors,color_images,sizes,images,is_featured,is_new,in_stock,is_active,stock,sort_order) values (` +
    `${q(ref)},${q(p.slug)},${q(p.name)},(select id from public.categories where slug=${q(p.category)}),${q(p.description)},` +
    `${p.priceRetail},${p.priceWholesale},${p.wholesaleMinQty},${jb(p.colors)},${p.colorImages ? jb(p.colorImages) : 'null'},${jb(p.sizes)},${jb(p.images)},` +
    `${p.isFeatured},${p.isNew},${p.inStock},true,0,${i}) ` +
    `on conflict (slug) do update set ref=excluded.ref,name=excluded.name,category_id=excluded.category_id,description=excluded.description,price_retail=excluded.price_retail,price_wholesale=excluded.price_wholesale,colors=excluded.colors,color_images=excluded.color_images,sizes=excluded.sizes,images=excluded.images,is_featured=excluded.is_featured,is_new=excluded.is_new,in_stock=excluded.in_stock,sort_order=excluded.sort_order;\n`;
});

writeFileSync('scripts/seed.sql', sql, 'utf8');
console.log(`seed.sql -> ${categories.length} categorías, ${products.length} productos`);
