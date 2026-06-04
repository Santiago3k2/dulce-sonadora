import { createAdminClient } from '@/lib/supabase/admin';
import ProductsTable from '@/components/admin/ProductsTable';
import type { AdminProduct, AdminCategory } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
  const sb = createAdminClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    sb
      .from('products')
      .select('*, category:categories(id,slug,name)')
      .order('sort_order', { ascending: true }),
    sb.from('categories').select('id,slug,name').order('sort_order', { ascending: true }),
  ]);

  return (
    <ProductsTable
      products={(products ?? []) as AdminProduct[]}
      categories={(categories ?? []) as AdminCategory[]}
    />
  );
}
