'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminProductInput } from '@/lib/admin/types';

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80) || 'producto'
  );
}

function revalidateStore() {
  revalidatePath('/admin/productos');
  revalidatePath('/');
  revalidatePath('/tienda');
}

export async function saveProduct(input: AdminProductInput) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  if (!input.name?.trim()) return { error: 'El nombre es obligatorio' };

  const sb = createAdminClient();
  const row: Record<string, unknown> = {
    ref: input.ref?.trim() || null,
    name: input.name.trim(),
    category_id: input.category_id || null,
    description: input.description ?? '',
    price_retail: Math.max(0, Math.round(input.price_retail || 0)),
    price_wholesale: Math.max(0, Math.round(input.price_wholesale || 0)),
    wholesale_min_qty: Math.max(1, Math.round(input.wholesale_min_qty || 6)),
    colors: input.colors ?? [],
    sizes: input.sizes ?? [],
    images: input.images ?? [],
    stock: Math.max(0, Math.round(input.stock || 0)),
    is_featured: !!input.is_featured,
    is_new: !!input.is_new,
    in_stock: !!input.in_stock,
    is_active: !!input.is_active,
  };

  if (input.id) {
    const { error } = await sb.from('products').update(row).eq('id', input.id);
    if (error) return { error: error.message };
  } else {
    const base = slugify(input.name);
    let slug = base;
    for (let i = 2; ; i++) {
      const { data } = await sb.from('products').select('id').eq('slug', slug).maybeSingle();
      if (!data) break;
      slug = `${base}-${i}`;
    }
    const { data: maxRow } = await sb
      .from('products')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    row.slug = slug;
    row.sort_order = (maxRow?.sort_order ?? 0) + 1;
    const { error } = await sb.from('products').insert(row);
    if (error) return { error: error.message };
  }

  revalidateStore();
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateStore();
  return { ok: true };
}

export async function setProductFlag(
  id: string,
  field: 'is_active' | 'is_featured' | 'is_new' | 'in_stock',
  value: boolean
) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  const { error } = await sb.from('products').update({ [field]: value }).eq('id', id);
  if (error) return { error: error.message };
  revalidateStore();
  return { ok: true };
}
