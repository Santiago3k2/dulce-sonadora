export interface Category {
  slug: string;
  name: string;
  group: 'dama' | 'ninos';
  groupLabel: string;
  image: string;
  description?: string;
}

// Categorías oficiales según la Tabla de Precios 2026 (Confeccionar G&C S.A.S.):
// secciones Pantalón, Capri, Short, Bata, Niño y Niña. Se separan por tela
// (algodón = piel de durazno / franela / felpa, vs. satín) donde aplica.
export const categories: Category[] = [
  // ── DAMA ──
  {
    slug: 'pantalon-algodon',
    name: 'Pantalón Algodón',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-1.jpg',
    description: 'Pijamas de pantalón largo en algodón piel de durazno, franela y felpa.',
  },
  {
    slug: 'pantalon-satin',
    name: 'Pantalón Satín',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.jpg',
    description: 'Pijamas de pantalón largo en satín suave.',
  },
  {
    slug: 'capri',
    name: 'Capri',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-002-camiseta-capri-estampado/photo-1.jpg',
    description: 'Conjuntos con capri, frescos y cómodos.',
  },
  {
    slug: 'short-algodon',
    name: 'Short Algodón',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-035-cami-rosa-short-frutilla-azul/photo-1.jpg',
    description: 'Pijamas de short en algodón piel de durazno.',
  },
  {
    slug: 'short-satin',
    name: 'Short Satín',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-039-satin-conjunto-estampados/photo-1.jpg',
    description: 'Pijamas de short en satín.',
  },
  {
    slug: 'bata',
    name: 'Bata',
    group: 'dama',
    groupLabel: 'Dama',
    image: '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-1.jpg',
    description: 'Batas, camisones y vestidos para descansar.',
  },

  // ── NIÑOS ──
  {
    slug: 'nino',
    name: 'Niño',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-1.jpg',
    description: 'Pijamas para niño con sus personajes favoritos.',
  },
  {
    slug: 'nina',
    name: 'Niña',
    group: 'ninos',
    groupLabel: 'Niños',
    image: '/products/ref-036-nina-huntyk-crema-short-morado/photo-1.jpg',
    description: 'Pijamas para niña con personajes y estampados tiernos.',
  },
];

export const categoryGroups = [
  {
    key: 'dama',
    label: 'Dama',
    categories: categories.filter((c) => c.group === 'dama'),
  },
  {
    key: 'ninos',
    label: 'Niños',
    categories: categories.filter((c) => c.group === 'ninos'),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
