'use client';

import { useMemo, useState, useTransition } from 'react';
import { Check, Loader2, Search, Users } from 'lucide-react';
import { setCustomerTier } from '@/lib/admin/customer-actions';
import { formatCOP } from '@/lib/utils/format';

export interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  tier: string;
  discount_pct: number;
  notes: string;
  created_at: string;
  orders_count: number;
  orders_total: number;
}

const TIER_OPTIONS = [
  { value: 'detal', label: 'Cliente (detal)' },
  { value: 'mayorista', label: 'Mayorista' },
  { value: 'vip', label: 'VIP' },
];

const TIER_BADGE: Record<string, string> = {
  detal: 'bg-slate-100 text-slate-600',
  mayorista: 'bg-emerald-50 text-emerald-700',
  vip: 'bg-amber-50 text-amber-700',
};

function Row({ c }: { c: CustomerRow }) {
  const [tier, setTier] = useState(c.tier);
  const [discount, setDiscount] = useState(String(c.discount_pct));
  const [notes, setNotes] = useState(c.notes);
  const [saving, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const dirty =
    tier !== c.tier || Number(discount) !== c.discount_pct || notes.trim() !== c.notes.trim();

  function save() {
    setError('');
    setSaved(false);
    start(async () => {
      const res = await setCustomerTier(c.id, {
        tier,
        discount_pct: Number(discount) || 0,
        notes,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-slate-800">{c.full_name || '(sin nombre)'}</p>
            <span
              className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${TIER_BADGE[tier] ?? TIER_BADGE.detal}`}
            >
              {TIER_OPTIONS.find((t) => t.value === tier)?.label ?? tier}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 break-all">
            {c.email}
            {c.phone && <> · {c.phone}</>}
            {c.city && <> · {c.city}</>}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Desde {new Date(c.created_at).toLocaleDateString('es-CO')} ·{' '}
            {c.orders_count === 0
              ? 'sin pedidos'
              : `${c.orders_count} pedido${c.orders_count === 1 ? '' : 's'} · ${formatCOP(c.orders_total)}`}
          </p>
        </div>

        <div className="flex items-end gap-2 flex-wrap">
          <label className="text-xs text-slate-500">
            Tier
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="block mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
            >
              {TIER_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-500">
            Desc. extra %
            <input
              type="number"
              min={0}
              max={90}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="block mt-1 w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
            />
          </label>
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 bg-pink-deeper text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-pink-dark transition disabled:opacity-40"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas internas (solo las ve el admin)…"
        className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
      />
      {error && <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">{error}</p>}
    </div>
  );
}

export default function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const [q, setQ] = useState('');
  const [tierFilter, setTierFilter] = useState('todos');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return customers.filter((c) => {
      if (tierFilter !== 'todos' && c.tier !== tierFilter) return false;
      if (!term) return true;
      return [c.full_name, c.email, c.phone, c.city].some((v) =>
        v.toLowerCase().includes(term)
      );
    });
  }, [customers, q, tierFilter]);

  if (customers.length === 0) {
    return (
      <div className="text-center bg-white border border-slate-200 rounded-xl py-16 px-4">
        <Users size={40} className="mx-auto text-slate-300 mb-3" strokeWidth={1.3} />
        <p className="text-sm text-slate-500">
          Todavía no hay clientes registrados. Cuando alguien cree su cuenta en la
          tienda aparecerá aquí.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, correo, teléfono o ciudad…"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-deeper/30"
        >
          <option value="todos">Todos los tiers</option>
          {TIER_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-400">
          {filtered.length} de {customers.length}
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Row key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
