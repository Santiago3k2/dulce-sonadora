import Link from 'next/link';
import { Package, FolderTree, ShoppingCart, Clock, ArrowRight } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

async function getCounts() {
  const sb = createAdminClient();
  const head = { count: 'exact' as const, head: true };
  const [prod, activos, cats, ords, pend] = await Promise.all([
    sb.from('products').select('*', head),
    sb.from('products').select('*', head).eq('is_active', true),
    sb.from('categories').select('*', head),
    sb.from('orders').select('*', head),
    sb.from('orders').select('*', head).eq('status', 'pendiente'),
  ]);
  return {
    productos: prod.count ?? 0,
    activos: activos.count ?? 0,
    categorias: cats.count ?? 0,
    pedidos: ords.count ?? 0,
    pendientes: pend.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const c = await getCounts();

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
