'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'dulce-promo-satin-seen';
const DELAY_MS = 2200; // aparece despues del splash + un respiro

// Promoción DEL MES: la cuenta regresiva va al último instante del mes en curso
// (hora Colombia). Se recalcula sola, así el modal no queda vencido como pasó
// con el countdown de fecha fija del Día del Padre.
function endOfMonthCO(): Date {
  const now = new Date();
  // 1° del mes siguiente a las 00:00 en UTC-5 = fin del mes actual en Colombia.
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 5, 0, 0));
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// Fotos de la colección en satín (Ref 039 short · Ref 058 pantalón).
const PHOTOS = [
  {
    src: '/products/ref-039-satin-conjunto-estampados/photo-8.png',
    caption: 'Lila corazones',
    alt: 'Conjunto de short en satín lila con corazones',
  },
  {
    src: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-5.png',
    caption: 'Suave como seda',
    alt: 'Conjunto de pantalón en satín lila estampado',
  },
  {
    src: '/products/ref-039-satin-conjunto-estampados/photo-10.png',
    caption: 'Rosa corazones',
    alt: 'Conjunto de short en satín rosa con corazones negros',
  },
];

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

function timeLeftTo(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
}

export default function PromoModal() {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState<TimeLeft | null>(null);
  const [month, setMonth] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Cuenta regresiva en vivo mientras el modal está abierto.
  useEffect(() => {
    if (!open) return;
    const end = endOfMonthCO();
    setMonth(MONTHS[new Date().getMonth()]);
    setLeft(timeLeftTo(end));
    const id = setInterval(() => setLeft(timeLeftTo(end)), 1000);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-3xl shadow-2xl animate-zoom-in"
      >
        {/* Fondo degradado lila/rosa satinado */}
        <div className="relative bg-gradient-to-br from-[#5B3B6B] via-[#8E6099] to-[#C79BC4] text-white">
          {/* Glows decorativos */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-pink-200/25 blur-3xl" />
            <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="absolute top-1/3 left-1/2 w-72 h-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Cinta promoción del mes */}
          <div className="absolute top-7 -left-12 z-20 w-48 -rotate-45 bg-gradient-to-r from-pink-200 to-fuchsia-300 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B3B6B] shadow-lg shadow-black/30">
            Promo del mes
          </div>

          {/* Botón cerrar */}
          <button
            onClick={close}
            aria-label="Cerrar promoción"
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center transition border border-white/20"
          >
            <X size={20} />
          </button>

          {/* Estrellitas decorativas */}
          <Sparkles className="absolute top-8 right-16 text-pink-100/70 animate-float" size={20} strokeWidth={1.5} />
          <Sparkles className="absolute top-24 left-8 text-pink-100/40" size={14} strokeWidth={1.5} />
          <Sparkles className="absolute bottom-16 right-10 text-pink-100/50" size={16} strokeWidth={1.5} />

          <div className="relative px-5 sm:px-10 pt-12 pb-9 text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/40 bg-white/5 backdrop-blur px-4 py-1.5 mb-4">
              <Sparkles size={15} className="text-pink-100" strokeWidth={2} />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-pink-100 font-semibold">
                Nuevos estampados
              </span>
            </div>

            {/* Título satinado */}
            <h2
              id="promo-title"
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-tight mb-2 bg-gradient-to-r from-pink-100 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
            >
              Colección en Satín
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-7">
              Suave, fresquita y elegante ·{' '}
              <span className="text-pink-100 font-semibold">
                Promoción de {month || 'este mes'}
              </span>
            </p>

            {/* Abanico de fotos estilo polaroid */}
            <div className="flex items-end justify-center mb-8">
              <div className="w-28 sm:w-36 md:w-40 -rotate-[8deg] translate-y-3 -mr-6 sm:-mr-7 z-0 bg-white rounded-lg p-1.5 pb-2 shadow-2xl shadow-black/50 transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-20">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={PHOTOS[0].src}
                    alt={PHOTOS[0].alt}
                    fill
                    sizes="(max-width: 640px) 30vw, 160px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] sm:text-xs font-serif italic text-[#5B3B6B]">
                  {PHOTOS[0].caption}
                </p>
              </div>

              <div className="w-32 sm:w-40 md:w-44 z-10 bg-white rounded-lg p-1.5 pb-2 shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={PHOTOS[1].src}
                    alt={PHOTOS[1].alt}
                    fill
                    sizes="(max-width: 640px) 34vw, 176px"
                    priority
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] sm:text-xs font-serif italic text-[#5B3B6B]">
                  {PHOTOS[1].caption}
                </p>
              </div>

              <div className="w-28 sm:w-36 md:w-40 rotate-[8deg] translate-y-3 -ml-6 sm:-ml-7 z-0 bg-white rounded-lg p-1.5 pb-2 shadow-2xl shadow-black/50 transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-20">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={PHOTOS[2].src}
                    alt={PHOTOS[2].alt}
                    fill
                    sizes="(max-width: 640px) 30vw, 160px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] sm:text-xs font-serif italic text-[#5B3B6B]">
                  {PHOTOS[2].caption}
                </p>
              </div>
            </div>

            {/* Cuenta regresiva */}
            {left && (
              <div className="mb-7">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 mb-2.5">
                  La promo termina en
                </p>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {(
                    [
                      ['Días', left.d],
                      ['Horas', left.h],
                      ['Min', left.m],
                      ['Seg', left.s],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="w-14 sm:w-16 rounded-xl bg-white/10 border border-white/15 backdrop-blur px-1 py-2"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-pink-100 tabular-nums leading-none">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="mt-1 text-[9px] uppercase tracking-widest text-white/60">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/categoria/short-satin"
                onClick={close}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-fuchsia-200 text-[#5B3B6B] hover:scale-105 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-fuchsia-500/30 w-full sm:w-auto justify-center"
              >
                Ver colección en satín →
              </Link>
              <Link
                href="/categoria/pantalon-satin"
                onClick={close}
                className="text-white/70 hover:text-white text-sm underline-offset-4 hover:underline transition px-3 py-2"
              >
                Ver pantalones en satín
              </Link>
            </div>

            {/* Tagline pequeño */}
            <p className="mt-5 text-xs text-white/55">
              Precio mayorista desde 6 unidades · Envío contra entrega a toda Colombia
            </p>
            <p className="mt-1.5 text-xs text-white/45 italic">
              El encanto de soñar · Dulce Soñadora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
