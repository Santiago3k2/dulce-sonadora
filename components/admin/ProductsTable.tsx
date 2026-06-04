'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatCOP } from '@/lib/utils/format';
import { deleteProduct, setProductFlag } from '@/lib/admin/product-actions';
import type { AdminProduct, AdminCategory } from '@/lib/admin/types';

export default function ProductsTable({
  products,
  categories,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (term && !`${p.name} ${p.ref ?? ''}`.toLowerCase().includes(term)) return false;
      if (cat && p.category_id !== cat) return false;
      if (status === 'activo' && !p.is_active) return false;
      if (status === 'inactivo' && p.is_active) return false;
      return true;
    });
  }, [products, q, cat, status]);

  function run(fn: () => Promise<{ error?: string; ok?: boolean }>, id: string) {
    setBusyId(id);
    start(async () => {
      const res = await fn();
      setBusyId(null);
      if (res?.error) alert(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Productos</h1>
          <p className="text-sm text-slate-500">{products.length} en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-pink-deeper text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-pink-dark transition"
        >
          <Plus size={16} /> Nuevo
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o referencia…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-slate-300 text-sm px-3 py-2 bg-white"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 text-sm px-3 py-2 bg-white"
        >
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Ocultos</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left font-medium px-4 py-3">Producto</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="text-right font-medium px-4 py-3">Detal / May.</th>
                <th className="text-center font-medium px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-center font-medium px-4 py-3">Estado</th>
                <th className="text-right font-medium px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const cover = p.images?.[0];
                const catName = categories.find((c) => c.id === p.category_id)?.name ?? '—';
                const busy = busyId === p.id && pending;
                return (
                  <tr key={p.id} className={busy ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-slate-100 overflow-hidden shrink-0">
                          {cover && <Image src={cover} alt="" fill className="object-cover" sizes="40px" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-700 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-400">
                            {p.ref ? `Ref ${p.ref}` : 'Sin ref'}
                            {p.is_featured && <span className="text-amber-500"> ★</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{catName}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="text-slate-800">{formatCOP(p.price_retail)}</span>
                      <span className="text-slate-400"> / {formatCOP(p.price_wholesale)}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-slate-600">
                      {p.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          p.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.is_active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title={p.is_active ? 'Ocultar de la tienda' : 'Mostrar en la tienda'}
                          onClick={() => run(() => setProductFlag(p.id, 'is_active', !p.is_active), p.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                        >
                          {p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <Link
                          title="Editar"
                          href={`/admin/productos/${p.id}`}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          title="Eliminar"
                          onClick={() => {
                            if (confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`))
                              run(() => deleteProduct(p.id), p.id);
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No hay productos que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
