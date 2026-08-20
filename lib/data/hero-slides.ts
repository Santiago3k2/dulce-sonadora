/**
 * Diapositivas del hero del home.
 *
 * Vive fuera de HeroSlider.tsx a propósito: ese componente es 'use client', y
 * los valores exportados desde un módulo de cliente llegan al servidor como
 * referencias, no como datos. El home (server component) necesita leer los
 * slugs de verdad para consultarle los precios a Supabase.
 */

export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** Producto del que sale el precio: así el hero nunca queda desfasado. */
  slug: string;
  cta: string;
  href: string;
}

export interface HeroPrice {
  retail: number;
  wholesale: number;
}

export const heroSlides: HeroSlide[] = [
  {
    title: 'Recién Llegadas',
    subtitle: 'Nuevo ingreso',
    description: 'Camiseta y capri en piel de durazno',
    image: '/products/ref-405-camiseta-manga-corta-capri-estampado/photo-1.jpg',
    slug: 'camiseta-manga-corta-capri-piel-durazno',
    cta: 'Ver la Ref 405',
    href: '/producto/camiseta-manga-corta-capri-piel-durazno',
  },
  {
    title: 'Pijamas Satín',
    subtitle: 'Suaves como un sueño',
    description: 'Conjunto en satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.png?v=2',
    slug: 'conjunto-satin-rosa-cerezas',
    cta: 'Comprar',
    href: '/categoria/pantalon-satin',
  },
  {
    title: 'Capri en Franela',
    subtitle: 'Comodidad con estilo',
    description: 'Conjunto camisa y capri',
    image: '/products/ref-069-capri-camisa-botones-estampados/photo-1.png?v=2',
    slug: 'capri-camisa-botones-estampados',
    cta: 'Comprar',
    href: '/categoria/capri-algodon',
  },
  {
    title: 'Bata en Satín',
    subtitle: 'Elegante y femenina',
    description: 'Batas en satín unicolor y estampadas',
    image: '/products/ref-013-camison-satin-unicolor/photo-1.png?v=2',
    slug: 'camison-satin-unicolor',
    cta: 'Descubrir',
    href: '/categoria/bata-satin',
  },
  {
    title: 'Pijama Piel de Durazno',
    subtitle: 'Suavidad que abraza',
    description: 'Pijamas en piel de durazno',
    image: '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-1.jpg?v=2',
    slug: 'conjunto-good-night-stars-amarillo-verde',
    cta: 'Comprar',
    href: '/categoria/pantalon-piel-durazno',
  },
];

/** Slugs que el home consulta para pasarle los precios al hero. */
export const HERO_SLUGS = heroSlides.map((s) => s.slug);
