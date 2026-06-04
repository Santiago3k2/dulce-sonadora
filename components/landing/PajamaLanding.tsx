'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  CreditCard,
  Lock,
  CheckCircle2,
  ChevronDown,
  Clock,
  Award,
  Gift,
  Instagram,
  Facebook,
  MessageCircle,
  Music2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Product } from '@/lib/data/products';
import { imageForColor } from '@/lib/data/colors';
import { formatCOP, WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import { AnimatedDock } from '@/components/ui/animated-dock';

/* ============================================================
   HOOK — reveal on scroll
   ============================================================ */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================================================
   MINI HEADER (logo simple + volver) — solo para landing aislada
   ============================================================ */
function MiniHeader({ product }: { product: Product }) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-soft/40">
      <div className="container mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-pink-deeper transition">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Volver a la tienda</span>
        </Link>
        <div className="font-serif italic text-lg text-pink-deeper">
          Dulce Soñadora
        </div>
        <a
          href={buildWhatsAppLink(
            WHATSAPP_NUMBER,
            `Hola! Quiero más información sobre ${product.name}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-pink-deeper font-semibold hover:text-pink-vivid transition"
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">Chat</span>
        </a>
      </div>
    </header>
  );
}

/* ============================================================
   ANNOUNCEMENT BAR (marquee top)
   ============================================================ */
function AnnouncementBar() {
  const msgs = [
    '🎁 Envío GRATIS en compras superiores a $150.000',
    '💖 6 unidades = precio MAYORISTA (hasta 50% OFF)',
    '✨ Pagos seguros con ePayco · Wompi · Nequi · PSE',
    '📦 Entrega en 24–72h a toda Colombia',
    '🌙 Dulce Soñadora — el encanto de soñar',
  ];
  const repeated = [...msgs, ...msgs, ...msgs];
  return (
    <div className="relative bg-gradient-to-r from-pink-deeper via-pink-vivid to-pink-deeper text-white py-2.5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee gap-12 text-xs sm:text-sm font-medium">
        {repeated.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            {m}
            <span className="opacity-60">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HERO con parallax + blobs + tarjeta flotante
   ============================================================ */
function Hero({ product }: { product: Product }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 80]);
  const y2 = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-10 md:pt-16 pb-20 md:pb-28">
      <div className="pointer-events-none absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full bg-pink-soft/70 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-24 w-[380px] h-[380px] rounded-full bg-gold-soft/60 blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[320px] h-[320px] rounded-full bg-pink-light/80 blur-3xl animate-blob animation-delay-4000" />

      <div className="relative container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div style={{ y: y2 }} className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-pink-soft/60 shadow-pink-soft">
            <Sparkles size={14} className="text-pink-deeper" />
            <span className="text-xs uppercase tracking-[0.2em] text-pink-deeper font-semibold">
              {product.isNew ? 'Nueva colección' : 'Bestseller'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.05] text-text-dark">
            {product.name.split('—')[0].trim()}{' '}
            <span className="shimmer-text italic">soñar bonito</span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-xl leading-relaxed">
            {product.description} Tela premium, costuras impecables y un fit
            que te abraza. Diseñada para que cada noche sea un pequeño
            ritual de amor propio. 💖
          </p>

          <div className="flex items-end gap-5 pt-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                Hoy desde
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-5xl md:text-6xl font-bold text-gradient-pink">
                  {formatCOP(product.priceWholesale)}
                </span>
                <span className="text-text-muted text-xl line-through">
                  {formatCOP(product.priceRetail)}
                </span>
              </div>
            </div>
            <span className="mb-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-deeper text-white text-xs font-bold animate-soft-pulse">
              -50%
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#comprar" className="btn-gold text-base">
              Comprar ahora <ArrowRight size={18} />
            </a>
            <a href="#producto" className="btn-outline">
              Ver detalles
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-pink-deeper" />
              Pago 100% seguro
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={14} className="text-pink-deeper" />
              Envío en 24–72h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart size={14} className="text-pink-deeper" />
              +12.000 clientas felices
            </span>
          </div>
        </motion.div>

        <motion.div style={{ y: y1 }} className="relative">
          <div className="relative aspect-[4/5] max-w-[520px] mx-auto">
            <div className="absolute -inset-6 rounded-[2.5rem] conic-ring blur-[2px] opacity-70 animate-blob" />
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden tilt shadow-pink">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-4 lg:-left-10 top-10 glass rounded-2xl px-4 py-3 shadow-pink-soft animate-float">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} className="fill-gold-soft text-gold-soft" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-text-dark">4.9</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">+2.380 reseñas</p>
            </div>

            <div className="absolute -right-2 lg:-right-8 bottom-16 glass rounded-2xl px-4 py-3 shadow-pink-soft animate-float">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-pink flex items-center justify-center">
                  <Truck size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-dark">Envío gratis</p>
                  <p className="text-[10px] text-text-muted">Desde $150.000</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-checkout flex items-center gap-3">
              <Gift size={18} className="text-pink-deeper" />
              <span className="text-xs font-semibold text-text-dark whitespace-nowrap">
                Compra <span className="text-pink-deeper">6 unidades</span> y paga mitad
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   TRUST STRIP — marquee
   ============================================================ */
function TrustStrip() {
  const items = [
    { icon: Truck, label: 'Envío a toda Colombia' },
    { icon: ShieldCheck, label: 'Pago 100% seguro' },
    { icon: Award, label: 'Calidad garantizada' },
    { icon: Heart, label: '+12.000 clientas' },
    { icon: Sparkles, label: 'Tela premium' },
    { icon: Gift, label: 'Empaque de regalo' },
    { icon: Star, label: '4.9 / 5 estrellas' },
    { icon: Clock, label: 'Despacho en 24h' },
  ];
  const repeated = [...items, ...items];
  return (
    <section className="bg-white py-6 border-y border-gray-line overflow-hidden">
      <div className="flex animate-marquee-fast gap-12 whitespace-nowrap">
        {repeated.map((it, i) => {
          const Icon = it.icon;
          return (
            <span key={i} className="inline-flex items-center gap-2 text-text-muted text-sm font-medium">
              <Icon size={18} className="text-pink-deeper" />
              {it.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   BENEFITS
   ============================================================ */
function Benefits() {
  const ref = useReveal<HTMLDivElement>();
  const items = [
    { icon: Sparkles, title: 'Tela premium', desc: 'Satín y algodón seleccionados. Suaves, frescos y duraderos lavado tras lavado.', color: 'from-pink-soft to-pink-light' },
    { icon: Heart, title: 'Fit que te abraza', desc: 'Patrones diseñados pensando en mujeres reales. Talla S a XL + curvy.', color: 'from-rose-gold to-pink-soft' },
    { icon: ShieldCheck, title: 'Garantía 30 días', desc: '¿No te encantó? Te devolvemos tu dinero sin preguntas. Así de seguros estamos.', color: 'from-gold-soft to-rose-gold' },
    { icon: Gift, title: 'Empaque de regalo', desc: 'Llega en una caja preciosa con un mensaje hecho a mano. Sorprende sin esfuerzo.', color: 'from-pink-light to-gold-soft' },
  ];
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="reveal container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper font-semibold mb-3">
            Por qué Dulce Soñadora
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            Diseñadas para enamorarte
          </h2>
          <p className="text-text-muted mt-6">
            Cada pieza es pensada para que descansar también sea cuidarte.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className="lift bg-white rounded-3xl p-6 border border-gray-line group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${it.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-serif text-xl text-text-dark mb-2">{it.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GALLERY + SELECTOR
   ============================================================ */
function GallerySelector({ product }: { product: Product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="producto" className="bg-white py-20 lg:py-28">
      <div ref={ref} className="reveal container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="space-y-4">
          <div className="relative aspect-[731/1280] rounded-3xl overflow-hidden bg-gray-soft group">
            <Image
              src={product.images[imgIdx] ?? product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-pink-deeper text-white text-[11px] font-bold uppercase tracking-wider">
                Nuevo
              </span>
            )}
            <button aria-label="Favorito" className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-deeper hover:scale-110 transition">
              <Heart size={18} />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${imgIdx === i ? 'border-pink-deeper' : 'border-transparent hover:border-pink-soft'}`}
                >
                  <Image src={src} alt={`${product.name} ${i + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-20">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} className="fill-gold-soft text-gold-soft" />
                ))}
              </div>
              <span className="text-xs text-text-muted">4.9 · 2.380 reseñas</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-text-dark">{product.name}</h2>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-serif text-4xl font-bold text-gradient-pink">{formatCOP(product.priceWholesale)}</span>
              <span className="text-text-muted text-lg line-through">{formatCOP(product.priceRetail)}</span>
              <span className="px-2 py-0.5 rounded-full bg-pink-soft text-pink-deeper text-xs font-bold">-50%</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Precio mayorista desde 6 unidades · O paga al detal {formatCOP(product.priceRetail)}
            </p>
          </div>

          <p className="text-text-muted leading-relaxed">{product.description}</p>

          <div>
            <p className="text-sm font-semibold text-text-dark mb-3">
              Color: <span className="font-normal capitalize">{color}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    const img = imageForColor(product, c);
                    if (img) {
                      const idx = product.images.indexOf(img);
                      if (idx >= 0) setImgIdx(idx);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm capitalize border transition ${color === c ? 'bg-pink-deeper text-white border-pink-deeper' : 'bg-white text-text-dark border-gray-line hover:border-pink-deeper'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-dark mb-3">
              Talla: <span className="font-normal">{size}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 rounded-xl text-sm font-semibold border transition ${size === s ? 'bg-pink-deeper text-white border-pink-deeper shadow-pink-soft' : 'bg-white text-text-dark border-gray-line hover:border-pink-deeper'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-line rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-dark hover:text-pink-deeper" aria-label="Disminuir">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-text-dark hover:text-pink-deeper" aria-label="Aumentar">
                <Plus size={16} />
              </button>
            </div>
            <a href="#comprar" className="btn-primary flex-1 justify-center">
              <ShoppingBag size={18} /> Comprar ahora
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-line">
            <div className="flex items-start gap-2">
              <Truck size={18} className="text-pink-deeper mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-text-dark">Envío 24-72h</p>
                <p className="text-text-muted">Toda Colombia</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} className="text-pink-deeper mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-text-dark">Garantía 30d</p>
                <p className="text-text-muted">Devolución gratis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIOS
   ============================================================ */
function Testimonials() {
  const ref = useReveal<HTMLDivElement>();
  const reviews = [
    { name: 'María José G.', city: 'Bogotá', stars: 5, text: '¡La calidad me sorprendió! El satín es suavísimo y el corte queda hermoso. Ya pedí 3 más para regalar.' },
    { name: 'Laura V.', city: 'Medellín', stars: 5, text: 'Me llegó en 2 días, súper bien empacada. Es la pijama más linda que tengo, parece de tienda gringa.' },
    { name: 'Andrea P.', city: 'Cali', stars: 5, text: 'Compré 6 con mis amigas para una pijamada y nos encantaron. Buen precio mayorista y calidad real.' },
    { name: 'Sofía R.', city: 'Barranquilla', stars: 5, text: 'Atención al cliente increíble por WhatsApp, me asesoraron en talla y quedó perfecta. 100% recomendada.' },
  ];
  return (
    <section className="bg-gradient-hero py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="reveal container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper font-semibold mb-3">
            Lo que dicen nuestras clientas
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            +2.380 reseñas reales
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="lift bg-white rounded-3xl p-6 border border-pink-soft/50">
              <div className="flex mb-3">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-gold-soft text-gold-soft" />
                ))}
              </div>
              <p className="text-sm text-text-dark italic leading-relaxed">"{r.text}"</p>
              <div className="mt-5 pt-4 border-t border-gray-line flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-dark">{r.name}</p>
                  <p className="text-[11px] text-text-muted">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LOOKBOOK
   ============================================================ */
function Lookbook({ product, others }: { product: Product; others: Product[] }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-white py-20 lg:py-28">
      <div ref={ref} className="reveal container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper font-semibold mb-3">
            Lookbook
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            Estilo Dulce Soñadora
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {others.map((p, i) => (
            <Link
              key={p.id}
              href={`/oferta/${p.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-gray-soft ${i === 0 || i === 3 ? 'row-span-2 aspect-[3/5]' : 'aspect-square'}`}
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-sm font-semibold drop-shadow">{p.name}</p>
                <p className="text-pink-light text-xs">{formatCOP(p.priceWholesale)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CHECKOUT CARD
   ============================================================ */
function CheckoutCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const isWholesale = qty >= product.wholesaleMinQty;
  const unit = isWholesale ? product.priceWholesale : product.priceRetail;
  const subtotal = unit * qty;
  const shipping = subtotal >= 150000 ? 0 : 12000;
  const total = subtotal + shipping;
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="comprar" className="relative bg-gradient-to-b from-cream via-white to-cream py-20 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-1/3 w-[420px] h-[420px] rounded-full bg-pink-soft/60 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full bg-gold-soft/40 blur-3xl animate-blob animation-delay-2000" />

      <div ref={ref} className="reveal relative container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper font-semibold mb-3">
            Compra segura
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            Finaliza tu pedido
          </h2>
          <p className="text-text-muted mt-6 max-w-xl mx-auto">
            Pago 100% protegido con ePayco y Wompi. Acepta todas las tarjetas,
            Nequi, Daviplata, PSE y Bancolombia.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-checkout overflow-hidden border border-pink-soft/40">
          <div className="bg-gradient-pink p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-90">Checkout protegido</p>
                  <p className="font-serif text-xl">Dulce Soñadora</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold">
                <ShieldCheck size={14} /> SSL · 256 bits
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-line space-y-5">
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-dark truncate">{product.name}</p>
                  <p className="text-xs text-text-muted capitalize">
                    {product.colors[0]} · Talla {product.sizes[0]}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-text-dark">{formatCOP(unit)}</span>
                    {isWholesale && (
                      <span className="text-[10px] uppercase tracking-wider text-pink-deeper font-bold">
                        Precio mayorista
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-dark mb-2">Cantidad</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-line rounded-full">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-dark hover:text-pink-deeper">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-semibold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-text-dark hover:text-pink-deeper">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => setQty(product.wholesaleMinQty)} className="text-xs text-pink-deeper font-semibold hover:underline">
                    Activar precio mayorista (×{product.wholesaleMinQty})
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-dark mb-3">Métodos de pago disponibles</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {['Visa', 'Master', 'Amex', 'PSE', 'Nequi', 'Daviplata', 'Bancolombia', 'Efecty'].map((m) => (
                    <div key={m} className="h-10 rounded-lg border border-gray-line bg-gray-soft text-[11px] font-semibold text-text-dark flex items-center justify-center">
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código de descuento"
                  className="flex-1 h-11 rounded-full border border-gray-line px-4 text-sm focus:outline-none focus:border-pink-deeper"
                />
                <button className="h-11 px-5 rounded-full bg-text-dark text-white text-sm font-semibold hover:bg-pink-deeper transition">
                  Aplicar
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-gradient-to-br from-cream to-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-semibold text-text-dark">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Envío</span>
                <span className="font-semibold text-text-dark">
                  {shipping === 0 ? <span className="text-pink-deeper">GRATIS</span> : formatCOP(shipping)}
                </span>
              </div>
              {isWholesale && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-soft/40 text-xs text-pink-deeper font-semibold">
                  <CheckCircle2 size={14} /> Precio mayorista activo · ahorras{' '}
                  {formatCOP((product.priceRetail - product.priceWholesale) * qty)}
                </div>
              )}
              <div className="border-t border-gray-line pt-4 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-text-dark">Total</span>
                <span className="font-serif text-3xl font-bold text-gradient-pink">{formatCOP(total)}</span>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="#"
                  data-payment="epayco"
                  className="btn-gold w-full text-base"
                  aria-label="Pagar con ePayco"
                  onClick={(e) => e.preventDefault()}
                >
                  <CreditCard size={18} /> Pagar con ePayco
                </a>
                <a
                  href="#"
                  data-payment="wompi"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-text-dark text-white font-semibold hover:bg-pink-deeper transition"
                  aria-label="Pagar con Wompi"
                  onClick={(e) => e.preventDefault()}
                >
                  <CreditCard size={18} /> Pagar con Wompi
                </a>
                <a
                  href={buildWhatsAppLink(
                    WHATSAPP_NUMBER,
                    `Hola! Quiero comprar ${qty} × ${product.name} (${formatCOP(total)}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-95 transition"
                >
                  <MessageCircle size={18} /> Pagar por WhatsApp
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-text-muted">
                <Lock size={12} />
                Pago cifrado · Tus datos están protegidos
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-80">
          {['ePayco', 'Wompi', 'Visa', 'Mastercard', 'PSE', 'Nequi'].map((l) => (
            <span key={l} className="text-text-muted font-bold text-sm tracking-wider">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const items = [
    { q: '¿Cuánto tarda mi pedido en llegar?', a: 'Entre 24 y 72 horas hábiles en las principales ciudades de Colombia. Para zonas rurales puede tardar de 3 a 5 días.' },
    { q: '¿Puedo cambiar la talla si no me queda?', a: '¡Claro! Tienes 30 días para cambiar tu pijama por otra talla o solicitar tu devolución, sin preguntas.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Tarjetas de crédito y débito, PSE, Nequi, Daviplata, Bancolombia, Efecty y pago contra entrega en ciudades principales.' },
    { q: '¿Cómo activo el precio mayorista?', a: 'Agrega 6 o más unidades de cualquier producto al carrito y automáticamente el precio cambia al mayorista. Ahorras hasta 50%.' },
    { q: '¿La tela es realmente suave?', a: 'Sí. Usamos satín premium, algodón peinado y felpa piel-durazno. Todas las telas pasan controles de calidad antes de coserse.' },
  ];
  const [open, setOpen] = useState<number | null>(0);
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-white py-20 lg:py-28">
      <div ref={ref} className="reveal container mx-auto px-6 lg:px-12 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper font-semibold mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            Resolvemos tus dudas
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-2xl border transition ${isOpen ? 'border-pink-deeper bg-cream shadow-pink-soft' : 'border-gray-line bg-white'}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className="font-semibold text-text-dark">{it.q}</span>
                  <ChevronDown size={20} className={`text-pink-deeper transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{it.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SOCIAL DOCK
   ============================================================ */
function Social() {
  return (
    <section className="relative bg-text-dark py-20 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 left-1/4 w-[420px] h-[420px] rounded-full bg-pink-deeper/40 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[320px] h-[320px] rounded-full bg-pink-vivid/30 blur-3xl animate-blob animation-delay-2000" />

      <div className="relative container mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-light font-semibold mb-3">Síguenos</p>
        <h2 className="font-serif text-4xl md:text-5xl text-white mb-3">
          Únete a la comunidad{' '}
          <span className="shimmer-text italic">Dulce Soñadora</span>
        </h2>
        <p className="text-pink-light/80 max-w-xl mx-auto mb-10">
          Inspiración, sorteos y descuentos exclusivos cada semana.
        </p>
        <AnimatedDock
          items={[
            { link: 'https://instagram.com/dulcesonadora', target: '_blank', label: 'Instagram', Icon: <Instagram size={22} /> },
            { link: 'https://facebook.com/dulcesonadora', target: '_blank', label: 'Facebook', Icon: <Facebook size={22} /> },
            { link: 'https://tiktok.com/@dulcesonadora', target: '_blank', label: 'TikTok', Icon: <Music2 size={22} /> },
            { link: buildWhatsAppLink(WHATSAPP_NUMBER, 'Hola! Quiero más información sobre las pijamas Dulce Soñadora 💖'), target: '_blank', label: 'WhatsApp', Icon: <MessageCircle size={22} /> },
          ]}
        />
      </div>
    </section>
  );
}

/* ============================================================
   STICKY BUY BAR
   ============================================================ */
function StickyBuyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed left-0 right-0 bottom-0 z-40 transition-transform duration-500 safe-bottom ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="mx-auto max-w-5xl m-3 md:m-4">
        <div className="glass rounded-2xl shadow-checkout flex items-center gap-3 p-3 pr-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-dark truncate">{product.name}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-pink-deeper">{formatCOP(product.priceWholesale)}</span>
              <span className="text-text-muted text-[11px] line-through">{formatCOP(product.priceRetail)}</span>
            </div>
          </div>
          <a href="#comprar" className="btn-gold !py-2.5 !px-5 text-sm">Comprar</a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MINI FOOTER (legal mínimo)
   ============================================================ */
function MiniFooter() {
  return (
    <footer className="bg-text-dark text-white/60 py-8 text-center text-xs">
      <div className="container mx-auto px-6">
        <p>© {new Date().getFullYear()} Dulce Soñadora · El encanto de soñar</p>
        <p className="mt-1 text-white/40">Envíos a toda Colombia · Pagos seguros</p>
      </div>
    </footer>
  );
}

/* ============================================================
   EXPORT — landing completa
   ============================================================ */
export default function PajamaLanding({
  product,
  related = [],
}: {
  product: Product;
  related?: Product[];
}) {
  return (
    <>
      <AnnouncementBar />
      <MiniHeader product={product} />
      <Hero product={product} />
      <TrustStrip />
      <Benefits />
      <GallerySelector product={product} />
      <Testimonials />
      <Lookbook product={product} others={related} />
      <CheckoutCard product={product} />
      <FAQ />
      <Social />
      <MiniFooter />
      <StickyBuyBar product={product} />
    </>
  );
}
