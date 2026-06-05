'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminCategoryInput } from '@/lib/admin/types';

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'categoria'
  );
}

function revalidateAll() {
  revalidatePath('/admin/categorias');
  revalidatePath('/', 'layout'); // el menú (Header/Footer) se arma en el layout raíz
}

export async function saveCategory(input: AdminCategoryInput) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  if (!input.name?.trim()) return { error: 'El nombre es obligatorio' };

  const sb = createAdminClient();
  const groupLabel = input.group_label?.trim() || 'Otros';
  const row: Record<string, unknown> = {
    name: input.name.trim(),
    group: slugify(groupLabel),
    group_label: groupLabel,
    image: input.image || null,
    description: input.description?.trim() || null,
    is_active: !!input.is_active,
  };

  if (input.id) {
    if (input.slug?.trim()) row.slug = slugify(input.slug);
    const { error } = await sb.from('categories').update(row).eq('id', input.id);
    if (error) return { error: error.message };
  } else {
    const base = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
    let slug = base;
    for (let i = 2; ; i++) {
      const { data } = await sb.from('categories').select('id').eq('slug', slug).maybeSingle();
      if (!data) break;
      slug = `${base}-${i}`;
    }
    const { data: maxRow } = await sb
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    row.slug = slug;
    row.sort_order = (maxRow?.sort_order ?? 0) + 1;
    const { error } = await sb.from('categories').insert(row);
    if (error) return { error: error.message };
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  // Los productos de esta categoría quedan con category_id = null (FK ON DELETE SET NULL).
  const { error } = await sb.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function setCategoryActive(id: string, value: boolean) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  const { error } = await sb.from('categories').update({ is_active: value }).eq('id', id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function reorderCategories(orderedIds: string[]) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await sb.from('categories').update({ sort_order: i }).eq('id', orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidateAll();
  return { ok: true };
}
