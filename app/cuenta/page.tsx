import { redirect } from 'next/navigation';
import { getCustomer } from '@/lib/customer';
import { createServerSupabase } from '@/lib/supabase/server';
import AccountContent, { type OrderRow } from './AccountContent';

export const metadata = {
  title: 'Mi cuenta — Dulce Soñadora',
};

export default async function AccountPage() {
  const customer = await getCustomer();
  if (!customer) redirect('/cuenta/login');

  const { user, profile } = customer;

  // La RLS (orders_select_own) deja al cliente ver solo sus propios pedidos.
  const sb = createServerSupabase();
  const { data: orders } = await sb
    .from('orders')
    .select('id, order_number, created_at, total, status, payment_method, is_wholesale, items')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <AccountContent
      email={user.email ?? ''}
      profile={profile}
      orders={(orders ?? []) as OrderRow[]}
    />
  );
}
