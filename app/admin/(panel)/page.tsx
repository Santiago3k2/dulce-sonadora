import Link from 'next/link';
import { Package, FolderTree, ShoppingCart, Clock, ArrowRight, BellRing } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCOP } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

interface PendingOrder {
  order_number: number;
  customer_name: string;
  customer_phone: string;
  total: number;
  created_at: string;
  notes: string | null;
}

async function getData() {
  const sb = createAdminClient();
  const head = { count: 'exact' as const, head: true };
  const [prod, activos, cats, ords, pend, recent] = await Promise.all([
    sb.from('products').select('*', head),
    sb.from('products').select('*', head).eq('is_active', true),
    sb.from('categories').select('*', head),
    sb.from('orders').select('*', head),
    sb.from('orders').select('*', head).eq('status', 'pendiente'),
    sb
      .from('orders')
      .select('order_number,customer_name,customer_phone,total,created_at,notes')
      .eq('status', 'pendiente')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);
  return {
    productos: prod.count ?? 0,
    activos: activos.count ?? 0,
    categorias: cats.count ?? 0,
    pedidos: ords.count ?? 0,
    pendientes: pend.count ?? 0,
    recientes: (recent.data ?? []) as PendingOrder[],
  };
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return `hace ${Math.floor(hrs / 24)} d`;
}

export default async function AdminDashboard() {
  const c = await getData();

  const cards = [
    {
      label: 'Productos',
      value: `${c.activos}/${c.productos}`,
      sub: 'activos / total',
      icon: Package,
      color: 'text-pink-deeper bg-pink-deeper/10',
    },
    {
      label: 'Categorías',
      value: c.categorias,
      icon: FolderTree,
      color: 'text-violet-600 bg-violet-100',
    },
    {
      label: 'Pedidos',
      value: c.pedidos,
      icon: ShoppingCart,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Pendientes',
      value: c.pendientes,
      sub: 'por procesar',
      icon: Clock,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  const links = [
    { href: '/admin/productos', label: 'Gestionar productos', icon: Package },
    { href: '/admin/categorias', label: 'Gestionar categorías', icon: FolderTree },
    { href: '/admin/pedidos', label: 'Ver pedidos', icon: ShoppingCart },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-6">Resumen general de tu tienda.</p>

      {c.pendientes > 0 && (
        <Link
          href="/admin/pedidos"
          className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 hover:bg-amber-100 transition"
        >
          <BellRing size={20} className="text-amber-600 shrink-0" />
          <span className="text-sm text-amber-800">
            Tienes <strong>{c.pendientes}</strong> pedido{c.pendientes === 1 ? '' : 's'} pendiente
            {c.pendientes === 1 ? '' : 's'} de procesar — haz seguimiento para no perder la venta.
          </span>
          <ArrowRight size={16} className="text-amber-500 ml-auto shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}
              >
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm text-slate-500">
                {card.label}
                {card.sub ? ` · ${card.sub}` : ''}
              </p>
            </div>
          );
        })}
      </div>

      {c.recientes.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Pedidos pendientes recientes</h2>
            <Link href="/admin/pedidos" className="text-xs text-pink-deeper hover:underline">
              Ver todos →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {c.recientes.map((o) => (
              <li key={o.order_number} className="flex items-center gap-4 px-5 py-3 text-sm">
                <span className="font-semibold text-slate-700 shrink-0">#{o.order_number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 truncate">{o.customer_name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {o.notes?.startsWith('Pedido iniciado con el botón de WhatsApp')
                      ? '💬 Inició pedido por WhatsApp — confirmar en el chat'
                      : o.customer_phone}
                  </p>
                </div>
                <span className="font-medium text-slate-700 whitespace-nowrap">
                  {formatCOP(o.total)}
                </span>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {timeAgo(o.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-pink-deeper transition"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <Icon size={18} className="text-pink-deeper" />
                {l.label}
              </span>
              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:text-pink-deeper transition"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
