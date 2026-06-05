import { createAdminClient } from '@/lib/supabase/admin';
import OrdersTable from '@/components/admin/OrdersTable';
import type { AdminOrder } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function PedidosPage() {
  const sb = createAdminClient();
  const { data } = await sb
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return <OrdersTable orders={(data ?? []) as AdminOrder[]} />;
}
