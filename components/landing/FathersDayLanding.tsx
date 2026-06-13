'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Gift,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Crown,
  Loader2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
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
  'Tela suave tipo algodón premium',
  'Fresca y transpirable',
  'Corte moderno que no aprieta',
  'Bolsillo y ribete en contraste',
  'Resiste lavadas sin perder color',
  'Empaque listo para regalar',
];

const REVIEWS = [
  { name: 'Laura G.', city: 'Bogotá', text: 'El regalo perfecto para mi papá, le encantó. La tela es suavísima.' },
  { name: 'Andrés M.', city: 'Medellín', text: 'Calidad excelente y llegó rapidísimo, pagué al recibir. 10/10.' },
  { name: 'Diana R.', city: 'Cali', text: 'Compré para mi esposo y mi suegro. Se ven elegantísimas.' },
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
  const saving = ANCHOR - realPrice;
  const gallery = product.colors.slice(0, 7).map((c, i) => ({ color: c, src: img(i + 1) }));
  const left = useCountdown(FATHERS_DAY);

  // Galería deslizable (swipe con el dedo).
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [active, setActive] = useState(0);
  const onSelect = useCallback(() => {
    if (emblaApi) setActive(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);
  const goTo = (i: number) => emblaApi?.scrollTo(i);

  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderNumber: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const [formInView, setFormInView] = useState(false);
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), {
      threshold: 0.15,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  // ─── Confirmación ─────────────────────────────────────────────────────
  if (done) {
    const waLink = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      `¡Hola! Acabo de hacer el pedido #${done.orderNumber} del Día del Padre (Ref 065, color ${gallery[active]?.color}, talla ${size}). Quiero confirmarlo 🎁`
    );
    return (
      <div className="relative min-h-screen bg-[#0B1E3C] text-white flex items-center justify-center px-5 py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 lux-dots opacity-60" />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative w-full max-w-md text-center">
          <div className="mx-auto w-20 h-20 rounded-full btn-lux flex items-center justify-center mb-6">
            <Check size={42} className="text-[#0B1E3C]" strokeWidth={3} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">
            ¡Pedido <span className="gold-text italic">confirmado</span>! 🎉
          </h1>
          <p className="text-white/80 mb-1">
            Tu pedido <strong className="gold-text">#{done.orderNumber}</strong> quedó registrado.
          </p>
          <p className="text-white/80 mb-6">
            Total: <strong className="gold-text">{formatCOP(done.total)}</strong> · Pago contra entrega.
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

  // ─── Landing ──────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#0B1E3C] text-white overflow-hidden">
      {/* Fondo con profundidad (fijo: da sensación de capas al hacer scroll) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1A33] via-[#102A52] to-[#070F22]" />
        <div className="absolute inset-0 lux-dots opacity-70" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[460px] h-[460px] rounded-full bg-amber-400/15 blur-[90px]" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-[90px]" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md pb-28">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl tracking-wide gold-text">Dulce Soñadora</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/55">Est. Premium</span>
        </div>

        {/* HERO */}
        <section className="px-5 pt-3 text-center">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] gold-text font-semibold mb-3">
            <Crown size={14} className="text-amber-300" /> Edición Día del Padre
          </p>
          <h1 className="font-serif leading-[1.02] mb-3">
            <span className="block text-white/90 text-2xl sm:text-3xl font-light">El regalo perfecto</span>
            <span className="block gold-shine italic text-5xl sm:text-6xl">para Papá</span>
          </h1>
          <p className="text-sm text-white/70 max-w-xs mx-auto mb-5">
            Pijama premium, suave y elegante. Comodidad que se siente, estilo que se nota.
          </p>

          {/* Galería deslizable */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div
              className="embla rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/45"
              ref={emblaRef}
            >
              <div className="embla__container">
                {gallery.map((g, i) => (
                  <div className="embla__slide" key={g.color}>
                    <div className="relative aspect-[2/3] bg-[#0B1E3C]">
                      <Image
                        src={g.src}
                        alt={`Pijama para papá — ${g.color}`}
                        fill
                        sizes="360px"
                        priority={i === 0}
                        draggable={false}
                        className="object-contain select-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge descuento */}
            <span className="absolute top-3 left-3 z-10 btn-lux text-xs font-extrabold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>

            {/* Flechas */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur border border-white/15 flex items-center justify-center text-white/90 hover:bg-black/60 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur border border-white/15 flex items-center justify-center text-white/90 hover:bg-black/60 transition"
            >
              <ChevronRight size={20} />
            </button>

            {/* Puntos */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 rounded-full bg-black/35 backdrop-blur px-2.5 py-1.5">
              {gallery.map((g, i) => (
                <button
                  key={g.color}
                  onClick={() => goTo(i)}
                  aria-label={`Ver ${g.color}`}
                  className={`h-1.5 rounded-full transition-all ${
                    active === i ? 'w-5 bg-amber-300' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hint + color */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/55">
            <ChevronLeft size={13} className="text-amber-300" />
            Desliza para ver los 7 colores
            <ChevronRight size={13} className="text-amber-300" />
          </p>
          <p className="mt-1 text-sm">
            Color: <span className="gold-text font-semibold">{gallery[active]?.color}</span>
          </p>

          {/* Miniaturas de color */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {gallery.map((g, i) => (
              <button
                key={g.color}
                onClick={() => goTo(i)}
                aria-label={g.color}
                className={`relative w-11 h-14 rounded-lg overflow-hidden ring-2 transition ${
                  active === i ? 'ring-amber-300 scale-105' : 'ring-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={g.src} alt={g.color} fill sizes="44px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-6 flex items-end justify-center gap-3">
            <span className="text-white/45 line-through text-lg mb-1.5">{formatCOP(ANCHOR)}</span>
            <span className="font-serif text-5xl font-bold gold-shine leading-none">{formatCOP(realPrice)}</span>
          </div>
          <p className="mt-2 inline-block rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-200 text-xs font-semibold px-3 py-1">
            Ahorras {formatCOP(saving)} hoy
          </p>
          <p className="mt-2 text-xs text-white/55">
            Llevando {product.wholesaleMinQty}+: {formatCOP(product.priceWholesale)} c/u
          </p>

          {/* CTA principal */}
          <button
            onClick={scrollToForm}
            className="btn-lux mt-6 w-full rounded-full py-4 text-lg font-extrabold flex items-center justify-center gap-2"
          >
            <Gift size={20} /> QUIERO REGALÁRSELA
          </button>

          {/* Confianza */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { Icon: Truck, t: 'Envío GRATIS' },
              { Icon: ShieldCheck, t: 'Pago al recibir' },
              { Icon: RefreshCw, t: 'Cambios fáciles' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-white/10 py-2.5">
                <Icon size={18} className="text-amber-300" />
                <span className="text-white/80 leading-tight text-center">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cuenta regresiva */}
        {left && (
          <section className="mt-8 mx-5 rounded-2xl bg-white/5 border border-amber-300/20 backdrop-blur p-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] gold-text mb-3 font-semibold">
              ⏳ La promoción termina pronto
            </p>
            <div className="flex justify-center gap-2">
              {([['Días', left.d], ['Horas', left.h], ['Min', left.m], ['Seg', left.s]] as const).map(
                ([l, v]) => (
                  <div key={l} className="w-16 rounded-xl bg-[#0B1E3C]/80 border border-white/10 py-2">
                    <div className="text-2xl font-bold gold-text tabular-nums leading-none">
                      {String(v).padStart(2, '0')}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50">{l}</div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Beneficios */}
        <section className="px-5 py-9">
          <h2 className="font-serif text-2xl text-center mb-1">
            Hecha para <span className="gold-text italic">consentir a papá</span>
          </h2>
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent mb-6" />
          <div className="grid grid-cols-1 gap-2.5">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <span className="w-7 h-7 rounded-full bg-amber-300/15 flex items-center justify-center shrink-0">
                  <Check size={15} className="text-amber-300" />
                </span>
                <span className="text-sm text-white/85">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prueba social */}
        <section className="px-5 py-8 border-y border-white/10 bg-white/[0.03]">
          <div className="flex justify-center gap-1 text-amber-300 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-amber-300" />
            ))}
          </div>
          <p className="text-center text-sm text-white/65 mb-6">
            <strong className="text-white">+5.000</strong> papás felices en toda Colombia
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-[#0B1E3C]/70 border border-white/10 p-4">
                <div className="flex gap-0.5 text-amber-300 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-300" />
                  ))}
                </div>
                <p className="text-sm text-white/85 italic">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-2 text-xs gold-text font-semibold">
                  — {r.name}, {r.city}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULARIO */}
        <section ref={formRef} className="px-5 py-9">
          <p className="text-[11px] uppercase tracking-[0.3em] gold-text font-semibold mb-2">
            Pídela ahora
          </p>
          <h2 className="font-serif text-3xl mb-1">
            Hazlo sentir <span className="gold-text italic">especial</span>
          </h2>
          <p className="text-sm text-white/70 mb-5">
            Llena tus datos y te la llevamos con <strong className="text-amber-200">pago contra entrega</strong>. Envío gratis a toda Colombia.
          </p>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-white/70">
                Color
                <select
                  value={active}
                  onChange={(e) => {
                    const i = Number(e.target.value);
                    setActive(i);
                    goTo(i);
                  }}
                  className="mt-1 w-full rounded-lg bg-white text-[#0B1E3C] px-3 py-2.5 text-sm font-medium"
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
                  className="mt-1 w-full rounded-lg bg-white text-[#0B1E3C] px-3 py-2.5 text-sm font-medium"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-4 py-2.5">
              <span className="text-sm text-white/80">Cantidad</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-lg leading-none" aria-label="Disminuir">−</button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-lg leading-none" aria-label="Aumentar">+</button>
              </div>
            </div>

            <input type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg bg-white text-[#0B1E3C] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="tel" placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full rounded-lg bg-white text-[#0B1E3C] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Ciudad / Municipio" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg bg-white text-[#0B1E3C] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Dirección de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg bg-white text-[#0B1E3C] placeholder-gray-400 px-3 py-3 text-sm" />

            <div className="flex items-center justify-between rounded-xl bg-amber-300/10 border border-amber-300/30 px-4 py-3">
              <div>
                <p className="text-sm text-white/80">Total a pagar</p>
                {isWholesale && <p className="text-[11px] text-amber-200">¡Precio especial por {qty} unidades!</p>}
              </div>
              <span className="font-serif text-2xl font-bold gold-text">{formatCOP(total)}</span>
            </div>

            {error && (
              <p className="text-sm text-red-200 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-lux w-full rounded-full py-4 text-lg font-extrabold flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? (<><Loader2 size={20} className="animate-spin" /> Enviando…</>) : (<>📦 PEDIR CONTRA ENTREGA</>)}
            </button>
            <p className="text-center text-[11px] text-white/55">🔒 Sin pagos por adelantado · Pagas cuando recibes</p>
          </form>
        </section>

        {/* Cierre */}
        <footer className="px-5 py-8 text-center border-t border-white/10">
          <p className="font-serif text-xl gold-text">Dulce Soñadora</p>
          <p className="text-xs text-white/45 mt-1 italic">El encanto de soñar · Envíos a toda Colombia</p>
        </footer>
      </div>

      {/* Botón fijo de compra (visible desde que entras) */}
      {!formInView && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
          <div className="mx-auto max-w-md">
            <button
              onClick={scrollToForm}
              className="btn-lux animate-gold-pulse w-full rounded-full py-3.5 px-5 font-extrabold flex items-center justify-between"
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold opacity-70">Día del Padre · -{discount}%</span>
                <span className="text-base">Pedir ahora · {formatCOP(realPrice)}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Gift size={18} /> →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
