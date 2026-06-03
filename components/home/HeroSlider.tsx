'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCOP } from '@/lib/utils/format';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  priceRetail: number;
  priceWholesale: number;
  cta: string;
  href: string;
}

const slides: Slide[] = [
  {
    title: 'Pijamas Satín',
    subtitle: 'Suaves como un sueño',
    description: '6 pijamas en satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.jpg',
    priceRetail: 98000,
    priceWholesale: 49000,
    cta: 'Comprar',
    href: '/categoria/pantalon-satin',
  },
  {
    title: 'Lencería Sexi',
    subtitle: 'Elegante y femenina',
    description: '6 piezas con encaje',
    image: '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-1.jpg',
    priceRetail: 110000,
    priceWholesale: 55000,
    cta: 'Descubrir',
    href: '/categoria/lenceria-sexi',
  },
  {
    title: 'Pijamas Navideñas',
    subtitle: 'Magia en cada noche',
    description: '6 pijamas de navidad',
    image: '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-1.jpg',
    priceRetail: 72000,
    priceWholesale: 36000,
    cta: 'Comprar',
    href: '/categoria/short-algodon',
  },
  {
    title: 'Conjuntos en Felpa',
    subtitle: 'Suavidad piel durazno',
    description: '6 conjuntos abrigadores',
    image: '/products/ref-401-camiseta-pantalon-felpa-osito-beige-y-avocato-verde/photo-1.jpg',
    priceRetail: 96000,
    priceWholesale: 48000,
    cta: 'Comprar',
    href: '/categoria/batas-piel-durazno',
  },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  const scrollTo = useCallback(
    (i: number) => emblaApi && emblaApi.scrollTo(i),
    [emblaApi]
  );

  const prev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setCount(emblaApi.scrollSnapList().length);
    setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', () => setSelected(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, i) => (
            <div key={i} className="embla__slide">
              <div className="relative w-full min-h-[460px] md:min-h-[560px] lg:min-h-[640px] bg-gradient-hero">
                {/* Image */}
                <div className="absolute inset-0 md:left-1/2 md:right-0">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>

                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-transparent md:via-cream/70 md:to-transparent" />

                {/* Content */}
                <div className="relative container mx-auto h-full min-h-[460px] md:min-h-[560px] lg:min-h-[640px] flex items-center px-6 lg:px-12">
                  <div className="max-w-md md:max-w-xl space-y-4 md:space-y-6">
                    <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-pink-deeper font-semibold">
                      ✨ {s.subtitle}
                    </p>
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-text-dark leading-tight">
                      {s.title}
                    </h1>
                    <div className="space-y-1">
                      <p className="text-sm md:text-base text-text-muted">
                        {s.description} desde
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-text-muted text-lg md:text-xl line-through">
                          {formatCOP(s.priceRetail)}
                        </span>
                        <span className="font-serif text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-vivid to-pink-deeper bg-clip-text text-transparent">
                          {formatCOP(s.priceWholesale)}
                        </span>
                      </div>
                    </div>
                    <Link href={s.href} className="btn-primary inline-flex">
                      {s.cta} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow items-center justify-center text-text-dark hover:text-pink-deeper transition"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow items-center justify-center text-text-dark hover:text-pink-deeper transition"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              selected === i ? 'w-8 bg-pink-deeper' : 'w-2 bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
