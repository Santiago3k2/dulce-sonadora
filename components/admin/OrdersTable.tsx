'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, X, Loader2, MessageCircle, Trash2, Phone, MapPin } from 'lucide-react';
import { formatCOP, buildWhatsAppLink } from '@/lib/utils/format';
import { setOrderStatus, deleteOrder } from '@/lib/admin/order-actions';
import { ORDER_STATUSES } from '@/lib/admin/types';
import type { AdminOrder } from '@/lib/admin/types';

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pendiente: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-700' },
  en_proceso: { label: 'En proceso', cls: 'bg-blue-100 text-blue-700' },
  enviado: { label: 'Enviado', cls: 'bg-violet-100 text-violet-700' },
  entregado: { label: 'Entregado', cls: 'bg-emerald-100 text-emerald-700' },
  cancelado: { label: 'Cancelado', cls: 'bg-slate-100 text-slate-500' },
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function waPhone(p: string) {
  const c = p.replace(/\D/g, '');
  return c.length === 10 ? '57' + c : c;
}

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState<AdminOrder | null>(null);
  const [pending, start] = useTransition();

  const filtered = useMemo(
    () => orders.filter((o) => !status || o.status === status),
    [orders, status]
  );

  function changeStatus(id: string, st: string) {
    start(async () => {
      const r = await setOrderStatus(id, st);
      if (r?.error) alert(r.error);
      else {
        setOpen((o) => (o && o.id === id ? { ...o, status: st } : o));
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm('¿Eliminar este pedido? No se puede deshacer.')) return;
    start(async () => {
      const r = await deleteOrder(id);
      if (r?.error) alert(r.error);
      else {
        setOpen(null);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Pedidos</h1>
          <p className="text-sm text-slate-500">{orders.length} en total</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 text-sm px-3 py-2 bg-white"
        >
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left font-medium px-4 py-3">Pedido</th>
                <th className="text-left font-medium px-4 py-3">Cliente</th>
                <th className="text-right font-medium px-4 py-3">Total</th>
                <th className="text-center font-medium px-4 py-3">Estado</th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => {
                const meta = STATUS_META[o.status] ?? STATUS_META.pendiente;
                const qty = o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
                return (
                  <tr key={o.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpen(o)}>
                    <td className="px-4 py-3 font-semibold text-slate-700">#{o.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{o.customer_name}</p>
                      <p className="text-xs text-slate-400">
                        {o.customer_phone} · {qty} prenda{qty !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 whitespace-nowrap">
                      {formatCOP(o.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      {fmtDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Eye size={16} className="text-slate-400 inline" />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Aún no hay pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Pedido #{open.order_number}</h2>
                <p className="text-xs text-slate-400">{fmtDate(open.created_at)}</p>
              </div>
              <button onClick={() => setOpen(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Estado */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
                <div className="flex items-center gap-2">
                  <select
                    value={open.status}
                    onChange={(e) => changeStatus(open.id, e.target.value)}
                    disabled={pending}
                    className="flex-1 rounded-lg border border-slate-300 text-sm px-3 py-2 bg-white"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                  {pending && <Loader2 size={16} className="animate-spin text-slate-400" />}
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1.5">
                <p className="font-medium text-slate-700">{open.customer_name}</p>
                <p className="text-slate-500 flex items-center gap-1.5">
                  <Phone size={13} /> {open.customer_phone}
                </p>
                {(open.customer_address || open.customer_city) && (
                  <p className="text-slate-500 flex items-start gap-1.5">
                    <MapPin size={13} className="mt-0.5" />
                    <span>
                      {open.customer_address}
                      {open.customer_address && open.customer_city ? ', ' : ''}
                      {open.customer_city}
                    </span>
                  </p>
                )}
                {open.notes && <p className="text-slate-500 italic">“{open.notes}”</p>}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Productos</p>
                <ul className="space-y-2">
                  {open.items?.map((it, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <div className="relative w-10 h-12 bg-slate-100 rounded overflow-hidden shrink-0">
                        {it.image && <Image src={it.image} alt="" fill className="object-cover" sizes="40px" />}
                      </div>
                      <div className="flex-1 min-w-0 text-sm">
                        <p className="text-slate-700 line-clamp-1">{it.name}</p>
                        <p className="text-xs text-slate-400">
                          Talla {it.size} · {it.color} · x{it.quantity}
                        </p>
                      </div>
                      <span className="text-sm text-slate-600 whitespace-nowrap">
                        {formatCOP(it.unitPrice * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-baseline border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-500">
                  Total {open.is_wholesale && <span className="text-emerald-600">· mayorista</span>}
                </span>
                <span className="text-xl font-bold text-slate-800">{formatCOP(open.total)}</span>
              </div>

              <div className="flex gap-3">
                <a
                  href={buildWhatsAppLink(
                    waPhone(open.customer_phone),
                    `¡Hola ${open.customer_name}! 🌸 Sobre tu pedido #${open.order_number} en Dulce Soñadora:`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                  <MessageCircle size={16} /> Escribir al cliente
                </a>
                <button
                  onClick={() => remove(open.id)}
                  disabled={pending}
                  className="px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50"
                  title="Eliminar pedido"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
