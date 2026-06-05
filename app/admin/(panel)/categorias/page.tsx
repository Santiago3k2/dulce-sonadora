import { createAdminClient } from '@/lib/supabase/admin';
import CategoriesManager from '@/components/admin/CategoriesManager';
import type { AdminCategory } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const sb = createAdminClient();
  const [{ data: categories }, { data: prods }] = await Promise.all([
    sb.from('categories').select('*').order('sort_order', { ascending: true }),
    sb.from('products').select('category_id'),
  ]);

  const counts: Record<string, number> = {};
  (prods ?? []).forEach((p: { category_id: string | null }) => {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  });

  return (
    <CategoriesManager
      categories={(categories ?? []) as AdminCategory[]}
      counts={counts}
    />
  );
}
