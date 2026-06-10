'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Loader2, LogOut, Package, User, Check } from 'lucide-react';
import { formatCOP } from '@/lib/utils/format';
import { updateProfile, signOutCustomer } from './actions';
import type { CustomerProfile } from '@/lib/customer';

export interface OrderRow {
  id: string;
  order_number: number;
  created_at: string;
  total: number;
  status: string;
  payment_method: string | null;
  is_wholesale: boolean;
  items: { name: string; quantity: number; size: string; color: string }[] | null;
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  pendiente: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700' },
  en_proceso: { label: 'En proceso', cls: 'bg-blue-50 text-blue-700' },
  enviado: { label: 'Enviado', cls: 'bg-indigo-50 text-indigo-700' },
  entregado: { label: 'Entregado', cls: 'bg-emerald-50 text-emerald-700' },
  cancelado: { label: 'Cancelado', cls: 'bg-red-50 text-red-600' },
};

const TIER_LABEL: Record<string, string> = {
  detal: 'Cliente',
  mayorista: 'Mayorista',
  vip: 'VIP',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AccountContent({
  email,
  profile,
  orders,
}: {
  email: string;
  profile: CustomerProfile | null;
  orders: OrderRow[];
}) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState(profile?.address ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, start] = useTransition();
  const [signingOut, startSignOut] = useTransition();

  const tier = profile?.tier ?? 'detal';
  const discount = Number(profile?.discount_pct) || 0;
  const special = tier !== 'detal' || discount > 0;

  const inputCls =
    'w-full rounded-lg border border-gray-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const labelCls = 'block text-xs font-medium text-text-muted mb-1.5';

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    start(async () => {
      const res = await updateProfile({ full_name: fullName, phone, address, city });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Mi cuenta</h1>
          <p className="text-sm text-text-muted mt-1">{email}</p>
        </div>
        <button
          onClick={() => startSignOut(() => signOutCustomer())}
          disabled={signingOut}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-pink-deeper transition disabled:opacity-60 shrink-0"
        >
          {signingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          Salir
        </button>
      </header>

      {special && (
        <div className="mb-8 rounded-xl bg-gradient-pink-soft/60 border border-pink-soft px-4 py-3 text-sm">
          <span className="font-semibold text-pink-deeper">
            {TIER_LABEL[tier] ?? tier}
          </span>{' '}
          <span className="text-text-muted">
            — tienes precios especiales aplicados automáticamente en tus pedidos
            {discount > 0 && ` (${discount}% de descuento adicional)`}.
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Perfil */}
        <section className="lg:col-span-2">
          <h2 className="flex items-center gap-2 font-serif text-lg mb-4">
            <User size={18} className="text-pink-deeper" /> Mis datos
          </h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Teléfono / WhatsApp *</label>
              <input
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="tel"
              />
            </div>
            <div>
              <label className={labelCls}>Dirección de entrega</label>
              <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Ciudad</label>
              <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-pink-deeper text-white rounded-full py-2.5 text-sm font-semibold hover:bg-pink-dark transition disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saved && !saving && <Check size={16} />}
              {saved && !saving ? 'Guardado' : saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </section>

        {/* Pedidos */}
        <section className="lg:col-span-3">
          <h2 className="flex items-center gap-2 font-serif text-lg mb-4">
            <Package size={18} className="text-pink-deeper" /> Mis pedidos
          </h2>

          {orders.length === 0 ? (
            <div className="text-center bg-gray-soft rounded-xl py-12 px-4">
              <Package size={40} className="mx-auto text-pink-soft mb-3" strokeWidth={1.3} />
              <p className="text-sm text-text-muted mb-4">Todavía no tienes pedidos.</p>
              <Link href="/tienda" className="btn-primary inline-block">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => {
                const st = STATUS_STYLE[o.status] ?? {
                  label: o.status,
                  cls: 'bg-gray-soft text-text-muted',
                };
                const lines = o.items ?? [];
                return (
                  <li
                    key={o.id}
                    className="bg-white border border-gray-line rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-pink-deeper">#{o.order_number}</span>
                      <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{formatDate(o.created_at)}</p>
                    <ul className="text-sm text-text-muted space-y-0.5 mb-3">
                      {lines.map((it, i) => (
                        <li key={i} className="line-clamp-1">
                          {it.quantity}× {it.name}
                          <span className="text-xs"> · {it.size} · {it.color}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-gray-line pt-2">
                      {o.is_wholesale && (
                        <span className="text-xs text-emerald-600">Precio mayorista</span>
                      )}
                      <span className="ml-auto font-semibold text-text-dark">
                        {formatCOP(o.total)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
