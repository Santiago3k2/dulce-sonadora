'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, Check, Loader2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { priceForSize, type Product } from '@/lib/data/products';
import { formatCOP, cn, WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import { createOrder } from '@/app/checkout/actions';
import { CAMPAIGNS, type CampaignKey } from './campaigns';
import { CAMPAIGN_OFFERS } from '@/lib/data/campaignOffers';

function useCountdown(dateStr?: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    if (!dateStr) return;
    const target = new Date(dateStr).getTime();
    const tick = () => {
      const diff = target - Date.now();
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
  }, [dateStr]);
  return left;
}

export default function CampaignLanding({
  product,
  campaign,
}: {
  product: Product;
  campaign: CampaignKey;
}) {
  const cfg = CAMPAIGNS[campaign];
  const t = cfg.theme;

  const gallery = product.colors.map((c, i) => ({
    color: c,
    src: cfg.images[i] ?? product.images[i] ?? product.images[0],
  }));

  // Precio: si el producto varía por talla, mostramos "Desde" la talla más barata.
  // Una campaña puede fijar su propio precio (CAMPAIGN_OFFERS), independiente del
  // catálogo, para conservar el precio con el que salió en los Ads aunque la
  // tienda cambie. createOrder usa el mismo override para cobrar lo mismo.
  const offer = CAMPAIGN_OFFERS[campaign];
  const priceFor = (s: string) =>
    offer ? { retail: offer.retail, wholesale: offer.wholesale } : priceForSize(product, s);
  const perSize = !offer && !!product.sizePrices;
  const heroPrice = priceFor(product.sizes[0]).retail;
  const heroWholesale = priceFor(product.sizes[0]).wholesale;
  const discount = Math.round(((cfg.anchor - heroPrice) / cfg.anchor) * 100);
  const saving = cfg.anchor - heroPrice;

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
    const obs = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const sizePrice = priceFor(size);
  const isWholesale = qty >= product.wholesaleMinQty;
  const unit = isWholesale ? sizePrice.wholesale : sizePrice.retail;
  const total = unit * qty;

  const left = useCountdown(cfg.urgency?.kind === 'countdown' ? cfg.urgency.date : undefined);

  const dots = {
    backgroundImage: `radial-gradient(${t.dotsRGBA} 1px, transparent 1.6px)`,
    backgroundSize: '22px 22px',
  };

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
      notes: `${cfg.notesPrefix} · ${cfg.designLabel}: ${gallery[active]?.color} · Talla: ${size}`,
      items: [{ productId: product.id, color: gallery[active]?.color ?? '', size, quantity: qty }],
      payment_method: 'whatsapp',
      campaign,
    });
    setSubmitting(false);
    if ('ok' in res && res.ok) {
      setDone({ orderNumber: res.orderNumber, total: res.total });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(('error' in res && res.error) || 'No se pudo enviar el pedido. Intenta de nuevo.');
    }
  };

  const EyebrowIcon = cfg.eyebrow.icon;
  const CtaIcon = cfg.ctaIcon;

  // ─── Confirmación ─────────────────────────────────────────────────────
  if (done) {
    const waLink = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      cfg.waConfirm
        .replace('{n}', String(done.orderNumber))
        .replace('{color}', gallery[active]?.color ?? '')
        .replace('{size}', size)
    );
    return (
      <div className={cn('relative min-h-screen text-white flex items-center justify-center px-5 py-16 overflow-hidden', t.confirmGradient)}>
        <div className="pointer-events-none absolute inset-0" style={dots} />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="relative w-full max-w-md text-center">
          <div className={cn('mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl', t.confirmCircle)}>
            <Check size={42} className={t.confirmCheck} strokeWidth={3} />
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
    <div className={cn('relative min-h-screen text-white overflow-hidden', t.rootBg)}>
      {/* Fondo con profundidad */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className={cn('absolute inset-0', t.bgGradient)} />
        <div className="absolute inset-0" style={dots} />
        <div className={t.glow1} />
        <div className={t.glow2} />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md pb-28">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl tracking-wide text-white">Dulce Soñadora</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">Oferta especial</span>
        </div>

        {/* HERO */}
        <section className="px-5 pt-3 text-center">
          <p className={cn('inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold mb-3', t.eyebrowText)}>
            <EyebrowIcon size={15} className={t.accentSoft} /> {cfg.eyebrow.text}
          </p>
          <h1 className="font-serif leading-[1.02] mb-3">
            <span className="block text-white/90 text-2xl sm:text-3xl font-light">{cfg.title.top}</span>
            <span className={cn('block italic text-5xl sm:text-6xl', t.headlineAccent)}>{cfg.title.accent}</span>
          </h1>
          <p className="text-sm text-white/85 max-w-xs mx-auto mb-5">{cfg.subtitle}</p>

          {/* Galería deslizable */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="embla rounded-2xl overflow-hidden shadow-2xl shadow-black/30" ref={emblaRef}>
              <div className="embla__container">
                {gallery.map((g, i) => (
                  <div className="embla__slide" key={g.color}>
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={g.src}
                        alt={`${cfg.title.top} — ${g.color}`}
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

            <span className={cn('absolute top-3 left-3 z-10 text-xs font-extrabold px-3 py-1 rounded-full shadow', t.badge)}>
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
                  className={cn('h-1.5 rounded-full transition-all', active === i ? `w-5 ${t.dotActive}` : 'w-1.5 bg-white/50')}
                />
              ))}
            </div>
          </div>

          {/* Hint + diseño */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/70">
            <ChevronLeft size={13} className={t.accentSoft} />
            Desliza para ver los {gallery.length} {cfg.designLabel === 'Color' ? 'colores' : 'diseños'}
            <ChevronRight size={13} className={t.accentSoft} />
          </p>
          <p className="mt-1 text-sm">
            {cfg.designLabel}: <span className={cn('font-semibold', t.accentSoft)}>{gallery[active]?.color}</span>
          </p>

          {/* Miniaturas */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {gallery.map((g, i) => (
              <button
                key={g.color}
                onClick={() => goTo(i)}
                aria-label={g.color}
                className={cn(
                  'relative w-11 h-14 rounded-lg overflow-hidden ring-2 transition',
                  active === i ? `${t.thumbRing} scale-105` : 'ring-white/25 opacity-75 hover:opacity-100'
                )}
              >
                <Image src={g.src} alt={g.color} fill sizes="44px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-6 flex items-end justify-center gap-3">
            <span className="text-white/55 line-through text-lg mb-1.5">{formatCOP(cfg.anchor)}</span>
            {perSize ? (
              <div className="text-left leading-none">
                <span className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Desde</span>
                <span className={cn('font-serif text-5xl font-bold', t.priceClass)}>{formatCOP(heroPrice)}</span>
              </div>
            ) : (
              <span className={cn('font-serif text-5xl font-bold leading-none', t.priceClass)}>{formatCOP(heroPrice)}</span>
            )}
          </div>
          <p className={cn('mt-2 inline-block rounded-full text-xs font-semibold px-3 py-1', t.saving)}>
            {cfg.savingText.replace('{saving}', formatCOP(saving))}
          </p>
          <p className="mt-2 text-xs text-white/70">
            Llevando {product.wholesaleMinQty}+: {formatCOP(heroWholesale)} c/u
          </p>

          {/* CTA principal */}
          <button
            onClick={scrollToForm}
            className={cn('mt-6 w-full rounded-full py-4 text-lg font-extrabold shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2', t.cta)}
          >
            <CtaIcon size={20} className={cfg.ctaFillIcon ? 'fill-current' : ''} /> {cfg.ctaLabel}
          </button>

          {/* Confianza */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
            {cfg.trust.map(({ icon: Icon, text }) => (
              <div key={text} className={cn('flex flex-col items-center gap-1 rounded-xl py-2.5', t.card)}>
                <Icon size={18} className={t.accentSoft} />
                <span className="text-white/90 leading-tight text-center">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Urgencia */}
        {cfg.urgency?.kind === 'countdown' && left && (
          <section className={cn('mt-8 mx-5 rounded-2xl backdrop-blur p-5 text-center', t.urgencyBox)}>
            <p className={cn('text-[11px] uppercase tracking-[0.25em] mb-3 font-semibold', t.accentSoft)}>
              {cfg.urgency.label}
            </p>
            <div className="flex justify-center gap-2">
              {([['Días', left.d], ['Horas', left.h], ['Min', left.m], ['Seg', left.s]] as const).map(([l, v]) => (
                <div key={l} className="w-16 rounded-xl bg-black/25 border border-white/10 py-2">
                  <div className={cn('text-2xl font-bold tabular-nums leading-none', t.accentSoft)}>
                    {String(v).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-widest text-white/55">{l}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        {cfg.urgency?.kind === 'text' && (
          <section className={cn('mt-8 mx-5 rounded-2xl backdrop-blur p-4 text-center', t.urgencyBox)}>
            <p className="text-sm text-white">{cfg.urgency.text}</p>
          </section>
        )}

        {/* Beneficios */}
        <section className="px-5 py-9">
          <h2 className="font-serif text-2xl text-center mb-1">
            {cfg.benefitsHeading.text} <span className={cn('italic', t.accentSoft)}>{cfg.benefitsHeading.accent}</span>
          </h2>
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-6" />
          <div className="grid grid-cols-1 gap-2.5">
            {cfg.benefits.map((b) => (
              <div key={b} className={cn('flex items-center gap-3 rounded-xl px-4 py-3', t.card)}>
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check size={15} className={t.accentSoft} />
                </span>
                <span className="text-sm text-white/90">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prueba social */}
        <section className="px-5 py-8 border-y border-white/15 bg-white/[0.06]">
          <div className={cn('flex justify-center gap-1 mb-1', t.accentSoft)}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-current" />
            ))}
          </div>
          <p className="text-center text-sm text-white/80 mb-6">
            <strong className="text-white">{cfg.reviewsStrong}</strong> {cfg.reviewsRest}
          </p>
          <div className="space-y-3">
            {cfg.reviews.map((r) => (
              <div key={r.name} className={cn('rounded-2xl p-4', t.card)}>
                <div className={cn('flex gap-0.5 mb-1.5', t.accentSoft)}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm text-white/90 italic">&ldquo;{r.text}&rdquo;</p>
                <p className={cn('mt-2 text-xs font-semibold', t.accentSoft)}>
                  — {r.name}, {r.city}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULARIO */}
        <section ref={formRef} className="px-5 py-9">
          <p className={cn('text-[11px] uppercase tracking-[0.3em] font-bold mb-2', t.accentSoft)}>Pídela ahora</p>
          <h2 className="font-serif text-3xl mb-1">
            {cfg.formTitle.text} <span className={cn('italic', t.accentSoft)}>{cfg.formTitle.accent}</span>
          </h2>
          <p className="text-sm text-white/85 mb-5">{cfg.formIntro}</p>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-white/80">
                {cfg.designLabel}
                <select
                  value={active}
                  onChange={(e) => {
                    const i = Number(e.target.value);
                    setActive(i);
                    goTo(i);
                  }}
                  className={cn('mt-1 w-full rounded-lg bg-white px-3 py-2.5 text-sm font-medium', t.field)}
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
                  className={cn('mt-1 w-full rounded-lg bg-white px-3 py-2.5 text-sm font-medium', t.field)}
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

            <input type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={cn('w-full rounded-lg bg-white placeholder-gray-400 px-3 py-3 text-sm', t.field)} />
            <input type="tel" placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className={cn('w-full rounded-lg bg-white placeholder-gray-400 px-3 py-3 text-sm', t.field)} />
            <input type="text" placeholder="Ciudad / Municipio" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={cn('w-full rounded-lg bg-white placeholder-gray-400 px-3 py-3 text-sm', t.field)} />
            <input type="text" placeholder="Dirección de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={cn('w-full rounded-lg bg-white placeholder-gray-400 px-3 py-3 text-sm', t.field)} />

            <div className={cn('flex items-center justify-between rounded-xl px-4 py-3', t.totalBox)}>
              <div>
                <p className="text-sm text-white/90">{perSize ? `Total a pagar (talla ${size})` : 'Total a pagar'}</p>
                {isWholesale && <p className={cn('text-[11px]', t.accentSoft)}>¡Precio especial por {qty} unidades!</p>}
              </div>
              <span className={cn('font-serif text-2xl font-bold', t.totalValue)}>{formatCOP(total)}</span>
            </div>

            {error && (
              <p className="text-sm text-white bg-red-500/30 border border-white/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={submitting} className={cn('w-full rounded-full py-4 text-lg font-extrabold shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60', t.cta)}>
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

      {/* Botón fijo de compra */}
      {!formInView && (
        <div className={cn('fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t to-transparent', t.sticky)}>
          <div className="mx-auto max-w-md">
            <button
              onClick={scrollToForm}
              className={cn('w-full rounded-full py-3.5 px-5 font-extrabold shadow-lg shadow-black/25 flex items-center justify-between', t.stickyBtn)}
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold opacity-70">Oferta · -{discount}%</span>
                <span className="text-base">Pedir ahora · {perSize ? 'desde ' : ''}{formatCOP(heroPrice)}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <CtaIcon size={18} className={cfg.ctaFillIcon ? 'fill-current' : ''} /> →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
