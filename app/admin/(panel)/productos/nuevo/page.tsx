import { createAdminClient } from '@/lib/supabase/admin';
import ProductForm from '@/components/admin/ProductForm';
import type { AdminCategory } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function NuevoProductoPage() {
  const sb = createAdminClient();
  const { data: categories } = await sb
    .from('categories')
    .select('id,slug,name')
    .order('sort_order', { ascending: true });

  return <ProductForm categories={(categories ?? []) as AdminCategory[]} />;
}
