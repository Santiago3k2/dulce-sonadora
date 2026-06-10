import { createAdminClient } from '@/lib/supabase/admin';
import CustomersTable, { type CustomerRow } from '@/components/admin/CustomersTable';

export const metadata = { title: 'Clientes — Panel Dulce Soñadora' };
export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const sb = createAdminClient();

  // Perfiles de clientes (creados automáticamente al registrarse)
  const { data: profiles } = await sb
    .from('profiles')
    .select('id, full_name, phone, address, city, tier, discount_pct, notes, created_at')
    .order('created_at', { ascending: false });

  // Correos desde auth (el perfil no guarda el email)
  const { data: usersPage } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailById = new Map(usersPage?.users.map((u) => [u.id, u.email ?? '']) ?? []);

  // No mostrar las cuentas que son del panel admin
  const { data: admins } = await sb.from('admins').select('user_id');
  const adminIds = new Set((admins ?? []).map((a) => a.user_id));

  // Compras por cliente (cantidad y total)
  const { data: orders } = await sb
    .from('orders')
    .select('customer_id, total')
    .not('customer_id', 'is', null);
  const stats = new Map<string, { count: number; total: number }>();
  for (const o of orders ?? []) {
    const s = stats.get(o.customer_id) ?? { count: 0, total: 0 };
    s.count += 1;
    s.total += o.total ?? 0;
    stats.set(o.customer_id, s);
  }

  const rows: CustomerRow[] = (profiles ?? [])
    .filter((p) => !adminIds.has(p.id))
    .map((p) => ({
      id: p.id,
      full_name: p.full_name ?? '',
      email: emailById.get(p.id) ?? '',
      phone: p.phone ?? '',
      city: p.city ?? '',
      tier: p.tier ?? 'detal',
      discount_pct: Number(p.discount_pct) || 0,
      notes: p.notes ?? '',
      created_at: p.created_at,
      orders_count: stats.get(p.id)?.count ?? 0,
      orders_total: stats.get(p.id)?.total ?? 0,
    }));

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Clientes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Asigna precios mayoristas, VIP o un descuento especial — el cliente lo ve
          aplicado automáticamente al comprar con su cuenta.
        </p>
      </header>
      <CustomersTable customers={rows} />
    </div>
  );
}
