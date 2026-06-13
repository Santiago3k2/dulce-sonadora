'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Sparkles,
  Loader2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Product } from '@/lib/data/products';
import { formatCOP, WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import { createOrder } from '@/app/checkout/actions';

// Precio ancla referencial (gancho) tachado sobre el precio real al detal.
const ANCHOR = 42900;

const BENEFITS = [
  'Algodón suave que no irrita su piel',
  'Fresca y transpirable para dormir cómoda',
  'Estampados que les encantan',
  'Camiseta manga corta + pantalón largo',
  'Tallas de la 2 a la 16',
  'Colores que no destiñen con el lavado',
];

const REVIEWS = [
  { name: 'Carolina P.', city: 'Bogotá', text: 'A mi hija le fascinó la de Stitch. La tela es suavecita y fresca.' },
  { name: 'Marcela T.', city: 'Bucaramanga', text: 'Compré dos, llegaron rapidísimo y pagué al recibir. Quedé feliz.' },
  { name: 'Yuli A.', city: 'Cali', text: 'La calidad es bellísima y los estampados ni se imaginan lo lindos.' },
];

export default function NinaPijamaLanding({ product }: { product: Product }) {
  const realPrice = product.priceRetail;
  const discount = Math.round(((ANCHOR - realPrice) / ANCHOR) * 100);
  const saving = ANCHOR - realPrice;
  // Infografías de campaña (en el mismo orden que product.colors:
  // 1 Sweet Dreams · 2 Good Night · 3 Huntrix · 4 Chicas Superpoderosas).
  const LANDING_IMAGES = [
    '/landing/pijama-nina/nina-1.png',
    '/landing/pijama-nina/nina-2.png',
    '/landing/pijama-nina/nina-3.png',
    '/landing/pijama-nina/nina-4.png',
  ];
  const gallery = product.colors.map((c, i) => ({
    color: c,
    src: LANDING_IMAGES[i] ?? product.images[i] ?? product.images[0],
  }));

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
      notes: `💖 Pedido landing Pijama Niña — Ref 064 · Diseño: ${gallery[active]?.color} · Talla: ${size}`,
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

  // Textura de puntos blancos sutil (alegre).
  const dots = {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.6px)',
    backgroundSize: '20px 20px',
  };

  // ─── Confirmación ─────────────────────────────────────────────────────
  if (done) {
    const waLink = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      `¡Hola! Acabo de hacer el pedido #${done.orderNumber} de la pijama de niña (Ref 064, diseño ${gallery[active]?.color}, talla ${size}). Quiero confirmarlo 💖`
    );
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#B76E8E] via-[#8C5A82] to-[#574568] text-white flex items-center justify-center px-5 py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={dots} />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="relative w-full max-w-md text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl">
            <Check size={42} className="text-pink-deeper" strokeWidth={3} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">¡Pedido confirmado! 🎉</h1>
          <p className="text-white/90 mb-1">
            Tu pedido <strong>#{done.orderNumber}</strong> quedó registrado.
          </p>
          <p className="text-white/90 mb-6">
            Total: <strong>{formatCOP(done.total)}</strong> · Pago contra entrega.
          </p>
          <p className="text-sm text-white/80 mb-8">
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
    <div className="relative min-h-screen bg-[#8C5A82] text-white overflow-hidden">
      {/* Fondo con profundidad — rosa empolvado → malva → ciruela (elegante, no empalagoso) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B76E8E] via-[#8C5A82] to-[#574568]" />
        <div className="absolute inset-0" style={dots} />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-white/15 blur-[90px]" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-amber-200/15 blur-[90px]" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(80,30,80,0.4)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md pb-28">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl tracking-wide text-white">Dulce Soñadora</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">Colección Niña</span>
        </div>

        {/* HERO */}
        <section className="px-5 pt-3 text-center">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white font-semibold mb-3">
            <Sparkles size={14} className="text-amber-200" /> Nueva colección niña
          </p>
          <h1 className="font-serif leading-[1.02] mb-3">
            <span className="block text-white/90 text-2xl sm:text-3xl font-light">La pijama soñada</span>
            <span className="block gold-text italic text-5xl sm:text-6xl">para tu niña</span>
          </h1>
          <p className="text-sm text-white/85 max-w-xs mx-auto mb-5">
            Camiseta manga corta + pantalón en algodón suave. Con sus personajes favoritos. 💖
          </p>

          {/* Galería deslizable */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div
              className="embla rounded-2xl overflow-hidden ring-1 ring-white/30 shadow-2xl shadow-black/30"
              ref={emblaRef}
            >
              <div className="embla__container">
                {gallery.map((g, i) => (
                  <div className="embla__slide" key={g.color}>
                    <div className="relative aspect-[3/4] bg-white/10">
                      <Image
                        src={g.src}
                        alt={`Pijama niña — ${g.color}`}
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

            <span className="absolute top-3 left-3 z-10 bg-white text-pink-deeper text-xs font-extrabold px-3 py-1 rounded-full shadow">
              -{discount}% OFF
            </span>

            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 rounded-full bg-black/30 backdrop-blur px-2.5 py-1.5">
              {gallery.map((g, i) => (
                <button
                  key={g.color}
                  onClick={() => goTo(i)}
                  aria-label={`Ver ${g.color}`}
                  className={`h-1.5 rounded-full transition-all ${
                    active === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hint + diseño */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/70">
            <ChevronLeft size={13} className="text-amber-200" />
            Desliza para ver los {gallery.length} diseños
            <ChevronRight size={13} className="text-amber-200" />
          </p>
          <p className="mt-1 text-sm">
            Diseño: <span className="font-semibold text-amber-100">{gallery[active]?.color}</span>
          </p>

          {/* Miniaturas */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {gallery.map((g, i) => (
              <button
                key={g.color}
                onClick={() => goTo(i)}
                aria-label={g.color}
                className={`relative w-11 h-14 rounded-lg overflow-hidden ring-2 transition ${
                  active === i ? 'ring-white scale-105' : 'ring-white/25 opacity-75 hover:opacity-100'
                }`}
              >
                <Image src={g.src} alt={g.color} fill sizes="44px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-6 flex items-end justify-center gap-3">
            <span className="text-white/55 line-through text-lg mb-1.5">{formatCOP(ANCHOR)}</span>
            <span className="font-serif text-5xl font-bold text-white leading-none drop-shadow">
              {formatCOP(realPrice)}
            </span>
          </div>
          <p className="mt-2 inline-block rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1">
            ¡Ahorras {formatCOP(saving)} hoy!
          </p>
          <p className="mt-2 text-xs text-white/70">
            Llevando {product.wholesaleMinQty}+: {formatCOP(product.priceWholesale)} c/u
          </p>

          {/* CTA principal */}
          <button
            onClick={scrollToForm}
            className="mt-6 w-full rounded-full py-4 text-lg font-extrabold bg-white text-pink-deeper shadow-lg shadow-black/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            <Heart size={20} className="fill-pink-deeper" /> LA QUIERO PARA ELLA
          </button>

          {/* Confianza */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { Icon: Truck, t: 'Envío GRATIS' },
              { Icon: ShieldCheck, t: 'Pago al recibir' },
              { Icon: RefreshCw, t: 'Cambios fáciles' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 border border-white/20 py-2.5">
                <Icon size={18} className="text-white" />
                <span className="text-white/90 leading-tight text-center">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Urgencia suave */}
        <section className="mt-8 mx-5 rounded-2xl bg-white/15 border border-white/25 backdrop-blur p-4 text-center">
          <p className="text-sm text-white">
            🔥 <strong>Súper pedidas</strong> esta semana · Últimas unidades por talla
          </p>
        </section>

        {/* Beneficios */}
        <section className="px-5 py-9">
          <h2 className="font-serif text-2xl text-center mb-1">
            Comodidad que <span className="italic text-amber-100">ellas aman</span>
          </h2>
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mb-6" />
          <div className="grid grid-cols-1 gap-2.5">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-white/12 border border-white/20 px-4 py-3">
                <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                  <Check size={15} className="text-white" />
                </span>
                <span className="text-sm text-white/90">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prueba social */}
        <section className="px-5 py-8 border-y border-white/15 bg-white/[0.06]">
          <div className="flex justify-center gap-1 text-amber-200 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-amber-200" />
            ))}
          </div>
          <p className="text-center text-sm text-white/80 mb-6">
            <strong className="text-white">+5.000</strong> mamás felices en toda Colombia
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/12 border border-white/20 p-4">
                <div className="flex gap-0.5 text-amber-200 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-200" />
                  ))}
                </div>
                <p className="text-sm text-white/90 italic">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-2 text-xs text-amber-100 font-semibold">
                  — {r.name}, {r.city}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULARIO */}
        <section ref={formRef} className="px-5 py-9">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-100 font-semibold mb-2">Pídela ahora</p>
          <h2 className="font-serif text-3xl mb-1">
            Hazla <span className="italic text-amber-100">feliz</span> 💖
          </h2>
          <p className="text-sm text-white/85 mb-5">
            Llena tus datos y se la llevamos con <strong className="text-white">pago contra entrega</strong>. ¡Envío gratis a toda Colombia!
          </p>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-white/80">
                Diseño
                <select
                  value={active}
                  onChange={(e) => {
                    const i = Number(e.target.value);
                    setActive(i);
                    goTo(i);
                  }}
                  className="mt-1 w-full rounded-lg bg-white text-pink-deeper px-3 py-2.5 text-sm font-medium"
                >
                  {gallery.map((g, i) => (
                    <option key={g.color} value={i}>
                      {g.color}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/80">
                Talla
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-white text-pink-deeper px-3 py-2.5 text-sm font-medium"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/12 border border-white/20 px-4 py-2.5">
              <span className="text-sm text-white/90">Cantidad</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-lg leading-none" aria-label="Disminuir">−</button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-lg leading-none" aria-label="Aumentar">+</button>
              </div>
            </div>

            <input type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg bg-white text-pink-deeper placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="tel" placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full rounded-lg bg-white text-pink-deeper placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Ciudad / Municipio" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg bg-white text-pink-deeper placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Dirección de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg bg-white text-pink-deeper placeholder-gray-400 px-3 py-3 text-sm" />

            <div className="flex items-center justify-between rounded-xl bg-white/20 border border-white/30 px-4 py-3">
              <div>
                <p className="text-sm text-white/90">Total a pagar</p>
                {isWholesale && <p className="text-[11px] text-amber-100">¡Precio especial por {qty} unidades!</p>}
              </div>
              <span className="font-serif text-2xl font-bold text-white">{formatCOP(total)}</span>
            </div>

            {error && (
              <p className="text-sm text-white bg-red-500/30 border border-white/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="w-full rounded-full py-4 text-lg font-extrabold bg-white text-pink-deeper shadow-lg shadow-black/20 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? (<><Loader2 size={20} className="animate-spin" /> Enviando…</>) : (<>📦 PEDIR CONTRA ENTREGA</>)}
            </button>
            <p className="text-center text-[11px] text-white/70">🔒 Sin pagos por adelantado · Pagas cuando recibes</p>
          </form>
        </section>

        {/* Cierre */}
        <footer className="px-5 py-8 text-center border-t border-white/15">
          <p className="font-serif text-xl text-white">Dulce Soñadora</p>
          <p className="text-xs text-white/70 mt-1 italic">El encanto de soñar · Envíos a toda Colombia</p>
        </footer>
      </div>

      {/* Botón fijo de compra (visible desde que entras) */}
      {!formInView && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-[#3E3152] via-[#3E3152]/90 to-transparent">
          <div className="mx-auto max-w-md">
            <button
              onClick={scrollToForm}
              className="w-full rounded-full py-3.5 px-5 font-extrabold bg-white text-pink-deeper shadow-lg shadow-black/25 animate-soft-pulse flex items-center justify-between"
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold opacity-60">Pijama Niña · -{discount}%</span>
                <span className="text-base">Pedir ahora · {formatCOP(realPrice)}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Heart size={18} className="fill-pink-deeper" /> →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
