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
    description: 'Conjunto en satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.png',
    priceRetail: 59000,
    priceWholesale: 49000,
    cta: 'Comprar',
    href: '/categoria/pantalon-satin',
  },
  {
    title: 'Capri en Franela',
    subtitle: 'Comodidad con estilo',
    description: 'Conjunto camisa y capri',
    image: '/products/ref-069-capri-camisa-botones-estampados/photo-1.png',
    priceRetail: 47000,
    priceWholesale: 37000,
    cta: 'Comprar',
    href: '/categoria/capri',
  },
  {
    title: 'Camisones Satín',
    subtitle: 'Elegante y femenina',
    description: 'Camisones y batas',
    image: '/products/ref-013-camison-satin-unicolor/photo-1.png',
    priceRetail: 34000,
    priceWholesale: 24000,
    cta: 'Descubrir',
    href: '/categoria/bata',
  },
  {
    title: 'Conjuntos en Felpa',
    subtitle: 'Abrigo suave y tierno',
    description: 'Conjuntos en felpa',
    image: '/products/ref-401-camiseta-pantalon-felpa-osito-beige-y-avocato-verde/photo-1.jpg',
    priceRetail: 47000,
    priceWholesale: 37000,
    cta: 'Comprar',
    href: '/categoria/pantalon-algodon',
  },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
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
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, i) => (
            <div key={i} className="embla__slide">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 items-center gap-2 md:gap-8 min-h-[600px] md:min-h-[600px] lg:min-h-[660px] pb-14 md:pb-0">
                  {/* Texto */}
                  <div className="order-2 md:order-1 text-center md:text-left space-y-4 md:space-y-5">
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
                      <div className="flex items-baseline gap-3 justify-center md:justify-start">
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

                  {/* Imagen completa (object-contain: nunca recorta la modelo) */}
                  <div className="order-1 md:order-2 relative w-full h-[360px] sm:h-[440px] md:h-[600px]">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                      quality={90}
                      className="object-contain object-bottom md:object-center drop-shadow-sm"
                    />
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
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              selected === i ? 'w-8 bg-pink-deeper' : 'w-2 bg-pink-deeper/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
