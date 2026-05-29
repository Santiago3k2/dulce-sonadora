'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Gift, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'dulce-promo-fathers-day-seen';
const DELAY_MS = 2200; // aparece despues del splash + un respiro

export default function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

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
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl animate-zoom-in"
      >
        {/* Botón cerrar */}
        <button
          onClick={close}
          aria-label="Cerrar promoción"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center transition border border-white/20"
        >
          <X size={20} />
        </button>

        {/* Fondo degradado azul navy */}
        <div className="relative bg-gradient-to-br from-[#0F2647] via-[#1B3A6B] to-[#2C5BA8] text-white">
          {/* Patrones decorativos */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-2xl" />
          </div>

          {/* Estrellitas decorativas */}
          <Sparkles
            className="absolute top-6 left-8 text-amber-300/70"
            size={20}
            strokeWidth={1.5}
          />
          <Sparkles
            className="absolute bottom-12 left-12 text-amber-300/50"
            size={14}
            strokeWidth={1.5}
          />
          <Sparkles
            className="absolute top-16 right-20 text-amber-300/60"
            size={16}
            strokeWidth={1.5}
          />

          <div className="relative px-6 md:px-12 py-10 md:py-14 text-center">
            {/* Icono regalo */}
            <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30">
              <Gift size={40} className="text-white" strokeWidth={1.8} />
            </div>

            {/* Etiqueta */}
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-amber-300 font-semibold mb-3">
              ✨ Colección de Junio ✨
            </p>

            {/* Título principal */}
            <h2
              id="promo-title"
              className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4"
            >
              Día del Padre
            </h2>

            {/* Decoración */}
            <div className="mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-5" />

            {/* Descripción */}
            <p className="text-base md:text-lg text-white/90 max-w-md mx-auto leading-relaxed mb-2">
              Sorprende a papá con un regalo único 🎁
            </p>
            <p className="text-sm md:text-base text-white/75 max-w-lg mx-auto leading-relaxed mb-7">
              Conjuntos cómodos, elegantes y con
              <span className="text-amber-300 font-semibold"> precio mayorista </span>
              desde 6 unidades. ¡Edición limitada del mes!
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/tienda"
                onClick={close}
                className="inline-flex items-center gap-2 bg-white text-[#0F2647] hover:bg-amber-300 hover:scale-105 px-7 py-3 rounded-full font-semibold transition-all shadow-lg w-full sm:w-auto justify-center"
              >
                Ver colección →
              </Link>
              <button
                onClick={close}
                className="text-white/70 hover:text-white text-sm underline-offset-4 hover:underline transition px-3 py-2"
              >
                Seguir explorando
              </button>
            </div>

            {/* Tagline pequeño */}
            <p className="mt-6 text-xs text-white/60 italic">
              El encanto de soñar · Dulce Soñadora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
