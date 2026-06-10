'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await createClient().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  function Links() {
    return (
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active ? 'bg-pink-deeper text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} /> {it.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <span className="font-serif text-lg text-pink-deeper">Dulce Soñadora</span>
        </div>
        <div className="py-4 flex-1 flex flex-col">
          <Links />
        </div>
        <div className="p-3 border-t border-slate-200 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            <Store size={18} /> Ver tienda
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={18} /> Salir
          </button>
          <p className="px-3 pt-1 text-[11px] text-slate-400 truncate">{email}</p>
        </div>
      </aside>

      {/* Top bar móvil */}
      <header className="md:hidden sticky top-0 z-20 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
        <button onClick={() => setOpen(true)} aria-label="Menú">
          <Menu size={22} />
        </button>
        <span className="font-serif text-pink-deeper">Dulce Soñadora</span>
        <button onClick={logout} aria-label="Salir">
          <LogOut size={20} className="text-slate-500" />
        </button>
      </header>

      {/* Drawer móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col py-4">
            <div className="px-5 pb-4 flex items-center justify-between">
              <span className="font-serif text-pink-deeper">Menú</span>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <Links />
          </aside>
        </div>
      )}

      <main className="md:pl-60">
        <div className="p-5 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
