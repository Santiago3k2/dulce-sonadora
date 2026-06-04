import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import ProductForm from '@/components/admin/ProductForm';
import type { AdminCategory, AdminProduct } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const sb = createAdminClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    sb
      .from('products')
      .select('*, category:categories(id,slug,name)')
      .eq('id', params.id)
      .maybeSingle(),
    sb.from('categories').select('id,slug,name').order('sort_order', { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      product={product as AdminProduct}
      categories={(categories ?? []) as AdminCategory[]}
    />
  );
}
