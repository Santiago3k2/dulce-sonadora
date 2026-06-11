export interface Category {
  slug: string;
  name: string;
  group: 'pantalon' | 'capri' | 'short' | 'bata' | 'navidad' | 'hombre' | 'ninos';
  groupLabel: string;
  image: string;
  description?: string;
  /** false = existe pero oculta en la tienda (apartado reservado "para un futuro"). */
  isActive?: boolean;
}

export interface CategoryGroup {
  key: string;
  label: string;
  categories: Category[];
}

// Apartados de la tienda: cada prenda (Pantalón, Capri, Short, Bata) se divide
// por TELA — Algodón (incluye franela, felpa y tela galleta), Piel de Durazno
// y Satín — según lo que diga el nombre/descripción del producto. Navidad es
// un apartado independiente. Las subcategorías sin productos aún quedan con
// isActive: false, listas para activarse cuando llegue mercancía.
export const categories: Category[] = [
  // ── PANTALONES ──
  {
    slug: 'pantalon-algodon',
    name: 'Pantalón Algodón',
    group: 'pantalon',
    groupLabel: 'Pantalones',
    image: '/products/ref-072-pantalon-camisa-botones-unicolor/photo-1.png?v=2',
    description: 'Pijamas de pantalón largo en algodón: tela galleta y franela.',
  },
  {
    slug: 'pantalon-piel-durazno',
    name: 'Pantalón Piel de Durazno',
    group: 'pantalon',
    groupLabel: 'Pantalones',
    image: '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-1.jpg?v=2',
    description: 'Pijamas de pantalón largo en suave piel de durazno.',
  },
  {
    slug: 'pantalon-satin',
    name: 'Pantalón Satín',
    group: 'pantalon',
    groupLabel: 'Pantalones',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.png?v=2',
    description: 'Pijamas de pantalón largo en satín suave.',
  },

  // ── CAPRIS ──
  {
    slug: 'capri-algodon',
    name: 'Capri Algodón',
    group: 'capri',
    groupLabel: 'Capris',
    image: '/products/ref-069-capri-camisa-botones-estampados/photo-1.png?v=2',
    description: 'Conjuntos con capri en algodón y franela.',
  },
  {
    slug: 'capri-piel-durazno',
    name: 'Capri Piel de Durazno',
    group: 'capri',
    groupLabel: 'Capris',
    image: '/products/ref-002-camiseta-capri-estampado/photo-1.jpg?v=2',
    description: 'Conjuntos con capri en piel de durazno, frescos y cómodos.',
  },
  {
    slug: 'capri-satin',
    name: 'Capri Satín',
    group: 'capri',
    groupLabel: 'Capris',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.png?v=2',
    description: 'Conjuntos con capri en satín.',
    isActive: false, // aún sin productos — se activa cuando llegue mercancía
  },

  // ── SHORTS ──
  {
    slug: 'short-algodon',
    name: 'Short Algodón',
    group: 'short',
    groupLabel: 'Shorts',
    image: '/products/ref-074-camisa-botones-short-estampado/photo-1.png?v=3',
    description: 'Pijamas de short en algodón.',
  },
  {
    slug: 'short-piel-durazno',
    name: 'Short Piel de Durazno',
    group: 'short',
    groupLabel: 'Shorts',
    image: '/products/ref-035-cami-rosa-short-frutilla-azul/photo-1.jpg?v=2',
    description: 'Pijamas de short en piel de durazno.',
  },
  {
    slug: 'short-satin',
    name: 'Short Satín',
    group: 'short',
    groupLabel: 'Shorts',
    image: '/products/ref-039-satin-conjunto-estampados/photo-1.jpg?v=2',
    description: 'Pijamas de short en satín.',
  },

  // ── BATAS ──
  {
    slug: 'bata-algodon',
    name: 'Bata Algodón',
    group: 'bata',
    groupLabel: 'Batas',
    image: '/products/ref-029-bata-senorial-botones-estampada/photo-1.png?v=2',
    description: 'Batas y camisones en algodón, frescos para descansar.',
  },
  {
    slug: 'bata-piel-durazno',
    name: 'Bata Piel de Durazno',
    group: 'bata',
    groupLabel: 'Batas',
    image: '/products/ref-046-camison-manga-corta-frases/photo-1.png?v=2',
    description: 'Batas y camisones en piel de durazno.',
  },
  {
    slug: 'bata-satin',
    name: 'Bata Satín',
    group: 'bata',
    groupLabel: 'Batas',
    image: '/products/ref-013-camison-satin-unicolor/photo-1.png?v=2',
    description: 'Batas y camisones en satín, elegantes y femeninas.',
  },

  // ── NAVIDAD ──
  {
    slug: 'navidad',
    name: 'Navidad',
    group: 'navidad',
    groupLabel: 'Navidad',
    image: '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-1.jpg?v=2',
    description: 'Pijamas navideñas para recibir diciembre en familia.',
  },

  // ── HOMBRE ──
  {
    slug: 'hombre',
    name: 'Hombre',
    group: 'hombre',
    groupLabel: 'Hombre',
    image: '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-1.jpg?v=2',
    description: 'Pijamas para hombre, cómodos y frescos.',
  },

  // ── NIÑOS (separados por tipo: Pijama vs Vestido de Baño, en niña y niño) ──
  {
    slug: 'nina-pijama',
    name: 'Pijama Niña',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-036-nina-huntyk-crema-short-morado/photo-1.jpg?v=2',
    description: 'Pijamas para niña con personajes y estampados tiernos.',
  },
  {
    slug: 'nina-bano',
    name: 'Vestido de Baño Niña',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-207-nina-bano-enterizo-sisa/photo-1.jpg?v=2',
    description: 'Vestidos de baño para niña con protección solar: enterizos y conjuntos.',
  },
  {
    slug: 'nino-pijama',
    name: 'Pijama Niño',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-1.jpg?v=2',
    description: 'Pijamas para niño con sus personajes favoritos.',
  },
  {
    slug: 'nino-bano',
    name: 'Vestido de Baño Niño',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-204-nino-bano-conjunto-camiseta-short/photo-1.jpg?v=2',
    description: 'Vestidos de baño para niño con protección solar.',
  },
];

export const categoryGroups = ['pantalon', 'capri', 'short', 'bata', 'navidad', 'hombre', 'ninos'].map(
  (key) => {
    const inGroup = categories.filter((c) => c.group === key && c.isActive !== false);
    return { key, label: inGroup[0]?.groupLabel ?? key, categories: inGroup };
  }
);

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
