'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Sun,
  Waves,
  Droplets,
  ShieldCheck,
  Truck,
  Star,
  Check,
  Loader2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { priceForSize, type Product } from '@/lib/data/products';
import { formatCOP, WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import { createOrder } from '@/app/checkout/actions';

// Precio ancla referencial (gancho) tachado sobre el precio "desde".
const ANCHOR = 46900;

const BENEFITS = [
  'Protección UV: cuida su piel del sol',
  'Secado rápido para seguir jugando',
  'Resistente al cloro y la sal',
  'Tela suave y elástica que no aprieta',
  'Boleritos en los hombros, ¡divinos!',
  'Tallas de la 2 a la 16',
];

const REVIEWS = [
  { name: 'Paola C.', city: 'Santa Marta', text: 'Perfecto para la piscina, seca rapidísimo y a mi hija le encantó el de Stitch.' },
  { name: 'Natalia R.', city: 'Cartagena', text: 'La tela es muy buena y no le marcó la piel con el sol. Repito sin duda.' },
  { name: 'Sara M.', city: 'Pereira', text: 'Llegó rápido y pagué al recibir. Los estampados son hermosos.' },
];

export default function BanoVeranoLanding({ product }: { product: Product }) {
  // Infografías de campaña en el orden de product.colors:
  // Stitch · Flores · Helados · Mar · Capibara
  const LANDING_IMAGES = [
    '/landing/bano-verano/bano-1.png',
    '/landing/bano-verano/bano-2.png',
    '/landing/bano-verano/bano-3.png',
    '/landing/bano-verano/bano-4.png',
    '/landing/bano-verano/bano-5.png',
  ];
  const gallery = product.colors.map((c, i) => ({
    color: c,
    src: LANDING_IMAGES[i] ?? product.images[i] ?? product.images[0],
  }));

  // Precio "desde" (talla más pequeña).
  const fromPrice = priceForSize(product, product.sizes[0]).retail;
  const discount = Math.round(((ANCHOR - fromPrice) / ANCHOR) * 100);
  const saving = ANCHOR - fromPrice;

  // Galería deslizable (swipe).
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

  // Precio según la talla elegida (la 208 cuesta distinto por banda de talla).
  const sizePrice = priceForSize(product, size);
  const isWholesale = qty >= product.wholesaleMinQty;
  const unit = isWholesale ? sizePrice.wholesale : sizePrice.retail;
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
      notes: `🏖️ Pedido landing Vacaciones Verano — Ref 208 · Diseño: ${gallery[active]?.color} · Talla: ${size}`,
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

  // Textura de puntos blancos sutil.
  const dots = {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.6px)',
    backgroundSize: '22px 22px',
  };

  // ─── Confirmación ─────────────────────────────────────────────────────
  if (done) {
    const waLink = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      `¡Hola! Acabo de hacer el pedido #${done.orderNumber} del vestido de baño (Ref 208, diseño ${gallery[active]?.color}, talla ${size}). Quiero confirmarlo ☀️`
    );
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#23B5C9] via-[#1E7FB0] to-[#143F73] text-white flex items-center justify-center px-5 py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={dots} />
        <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="relative w-full max-w-md text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl">
            <Check size={42} className="text-[#1E7FB0]" strokeWidth={3} />
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
    <div className="relative min-h-screen bg-[#1E7FB0] text-white overflow-hidden">
      {/* Fondo: océano turquesa → azul profundo + sol */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#27B9CC] via-[#1E84B4] to-[#103864]" />
        <div className="absolute inset-0" style={dots} />
        <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-amber-300/25 blur-[90px]" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-cyan-300/15 blur-[90px]" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(6,30,60,0.45)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md pb-28">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl tracking-wide text-white">Dulce Soñadora</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">Verano</span>
        </div>

        {/* HERO */}
        <section className="px-5 pt-3 text-center">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-amber-200 font-bold mb-3">
            <Sun size={15} className="text-amber-300" /> Vacaciones de verano
          </p>
          <h1 className="font-serif leading-[1.02] mb-3">
            <span className="block text-white/90 text-2xl sm:text-3xl font-light">Vestidos de baño</span>
            <span className="block italic text-5xl sm:text-6xl bg-gradient-to-r from-[#FFE15A] via-[#FFB23F] to-[#FF7A59] bg-clip-text text-transparent">
              para el verano
            </span>
          </h1>
          <p className="text-sm text-white/85 max-w-xs mx-auto mb-5">
            Protección UV, secado rápido y diseños que les encantan. ¡Listas para la piscina, el mar y el sol! 🏖️
          </p>

          {/* Galería deslizable */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="embla rounded-2xl overflow-hidden shadow-2xl shadow-black/30" ref={emblaRef}>
              <div className="embla__container">
                {gallery.map((g, i) => (
                  <div className="embla__slide" key={g.color}>
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={g.src}
                        alt={`Vestido de baño niña — ${g.color}`}
                        fill
                        sizes="360px"
                        priority={i === 0}
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <span className="absolute top-3 left-3 z-10 bg-[#FFD23F] text-[#0E3A63] text-xs font-extrabold px-3 py-1 rounded-full shadow">
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
                    active === i ? 'w-5 bg-amber-300' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hint + diseño */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/70">
            <ChevronLeft size={13} className="text-amber-300" />
            Desliza para ver los {gallery.length} diseños
            <ChevronRight size={13} className="text-amber-300" />
          </p>
          <p className="mt-1 text-sm">
            Diseño: <span className="font-semibold text-amber-200">{gallery[active]?.color}</span>
          </p>

          {/* Miniaturas */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {gallery.map((g, i) => (
              <button
                key={g.color}
                onClick={() => goTo(i)}
                aria-label={g.color}
                className={`relative w-11 h-14 rounded-lg overflow-hidden ring-2 transition ${
                  active === i ? 'ring-amber-300 scale-105' : 'ring-white/25 opacity-75 hover:opacity-100'
                }`}
              >
                <Image src={g.src} alt={g.color} fill sizes="44px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-6 flex items-end justify-center gap-3">
            <span className="text-white/55 line-through text-lg mb-1.5">{formatCOP(ANCHOR)}</span>
            <div className="text-left leading-none">
              <span className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Desde</span>
              <span className="font-serif text-5xl font-bold text-white drop-shadow">{formatCOP(fromPrice)}</span>
            </div>
          </div>
          <p className="mt-2 inline-block rounded-full bg-[#FF7A59] text-white text-xs font-bold px-3 py-1 shadow">
            ¡Ahorras {formatCOP(saving)}! · Precio imperdible
          </p>
          <p className="mt-2 text-xs text-white/70">
            Llevando {product.wholesaleMinQty}+: {formatCOP(priceForSize(product, product.sizes[0]).wholesale)} c/u
          </p>

          {/* CTA principal */}
          <button
            onClick={scrollToForm}
            className="mt-6 w-full rounded-full py-4 text-lg font-extrabold bg-gradient-to-r from-[#FF8A5B] to-[#FF6B3D] text-white shadow-lg shadow-[#FF6B3D]/40 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            <Sun size={20} /> ¡LA QUIERO PARA EL VERANO!
          </button>

          {/* Confianza */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { Icon: Truck, t: 'Envío GRATIS' },
              { Icon: ShieldCheck, t: 'Pago al recibir' },
              { Icon: Sun, t: 'Protección UV' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1 rounded-xl bg-white/12 border border-white/20 py-2.5">
                <Icon size={18} className="text-amber-200" />
                <span className="text-white/90 leading-tight text-center">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Urgencia */}
        <section className="mt-8 mx-5 rounded-2xl bg-[#FF7A59]/20 border border-[#FFB23F]/40 backdrop-blur p-4 text-center">
          <p className="text-sm text-white">
            🔥 <strong>Temporada de vacaciones</strong> · Precios imperdibles · ¡Últimas tallas disponibles!
          </p>
        </section>

        {/* Beneficios */}
        <section className="px-5 py-9">
          <h2 className="font-serif text-2xl text-center mb-1">
            Hechos para <span className="italic text-amber-200">disfrutar el sol</span>
          </h2>
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent mb-6" />
          <div className="grid grid-cols-1 gap-2.5">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-white/12 border border-white/20 px-4 py-3">
                <span className="w-7 h-7 rounded-full bg-amber-300/25 flex items-center justify-center shrink-0">
                  <Check size={15} className="text-amber-200" />
                </span>
                <span className="text-sm text-white/90">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prueba social */}
        <section className="px-5 py-8 border-y border-white/15 bg-white/[0.06]">
          <div className="flex justify-center gap-1 text-amber-300 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-amber-300" />
            ))}
          </div>
          <p className="text-center text-sm text-white/80 mb-6">
            <strong className="text-white">+5.000</strong> niñas felices disfrutando el agua
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/12 border border-white/20 p-4">
                <div className="flex gap-0.5 text-amber-300 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-300" />
                  ))}
                </div>
                <p className="text-sm text-white/90 italic">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-2 text-xs text-amber-200 font-semibold">
                  — {r.name}, {r.city}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULARIO */}
        <section ref={formRef} className="px-5 py-9">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200 font-bold mb-2">Pídelo ahora</p>
          <h2 className="font-serif text-3xl mb-1">
            ¡A disfrutar el <span className="italic text-amber-200">verano</span>! ☀️
          </h2>
          <p className="text-sm text-white/85 mb-5">
            Llena tus datos y se lo llevamos con <strong className="text-white">pago contra entrega</strong>. ¡Envío gratis a toda Colombia!
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
                  className="mt-1 w-full rounded-lg bg-white text-[#103864] px-3 py-2.5 text-sm font-medium"
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
                  className="mt-1 w-full rounded-lg bg-white text-[#103864] px-3 py-2.5 text-sm font-medium"
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

            <input type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg bg-white text-[#103864] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="tel" placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full rounded-lg bg-white text-[#103864] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Ciudad / Municipio" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg bg-white text-[#103864] placeholder-gray-400 px-3 py-3 text-sm" />
            <input type="text" placeholder="Dirección de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg bg-white text-[#103864] placeholder-gray-400 px-3 py-3 text-sm" />

            <div className="flex items-center justify-between rounded-xl bg-white/15 border border-white/25 px-4 py-3">
              <div>
                <p className="text-sm text-white/90">Total a pagar (talla {size})</p>
                {isWholesale && <p className="text-[11px] text-amber-200">¡Precio especial por {qty} unidades!</p>}
              </div>
              <span className="font-serif text-2xl font-bold text-white">{formatCOP(total)}</span>
            </div>

            {error && (
              <p className="text-sm text-white bg-red-500/30 border border-white/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="w-full rounded-full py-4 text-lg font-extrabold bg-gradient-to-r from-[#FF8A5B] to-[#FF6B3D] text-white shadow-lg shadow-[#FF6B3D]/40 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? (<><Loader2 size={20} className="animate-spin" /> Enviando…</>) : (<>🏖️ PEDIR CONTRA ENTREGA</>)}
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

      {/* Botón fijo de compra */}
      {!formInView && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-[#0B2B4D] via-[#0B2B4D]/90 to-transparent">
          <div className="mx-auto max-w-md">
            <button
              onClick={scrollToForm}
              className="w-full rounded-full py-3.5 px-5 font-extrabold bg-gradient-to-r from-[#FF8A5B] to-[#FF6B3D] text-white shadow-lg shadow-black/25 flex items-center justify-between"
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold opacity-80">Vacaciones · -{discount}%</span>
                <span className="text-base">Pedir ahora · desde {formatCOP(fromPrice)}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Sun size={18} /> →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
