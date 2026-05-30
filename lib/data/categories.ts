export interface Category {
  slug: string;
  name: string;
  group: 'lenceria' | 'pijamas-satin' | 'pijamas-algodon';
  groupLabel: string;
  image: string;
  description?: string;
}

export const categories: Category[] = [
  // LENCERÍA
  {
    slug: 'baby-doll',
    name: 'Baby Doll',
    group: 'lenceria',
    groupLabel: 'Lencería',
    image: '/products/ref-014-romper-menta-solido-ruffle/photo-durazno.jpg',
    description: 'Baby dolls elegantes y románticos en distintos diseños.',
  },
  {
    slug: 'lenceria-sexi',
    name: 'Lencería Sexi',
    group: 'lenceria',
    groupLabel: 'Lencería',
    image: '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-1.jpg',
    description: 'Lencería sensual para ocasiones especiales.',
  },

  // PIJAMAS SATÍN
  {
    slug: 'short-satin-especial',
    name: 'Short Satín Especial',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.jpg',
    description: 'Conjuntos especiales en satín suave con detalles únicos.',
  },
  {
    slug: 'bata-satin',
    name: 'Bata Satín',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-2.jpg',
    description: 'Batas livianas en satín perfectas para el día y la noche.',
  },
  {
    slug: 'cachetero-especial',
    name: 'Cachetero Especial',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/sin-ref-satin-negro-mickey-minnie-corazones/photo-1.jpg',
    description: 'Cacheteros sensuales en satín con encajes.',
  },
  {
    slug: 'levantadoras',
    name: 'Levantadoras',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-1.jpg',
    description: 'Levantadoras cómodas y elegantes para tu descanso.',
  },
  {
    slug: 'pantalon-satin',
    name: 'Pantalón Satín',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-5.jpg',
    description: 'Pantalones largos en satín, frescos y elegantes.',
  },
  {
    slug: 'short-satin-clasico',
    name: 'Short Satín Clásico',
    group: 'pijamas-satin',
    groupLabel: 'Pijamas Satín',
    image: '/products/sin-ref-satin-negro-mickey-minnie-corazones/photo-1.jpg',
    description: 'Shorts clásicos en satín, suaves y resistentes.',
  },

  // PIJAMAS ALGODÓN
  {
    slug: 'short-algodon',
    name: 'Short Algodón',
    group: 'pijamas-algodon',
    groupLabel: 'Pijamas Algodón',
    image: '/products/ref-035-cami-rosa-short-frutilla-azul/photo-1.jpg',
    description: 'Shorts en algodón cómodo, frescos para el verano.',
  },
  {
    slug: 'capri',
    name: 'Capri',
    group: 'pijamas-algodon',
    groupLabel: 'Pijamas Algodón',
    image: '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-1.jpg',
    description: 'Conjuntos con capri en algodón, prácticos y modernos.',
  },
  {
    slug: 'pantalon-largo',
    name: 'Pantalón Largo',
    group: 'pijamas-algodon',
    groupLabel: 'Pijamas Algodón',
    image: '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-1.jpg',
    description: 'Pijamas con pantalón largo en algodón, ideales para clima frío.',
  },
  {
    slug: 'batas-piel-durazno',
    name: 'Batas Piel Durazno',
    group: 'pijamas-algodon',
    groupLabel: 'Pijamas Algodón',
    image: '/products/ref-401-camiseta-pantalon-felpa-osito-beige-y-avocato-verde/photo-1.jpg',
    description: 'Batas en piel durazno, suaves y abrigadas.',
  },
];

export const categoryGroups = [
  {
    key: 'lenceria',
    label: 'Lencería',
    categories: categories.filter((c) => c.group === 'lenceria'),
  },
  {
    key: 'pijamas-satin',
    label: 'Pijamas Satín',
    categories: categories.filter((c) => c.group === 'pijamas-satin'),
  },
  {
    key: 'pijamas-algodon',
    label: 'Pijamas Algodón',
    categories: categories.filter((c) => c.group === 'pijamas-algodon'),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
