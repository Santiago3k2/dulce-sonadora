import { supabasePublic } from '@/lib/supabase/public';
import type { Product } from './products';
import type { Category, CategoryGroup } from './categories';

/**
 * Capa de acceso a datos de la TIENDA. Lee de Supabase (solo filas activas
 * por RLS) y devuelve exactamente las formas Product / Category que ya usan
 * los componentes, para no tener que tocarlos.
 */

type Row = Record<string, any>;

function mapProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category?.slug ?? '',
    images: (row.images ?? []) as string[],
    priceRetail: row.price_retail,
    priceWholesale: row.price_wholesale,
    wholesaleMinQty: row.wholesale_min_qty,
    colors: (row.colors ?? []) as string[],
    colorImages: row.color_images ?? undefined,
    sizes: (row.sizes ?? []) as string[],
    sizePrices: row.size_prices ?? undefined,
    isFeatured: row.is_featured,
    isNew: row.is_new,
    inStock: row.in_stock,
    description: row.description ?? '',
  };
}

function mapCategory(row: Row): Category {
  return {
    slug: row.slug,
    name: row.name,
    group: row.group,
    groupLabel: row.group_label,
    image: row.image ?? '',
    description: row.description ?? undefined,
  };
}

const SELECT = '*, category:categories(slug)';

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabasePublic
    .from('products')
    .select(SELECT)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) console.error('getAllProducts', error.message);
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabasePublic
    .from('products')
    .select(SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  return data ? mapProduct(data) : null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const { data: cat } = await supabasePublic
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!cat?.id) return [];
  const { data } = await supabasePublic
    .from('products')
    .select(SELECT)
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data ?? []).map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabasePublic
    .from('products')
    .select(SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  return (data ?? []).map(mapProduct);
}

export async function getNewProducts(): Promise<Product[]> {
  const { data } = await supabasePublic
    .from('products')
    .select(SELECT)
    .eq('is_active', true)
    .eq('is_new', true)
    .order('sort_order', { ascending: true });
  return (data ?? []).map(mapProduct);
}

export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4
): Promise<Product[]> {
  const inCat = await getProductsByCategory(categorySlug);
  return inCat.filter((p) => p.id !== productId).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabasePublic
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabasePublic
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  return data ? mapCategory(data) : null;
}

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  const cats = await getCategories();
  const preferred = ['pantalon', 'capri', 'short', 'bata', 'navidad', 'dama', 'hombre', 'ninos'];
  const keys = [
    ...preferred,
    ...cats.map((c) => c.group).filter((g) => !preferred.includes(g)),
  ];
  const seen = new Set<string>();
  const groups: CategoryGroup[] = [];
  for (const key of keys) {
    if (seen.has(key)) continue;
    seen.add(key);
    const inGroup = cats.filter((c) => c.group === key);
    if (inGroup.length) {
      groups.push({ key, label: inGroup[0].groupLabel, categories: inGroup });
    }
  }
  return groups;
}
