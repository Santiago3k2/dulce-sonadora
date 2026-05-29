'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SHOW_DURATION = 1700; // tiempo total visible
const FADE_DURATION = 500;   // tiempo del fade out

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => {
      setFading(true);
      document.body.style.overflow = '';
    }, SHOW_DURATION - FADE_DURATION);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, SHOW_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-hero transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Decorative gold circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold-soft/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-pink-soft/30 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Logo with entrance animation */}
      <div className="relative animate-splash-in">
        <Image
          src="/logo.png"
          alt="Dulce Soñadora"
          width={320}
          height={213}
          priority
          className="w-64 md:w-80 h-auto drop-shadow-xl select-none"
        />
        {/* Subtle shimmer underneath */}
        <div className="mt-2 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-pink-deeper to-transparent animate-pulse" />
      </div>
    </div>
  );
}
