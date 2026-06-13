'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Gift,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Crown,
  Sparkles,
  Loader2,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import type { Product } from '@/lib/data/products';
import { formatCOP, WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import { createOrder } from '@/app/checkout/actions';

// Precio ancla referencial (gancho) tachado sobre el precio real al detal.
const ANCHOR = 59900;
// Día del Padre en Colombia 2026: tercer domingo de junio.
const FATHERS_DAY = new Date('2026-06-21T23:59:59-05:00');
const img = (n: number) => `/landing/dia-del-padre/hombre-${n}.png`;

const BENEFITS = [
  'Tela suave y fresca',
  'Máxima comodidad',
  'Diseños exclusivos',
  'Calidad premium',
  'Ajuste perfecto',
  'Resistente al lavado',
];

const REVIEWS = [
  { name: 'Laura G.', text: 'El regalo perfecto para mi papá, le encantó. La tela es suavísima.' },
  { name: 'Andrés M.', text: 'Calidad excelente y llegó rapidísimo con pago contra entrega.' },
  { name: 'Diana R.', text: 'Compré dos para mi esposo y mi suegro. Superó mis expectativas.' },
];

function useCountdown(target: Date) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setLeft(null);
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export default function FathersDayLanding({ product }: { product: Product }) {
  const realPrice = product.priceRetail;
  const discount = Math.round(((ANCHOR - realPrice) / ANCHOR) * 100);
  const gallery = product.colors.slice(0, 7).map((c, i) => ({ color: c, src: img(i + 1) }));
  const left = useCountdown(FATHERS_DAY);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderNumber: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isWholesale = qty >= product.wholesaleMinQty;
  const unit = isWholesale ? product.priceWholesale : product.priceRetail;
  const total = unit * qty;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Por favor escribe tu nombre y teléfono.');
      return;
    }
    setSubmitting(true);
    const res = await createOrder({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_city: form.city,
      customer_address: form.address,
      notes: `🎁 Pedido landing Día del Padre — Ref 065 · Color: ${gallery[active]?.color} · Talla: ${size}`,
      items: [{ productId: product.id, color: gallery[active]?.color ?? '', size, quantity: qty }],
      payment_method: 'whatsapp',
    });
    setSubmitting(false);
    if ('ok' in res && res.ok) {
      setDone({ orderNumber: res.orderNumber, total: res.total });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(('error' in res && res.error) || 'No se pudo enviar el pedido. Intenta de nuevo.');
    }
  };

  // ─── Pantalla de confirmación ───────────────────────────────────────────
  if (done) {
    const waLink = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      `¡Hola! Acabo de hacer el pedido #${done.orderNumber} del Día del Padre (Ref 065, color ${gallery[active]?.color}, talla ${size}). Quiero confirmarlo 🎁`
    );
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1E3C] to-[#16335F] text-white flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
            <Check size={42} className="text-[#0F2647]" strokeWidth={3} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">¡Pedido recibido! 🎉</h1>
          <p className="text-white/80 mb-1">
            Tu pedido <strong className="text-amber-300">#{done.orderNumber}</strong> quedó registrado.
          </p>
          <p className="text-white/80 mb-6">
            Total: <strong className="text-amber-300">{formatCOP(done.total)}</strong> · Pago contra entrega.
          </p>
          <p className="text-sm text-white/70 mb-8">
            Te contactaremos muy pronto para coordinar la entrega. Si quieres confirmar de una vez,
            escríbenos por WhatsApp:
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold px-8 py-4 rounded-full transition w-full"
          >
            <MessageCircle size={20} /> Confirmar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ─── Landing ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B1E3C] text-white">
      <div className="mx-auto max-w-md">
        {/* Barra superior */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-[#0B1E3C]/90 backdrop-blur px-4 py-2.5 border-b border-white/10">
          <span className="font-serif text-lg tracking-wide text-amber-300">Dulce Soñadora</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Día del Padre</span>
        </div>

        {/* HERO */}
        <section className="relative px-5 pt-7 pb-6 text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/5 px-4 py-1.5 mb-4">
            <Crown size={15} className="text-amber-300" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
              Para el rey de la casa
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium leading-tight mb-3">
            🎁 El regalo perfecto <br /> para papá
          </h1>
          <p className="text-sm text-white/75 max-w-sm mx-auto mb-5">
            Comodidad, estilo y calidad premium para celebrar a quien siempre ha estado contigo.
          </p>

          {/* Imagen principal (infografía del color elegido) */}
          <div className="relative mx-auto w-full max-w-[340px] rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/40 bg-white">
            <div className="relative aspect-[2/3]">
              <Image
                src={gallery[active]?.src ?? img(1)}
                alt={`Pijama para papá — ${gallery[active]?.color}`}
                fill
                sizes="340px"
                priority
                className="object-cover"
              />
            </div>
            <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F2647] text-xs font-extrabold px-3 py-1 rounded-full shadow">
              -{discount}% OFF
            </span>
          </div>

          {/* Selector de color */}
          <p className="mt-5 mb-2 text-xs uppercase tracking-widest text-white/60">
            Color: <span className="text-amber-300 font-semibold normal-case tracking-normal">{gallery[active]?.color}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {gallery.map((g, i) => (
              <button
                key={g.color}
                onClick={() => setActive(i)}
                aria-label={g.color}
                className={`relative w-12 h-16 rounded-lg overflow-hidden ring-2 transition ${
                  active === i ? 'ring-amber-400 scale-105' : 'ring-white/20 opacity-75 hover:opacity-100'
                }`}
              >
                <Image src={g.src} alt={g.color} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-white/50 line-through text-lg">{formatCOP(ANCHOR)}</span>
            <span className="font-serif text-4xl font-bold text-amber-300">{formatCOP(realPrice)}</span>
          </div>
          <p className="mt-1 text-xs text-white/60">
            Llevando {product.wholesaleMinQty} o más: {formatCOP(product.priceWholesale)} c/u
          </p>

          {/* Beneficios oferta */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-left text-sm">
            {[
              { Icon: Truck, t: 'Envío GRATIS' },
              { Icon: ShieldCheck, t: 'Pago contra entrega' },
              { Icon: RefreshCw, t: 'Cambios garantizados' },
              { Icon: Gift, t: 'Listo para regalar' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                <Icon size={16} className="text-amber-300 shrink-0" />
                <span className="text-white/85">{t}</span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToForm}
            className="mt-6 w-full bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F2647] font-extrabold text-lg py-4 rounded-full shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            🛍️ COMPRAR AHORA
          </button>
          <button onClick={scrollToForm} className="mt-2 text-white/60 text-xs inline-flex items-center gap-1">
            Pedir contra entrega <ChevronDown size={14} />
          </button>
        </section>

        {/* Cuenta regresiva */}
        {left && (
          <section className="px-5 py-5 bg-white/5 border-y border-white/10 text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200 mb-3">
              ⏳ La promoción termina el Día del Padre
            </p>
            <div className="flex justify-center gap-2">
              {([['Días', left.d], ['Horas', left.h], ['Min', left.m], ['Seg', left.s]] as const).map(
                ([l, v]) => (
                  <div key={l} className="w-16 rounded-xl bg-[#0B1E3C] border border-white/15 py-2">
                    <div className="text-2xl font-bold text-amber-300 tabular-nums leading-none">
                      {String(v).padStart(2, '0')}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-white/55">{l}</div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Beneficios del producto */}
        <section className="px-5 py-8">
          <h2 className="font-serif text-2xl text-center mb-5">¿Por qué le va a encantar?</h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-white/85">
                <span className="w-6 h-6 rounded-full bg-amber-300/20 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-amber-300" />
                </span>
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* Prueba social */}
        <section className="px-5 py-8 bg-white/5 border-y border-white/10">
          <div className="flex justify-center gap-1 text-amber-300 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-amber-300" />
            ))}
          </div>
          <p className="text-center text-sm text-white/70 mb-6">
            Más de <strong className="text-white">5.000 clientes</strong> felices
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-xl bg-[#0B1E3C] border border-white/10 p-4">
                <div className="flex gap-0.5 text-amber-300 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-300" />
                  ))}
                </div>
                <p className="text-sm text-white/85 italic">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-2 text-xs text-amber-200 font-semibold">— {r.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULARIO DE PEDIDO */}
        <section ref={formRef} className="px-5 py-9">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-300" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
              Pídela ahora
            </span>
          </div>
          <h2 className="font-serif text-2xl mb-1">Haz feliz a papá 🎁</h2>
          <p className="text-sm text-white/70 mb-5">
            Completa tus datos y te la enviamos con <strong className="text-amber-300">pago contra entrega</strong>. ¡Envío gratis!
          </p>

          <form onSubmit={submit} className="space-y-3">
            {/* Color + talla + cantidad */}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-white/70">
                Color
                <select
                  value={active}
                  onChange={(e) => setActive(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-white text-[#0F2647] px-3 py-2.5 text-sm font-medium"
                >
                  {gallery.map((g, i) => (
                    <option key={g.color} value={i}>
                      {g.color}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/70">
                Talla
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-white text-[#0F2647] px-3 py-2.5 text-sm font-medium"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="text-sm text-white/80">Cantidad</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-lg leading-none"
                  aria-label="Disminuir"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-lg leading-none"
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-lg bg-white text-[#0F2647] placeholder-gray-400 px-3 py-3 text-sm"
            />
            <input
              type="tel"
              placeholder="Teléfono / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full rounded-lg bg-white text-[#0F2647] placeholder-gray-400 px-3 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="Ciudad / Municipio"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg bg-white text-[#0F2647] placeholder-gray-400 px-3 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="Dirección de entrega"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg bg-white text-[#0F2647] placeholder-gray-400 px-3 py-3 text-sm"
            />

            {/* Resumen total */}
            <div className="flex items-center justify-between rounded-lg bg-amber-300/10 border border-amber-300/30 px-4 py-3">
              <div>
                <p className="text-sm text-white/80">Total a pagar</p>
                {isWholesale && (
                  <p className="text-[11px] text-amber-200">¡Precio especial por {qty} unidades!</p>
                )}
              </div>
              <span className="font-serif text-2xl font-bold text-amber-300">{formatCOP(total)}</span>
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F2647] font-extrabold text-lg py-4 rounded-full shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Enviando…
                </>
              ) : (
                <>📦 PEDIR CONTRA ENTREGA</>
              )}
            </button>
            <p className="text-center text-[11px] text-white/55">
              🔒 Sin pagos por adelantado · Pagas cuando recibes
            </p>
          </form>
        </section>

        {/* Cierre */}
        <footer className="px-5 py-8 text-center border-t border-white/10">
          <p className="font-serif text-xl text-amber-300">Dulce Soñadora</p>
          <p className="text-xs text-white/50 mt-1">El encanto de soñar · Envíos a toda Colombia</p>
        </footer>
      </div>
    </div>
  );
}
