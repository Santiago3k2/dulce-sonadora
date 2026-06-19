/** Precio (detal y mayorista) de una talla puntual. */
export interface SizePrice {
  retail: number;
  wholesale: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
  priceRetail: number;
  priceWholesale: number;
  wholesaleMinQty: number;
  colors: string[];
  /** Optional map of color name → image path, so selecting a color shows its photo. */
  colorImages?: Record<string, string>;
  sizes: string[];
  /**
   * Precio por talla (opcional). Si una prenda cuesta distinto según la talla
   * (ej. infantil 2-4-6-8 vs 10-12-14-16), aquí va el precio de cada talla.
   * Si está, manda sobre priceRetail/priceWholesale al elegir esa talla.
   * priceRetail/priceWholesale quedan como precio base ("desde", la talla más
   * económica) para las tarjetas y listados sin talla seleccionada.
   */
  sizePrices?: Record<string, SizePrice>;
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  description: string;
}

/** Precio detal/mayorista de la talla elegida (cae al precio base si no hay). */
export function priceForSize(
  p: Pick<Product, 'priceRetail' | 'priceWholesale' | 'sizePrices'>,
  size: string | null | undefined
): { retail: number; wholesale: number } {
  const sp = size ? p.sizePrices?.[size] : undefined;
  return sp ?? { retail: p.priceRetail, wholesale: p.priceWholesale };
}

// Tallas oficiales (Tabla de Precios 2026 — Confeccionar G&C S.A.S.)
const ADULT = ['S', 'M', 'L', 'XL'];
const ADULT_XXL = ['S', 'M', 'L', 'XL', 'XXL'];
const BATA_XXL = ['M', 'L', 'XL', 'XXL'];
const KIDS = ['2', '4', '6', '8', '10', '12', '14', '16'];
const KIDS_XS = ['2', '4', '6', '8', '10', '12', '14', '16', 'XS'];

// Precios oficiales de los dos Excel 2026:
//   priceWholesale (mayorista, ≥6 und) = "Tabla de Precios" de fábrica.
//   priceRetail   (detal, <6 und)      = "Tabla de Precios AL DETAL".
// Valores EXACTOS del Excel, sin redondear (decisión de Santiago, 11 jun 2026).
// Modelo nuevo (lista de fábrica 2026-06-18): el mayorista y el detal son
// INDEPENDIENTES por talla (ya NO detal = mayorista + $10.000). Las refs con
// dos bandas (XXL o infantil) definen su sizePrices vía OFFICIAL_PRICES.
// Refs sin fila en el Excel llevan un precio estimado alineado a su prenda
// equivalente (marcadas con "estimado" en el comentario).

// Precio infantil por banda de talla del Excel oficial (2-4-6-8 vs 10-12-14-16).
// Recibe el mayorista de cada banda; el detal = +$10.000. SOLO baño infantil
// (204/201-2/207/208/209) conserva este modelo; las demás usan los helpers *2.
const kidsBands = (wLow: number, wHigh: number): Record<string, SizePrice> => {
  const p = (w: number): SizePrice => ({ wholesale: w, retail: w + 10000 });
  return {
    '2': p(wLow), '4': p(wLow), '6': p(wLow), '8': p(wLow),
    '10': p(wHigh), '12': p(wHigh), '14': p(wHigh), '16': p(wHigh),
  };
};

const rawProducts: Product[] = [
  // ══════════ PANTALÓN ALGODÓN ══════════
  {
    id: 'p-006',
    slug: 'tank-be-happy-sage-capri-floral-gris',
    name: 'Ref 006 - PANTALON PIEL DE DURAZNO (SUBLIMADO) CON BLUSA SISA EN PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-1.jpg?v=2',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-2.jpg?v=2',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-3.jpg?v=2',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-4.jpg?v=2',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-5.jpg?v=2',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-6.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 31500,
    wholesaleMinQty: 6,
    colors: [
      'Rosa Follow Heart',
      'Sage Be Happy',
      'Amarillo Sweetness',
      'Durazno Be Real',
      'Blanco Little Sweet',
      'Durazno Milk Shakes',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras con frase y pantalón largo en piel de durazno estampado. Varios diseños: Follow Heart, Be Happy, Sweetness, Be Real, Little Sweet y Milk Shakes.',
  },
  {
    id: 'p-010',
    slug: 'pantalon-copa-unicolor-piel-durazno',
    name: 'Ref 010 - PANTALON PIEL DE DURAZNO UNICOLOR CON BLUSA DE COPA PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-010-pantalon-copa-unicolor-piel-durazno/photo-1.jpg?v=2',
      '/products/ref-010-pantalon-copa-unicolor-piel-durazno/photo-2.jpg?v=2',
      '/products/ref-010-pantalon-copa-unicolor-piel-durazno/photo-3.jpg?v=2',
      '/products/ref-010-pantalon-copa-unicolor-piel-durazno/photo-4.jpg?v=2',
    ],
    priceRetail: 30000,
    priceWholesale: 25900,
    wholesaleMinQty: 6,
    colors: ['Rosa', 'Verde Sage', 'Negro', 'Amarillo'],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Blusa de copa con tiritas ajustables, escote en V con encaje y moñito, más pantalón largo, en suave piel de durazno unicolor. Disponible en rosa, verde sage, negro y amarillo.',
  },
  {
    id: 'p-009',
    slug: 'camiseta-love-rosa-negro-corazones-blanco-leopardo',
    name: 'Ref 009 - PANTALON PIEL DE DURAZNO (SUBLIMADO) CON BLUSA MANGA EN PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-1.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-2.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-3.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-4.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-5.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-6.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-7.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-8.jpg?v=2',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-9.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 31500,
    wholesaleMinQty: 6,
    colors: [
      'Blanco Cute Love',
      'Rosa Honey',
      'Blanco Kiss Leopardo',
      'Azul Marino You Can',
      'Vino Mon Amour',
      'Rosa Love',
      'Durazno Good Times',
      'Rosa Sweet Dreams',
      'Petroleo Corazón',
    ],
    sizes: ADULT_XXL,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Camiseta manga corta con pantalón largo en piel de durazno estampado. 9 diseños: Cute Love, Honey, Kiss leopardo, You Can Do It, Mon Amour, Love, Good Times, Sweet Dreams y corazón a cuadros.',
  },
  {
    id: 'p-023',
    slug: 'cami-rosa-pantalon-panda-morado',
    name: 'Ref 023 - PANTALON PIEL DE DURAZNO (SUBLIMADO) CON BLUSA TIRAS EN PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-1.png?v=2',
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-2.png?v=2',
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-3.png?v=2',
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-4.png?v=2',
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-5.png?v=2',
    ],
    priceRetail: 40283,
    priceWholesale: 30283,
    wholesaleMinQty: 6,
    colors: [
      'Amarillo Milkshakes',
      'Rojo Corazones',
      'Blanco Postres',
      'Palo de Rosa Floral',
      'Sage Flores',
    ],
    sizes: ADULT_XXL,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras y pantalón largo en piel de durazno estampado. Elige tu diseño: milkshakes, corazones, postres, floral o flores.',
  },
  {
    id: 'p-042',
    slug: 'conjunto-good-night-stars-amarillo-verde',
    name: 'Ref 042 - PANTALON PIEL DE DURAZNO (UNICOLOR) CON BLUSA MANGA EN PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-1.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-2.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-3.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-4.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-5.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-6.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-7.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-8.jpg?v=2',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-9.jpg?v=2',
    ],
    priceRetail: 33624,
    priceWholesale: 28400,
    wholesaleMinQty: 6,
    colors: [
      'Azul Acero',
      'Lila',
      'Blanco y Vino',
      'Rosa y Negro',
      'Amarillo',
      'Sage',
      'Rosa',
      'Rosa Palo',
      'Verde Oliva',
      'Verde y Blanco',
    ],
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto de camiseta y pantalón largo en piel de durazno con frase (Sweet Dreams / Good Night / Let\'s Sleep Under the Stars). Disponible en varios colores.',
  },
  {
    id: 'p-044',
    slug: 'camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas',
    name: 'Ref 044 - PANTALON PIEL DE DURAZNO (SUBLIMADO) CON BLUSA MANGA EN PIEL DE DURAZNO UNICOLOR',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-1.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-2.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-3.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-4.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-5.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-6.jpg?v=2',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-7.jpg?v=2',
    ],
    priceRetail: 41263,
    priceWholesale: 31263,
    wholesaleMinQty: 6,
    colors: [
      'Menta Margaritas',
      'Rosa Cítricos',
      'Crema Floral',
      'Rosa Love',
      'Lila Dulces',
      'Crema Corazones',
      'Rosa Milkshake',
      'Menta Pandas',
      'Malva Estrellas',
      'Negro Love',
      'Teal Cuadros',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Camiseta y pantalón largo para dama en piel de durazno estampado. Varios diseños para elegir: margaritas, cítricos, floral, love, dulces, corazones, milkshake, pandas y estrellas.',
  },
  {
    id: 'p-072',
    slug: 'pantalon-camisa-botones-unicolor',
    name: 'Ref 072 - PANTALON TELA GALLETA CON CAMISA DE BOTONES',
    category: 'pantalon-algodon',
    images: [
      '/products/ref-072-pantalon-camisa-botones-unicolor/photo-1.png?v=2',
      '/products/ref-072-pantalon-camisa-botones-unicolor/photo-2.png?v=2',
      '/products/ref-072-pantalon-camisa-botones-unicolor/photo-3.png?v=2',
      '/products/ref-072-pantalon-camisa-botones-unicolor/photo-4.png?v=2',
    ],
    priceRetail: 47202,
    priceWholesale: 37202,
    wholesaleMinQty: 6,
    colors: ['Lila', 'Rosa', 'Sage', 'Blanco'],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de camisa de botones manga corta con cuello sastre y pantalón largo, unicolor en suave tela galleta. Disponible en lila, rosa, verde sage y blanco.',
  },
  {
    id: 'p-401',
    slug: 'pantalon-piel-durazno-blusa-sublimada-osito-avocato',
    name: 'Ref 401 - PANTALON PIEL DE DURAZNO (SUBLIMADO) CON BLUSA MANGA SUBLIMADA EN PIEL DE DURAZNO',
    category: 'pantalon-piel-durazno',
    images: [
      '/products/ref-401-pantalon-piel-durazno-blusa-sublimada-osito-avocato/photo-1.jpg?v=2',
      '/products/ref-401-pantalon-piel-durazno-blusa-sublimada-osito-avocato/photo-2.jpg?v=2',
      '/products/ref-401-pantalon-piel-durazno-blusa-sublimada-osito-avocato/photo-3.jpg?v=2',
      '/products/ref-401-pantalon-piel-durazno-blusa-sublimada-osito-avocato/photo-4.jpg?v=2',
      '/products/ref-401-pantalon-piel-durazno-blusa-sublimada-osito-avocato/photo-5.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 31500,
    wholesaleMinQty: 6,
    colors: [
      'Beige Osito',
      'Rosa Lotso',
      'Rosa Vaquita',
      'Gris Perrito',
      'Verde Avocato',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Pijama en suave piel de durazno: blusa manga corta con estampado sublimado y pantalón largo sublimado a juego. Varios diseños: osito, Lotso, vaquita, perrito y avocato.',
  },
  // ══════════ PANTALÓN SATÍN ══════════
  {
    id: 'p-058',
    slug: 'conjunto-satin-rosa-cerezas',
    name: 'Ref 058 - PANTALON SATIN (SUBLIMADO) CON BLUSA SATIN TIRA (SUBLIMADA)',
    category: 'pantalon-satin',
    images: [
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.png?v=2',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-2.png?v=2',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-3.png?v=2',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-4.png?v=2',
    ],
    priceRetail: 58000,
    priceWholesale: 48500,
    wholesaleMinQty: 6,
    colors: ['Rosa Snoopy', 'Azul Corazones', 'Rosa Floral', 'Blanco Cerezas'],
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto de blusa de tiras y pantalón largo en satín sublimado, suave y fresco. Estampados: Snoopy, corazones azul, floral rosa y cerezas blanco.',
  },

  // ══════════ CAPRI ══════════
  {
    id: 'p-002',
    slug: 'camiseta-capri-estampado',
    name: 'Ref 002 - CAPRI PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE MANGA PIEL DE DURAZNO UNICOLOR',
    category: 'capri-piel-durazno',
    images: [
      '/products/ref-002-camiseta-capri-estampado/photo-1.jpg?v=2',
      '/products/ref-002-camiseta-capri-estampado/photo-2.jpg?v=2',
      '/products/ref-002-camiseta-capri-estampado/photo-3.jpg?v=2',
      '/products/ref-002-camiseta-capri-estampado/photo-4.jpg?v=2',
      '/products/ref-002-camiseta-capri-estampado/photo-5.jpg?v=2',
    ],
    priceRetail: 39577,
    priceWholesale: 29577,
    wholesaleMinQty: 6,
    colors: [
      'Lila Magic',
      'Terracota Heart',
      'Menta Good Vibes',
      'Sage Be Happy',
      'Rosa Donas',
    ],
    sizes: ADULT_XXL,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Camiseta manga corta con frase y capri en piel de durazno estampado floral. Varios diseños: Magic, Follow Heart, Good Vibes, Be Happy y donas.',
  },
  {
    id: 'p-008',
    slug: 'tank-plus-be-happy-verde-sweetness-donut-cuadros-azul',
    name: 'Ref 008 - CAPRI PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE SISA PIEL DE DURAZNO UNICOLOR',
    category: 'capri-piel-durazno',
    images: [
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-1.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-2.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-3.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-4.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-5.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-6.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-7.jpg?v=2',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-8.jpg?v=2',
    ],
    priceRetail: 39577,
    priceWholesale: 29577,
    wholesaleMinQty: 6,
    colors: [
      'Menta Good Vibes',
      'Vino Mon Amour',
      'Blanco Little Sweet',
      'Rosa Follow Heart',
      'Blanco Kiss Leopardo',
      'Durazno Good Times',
      'Amarillo Sweetness',
      'Petroleo Corazón',
    ],
    sizes: ADULT_XXL,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras (sisa) con frase y capri en piel de durazno estampado. 8 diseños para elegir: Good Vibes, Mon Amour, Little Sweet, Follow Heart, Kiss leopardo, Good Times, Sweetness y corazón a cuadros.',
  },
  {
    id: 'p-020',
    slug: 'tank-amarillo-ruffle-capri-donut-azul',
    name: 'Ref 020 - CAPRI PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE TIRAS PIEL DE DURAZNO UNICOLOR',
    category: 'capri-piel-durazno',
    images: [
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-1.jpg?v=2',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-2.jpg?v=2',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-3.png?v=2',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-4.png?v=2',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-5.png?v=2',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-6.png?v=2',
    ],
    priceRetail: 38954,
    priceWholesale: 28954,
    wholesaleMinQty: 6,
    colors: [
      'Amarillo Donas',
      'Rojo Sandías',
      'Palo de Rosa Pandas',
      'Vino Corazones',
      'Sage Floral',
      'Blanco Postres',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras con detalle ruffle y capri en piel de durazno estampado. Elige tu diseño favorito: donas, sandías, pandas, corazones, floral o postres.',
  },
  {
    id: 'p-069',
    slug: 'capri-camisa-botones-estampados',
    name: 'Ref 069 - CAPRI FRANELA CAMISA DE BOTONES',
    category: 'capri-algodon',
    images: [
      '/products/ref-069-capri-camisa-botones-estampados/photo-1.png?v=2',
      '/products/ref-069-capri-camisa-botones-estampados/photo-2.png?v=2',
      '/products/ref-069-capri-camisa-botones-estampados/photo-3.png?v=2',
      '/products/ref-069-capri-camisa-botones-estampados/photo-4.png?v=2',
      '/products/ref-069-capri-camisa-botones-estampados/photo-5.png?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 29000,
    wholesaleMinQty: 6,
    colors: [
      'Gris Corazones',
      'Crema Paisley',
      'Verde Cachemir',
      'Aqua Flores',
      'Lila Flores',
    ],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de camisa de botones manga corta y capri a juego, estilo clásico abotonado en tela suave tipo franela. Estampados: corazones, paisley, cachemir, flores aqua y flores lila.',
  },

  // ══════════ SHORT ALGODÓN ══════════
  {
    id: 'p-004',
    slug: 'camiseta-corazon-leopardo-hello-rosa',
    name: 'Ref 004 - SHORT PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE MANGA PIEL DE DURAZNO UNICOLOR',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-1.jpg?v=2',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-2.jpg?v=2',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-3.jpg?v=2',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-4.jpg?v=2',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-5.jpg?v=2',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-6.jpg?v=2',
    ],
    priceRetail: 36061,
    priceWholesale: 26061,
    wholesaleMinQty: 6,
    colors: [
      'Rosa Hello',
      'Azul Marino You Can',
      'Petroleo Corazón',
      'Blanco Kiss Leopardo',
      'Blanco Cute Love',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Camiseta manga corta con estampado de corazón y short coordinado en piel de durazno. Varios diseños: Hello, You Can Do It, corazón a cuadros, Kiss leopardo y Cute Love.',
  },
  {
    id: 'p-007',
    slug: 'tank-short-estampado',
    name: 'Ref 007 - SHORT PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE TIRAS PIEL DE DURAZNO UNICOLOR',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-007-tank-short/photo-1.jpg?v=2',
      '/products/ref-007-tank-short/photo-2.jpg?v=2',
      '/products/ref-007-tank-short/photo-3.jpg?v=2',
      '/products/ref-007-tank-short/photo-4.jpg?v=2',
    ],
    priceRetail: 35061,
    priceWholesale: 25061,
    wholesaleMinQty: 6,
    colors: ['Blanco Smile', 'Durazno Good Times', 'Rosa Honey', 'Menta Good Vibes'],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras con frase y short estampado en piel de durazno. Elige tu diseño: Smile, Good Times, Honey o Good Vibes.',
  },
  {
    id: 'p-015',
    slug: 'tank-plus-smile-blanco-short-malva-sweetness-amarillo',
    name: 'Ref 015 - SHORT PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE SISA PIEL DE DURAZNO UNICOLOR',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-1.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-2.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-3.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-4.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-5.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-6.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-7.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-8.jpg?v=2',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-9.jpg?v=2',
    ],
    priceRetail: 35061,
    priceWholesale: 25061,
    wholesaleMinQty: 6,
    colors: [
      'Amarillo Sweetness',
      'Vino Mon Amour',
      'Rosa Follow Heart',
      'Blanco Smile',
      'Menta Good Vibes',
      'Durazno Good Times',
      'Rosa Love',
      'Durazno Little Sweet',
      'Durazno Kiss Leopardo',
    ],
    sizes: ADULT_XXL,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras (sisa) con short en piel de durazno estampado. 9 diseños: Sweetness, Mon Amour, Follow Heart, Smile, Good Vibes, Good Times, Love, Little Sweet y Kiss leopardo.',
  },
  {
    id: 'p-035',
    slug: 'cami-rosa-short-frutilla-azul',
    name: 'Ref 035 - SHORT PIEL DE DURAZNO (SUBLIMADO) CON BLUSA DE TIRAS PIEL DE DURAZNO UNICOLOR',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-1.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-2.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-3.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-4.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-5.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-6.jpg?v=2',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-7.jpg?v=2',
    ],
    priceRetail: 33459,
    priceWholesale: 23459,
    wholesaleMinQty: 6,
    colors: [
      'Durazno Fresas',
      'Sage Floral',
      'Blanco Ositos',
      'Cereza Corazones',
      'Durazno Pandas',
      'Amarillo Fresas',
      'Durazno Floral',
    ],
    sizes: ADULT_XXL,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Blusa de tiras y short en piel de durazno estampado. Varios diseños para elegir: fresas, floral, ositos, corazones y pandas.',
  },
  {
    id: 'p-014',
    slug: 'romper-menta-solido-ruffle',
    name: 'Ref 014 - SHORT PIEL DE DURAZNO (UNICOLOR) CON BLUSA PIEL DE DURAZNO UNICOLOR GOLAS',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-014-romper-menta-solido-ruffle/photo-durazno.jpg?v=2',
      '/products/ref-014-romper-menta-solido-ruffle/photo-rojo.jpg?v=2',
      '/products/ref-014-romper-menta-solido-ruffle/photo-amarillo.jpg?v=2',
      '/products/ref-014-romper-menta-solido-ruffle/photo-menta.jpg?v=2',
      '/products/ref-014-romper-menta-solido-ruffle/photo-azul.jpg?v=2',
      '/products/ref-014-romper-menta-solido-ruffle/photo-blanco.jpg?v=2',
    ],
    priceRetail: 25000,
    priceWholesale: 20000,
    wholesaleMinQty: 6,
    colors: ['durazno', 'rojo', 'amarillo', 'menta', 'azul acero', 'blanco'],
    colorImages: {
      durazno: '/products/ref-014-romper-menta-solido-ruffle/photo-durazno.jpg?v=2',
      rojo: '/products/ref-014-romper-menta-solido-ruffle/photo-rojo.jpg?v=2',
      amarillo: '/products/ref-014-romper-menta-solido-ruffle/photo-amarillo.jpg?v=2',
      menta: '/products/ref-014-romper-menta-solido-ruffle/photo-menta.jpg?v=2',
      'azul acero': '/products/ref-014-romper-menta-solido-ruffle/photo-azul.jpg?v=2',
      blanco: '/products/ref-014-romper-menta-solido-ruffle/photo-blanco.jpg?v=2',
    },
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto de short y blusa unicolor en piel de durazno con tiritas ruffle (golas) y moñito delicado. Tela suave y fresca. Disponible en piel de durazno, rojo, amarillo, menta, azul y blanco.',
  },
  {
    id: 'p-402',
    slug: 'cami-blanco-lotso-bear-short-rosa',
    name: 'Ref 402 - CONJUNTO CAMI SHORT ESTAMPADO',
    category: 'short-piel-durazno',
    images: [
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-1.jpg?v=3',
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-2.jpg?v=3',
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-3.jpg?v=3',
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-4.jpg?v=3',
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-5.jpg?v=3',
    ],
    priceRetail: 34000,
    priceWholesale: 24000,
    wholesaleMinQty: 6,
    colors: [
      'Rosa Lotso',
      'Verde Avocato',
      'Beige Osito',
      'Beige Perrito',
      'Rosa Vaquita',
    ],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Cami de tiritas y short con boleros en suave piel de durazno, con tiernos personajes. Varios diseños: Lotso, avocato, osito, perrito y vaquita.',
  },
  {
    id: 'p-nav-1',
    slug: 'navidad-merry-christmas-rojo-verde-papa-noel',
    name: 'Navidad — Merry Christmas Rojo + Verde Papá Noel',
    category: 'navidad',
    images: [
      '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-1.jpg?v=2',
      '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-2.jpg?v=2',
    ],
    priceRetail: 47300,
    priceWholesale: 37300,
    wholesaleMinQty: 6,
    colors: ['rojo', 'verde'],
    sizes: ADULT,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama corta navideña en algodón con estampado Merry Christmas y Papá Noel.',
  },
  {
    id: 'p-nav-2',
    slug: 'navidad-merry-xmas-blanco-azul-marino-renos',
    name: 'Navidad — Merry Xmas Blanco + Azul Marino Renos',
    category: 'navidad',
    images: [
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-1.jpg?v=2',
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-2.jpg?v=2',
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-3.jpg?v=2',
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-4.jpg?v=2',
    ],
    priceRetail: 47300,
    priceWholesale: 37300,
    wholesaleMinQty: 6,
    colors: ['blanco', 'azul marino'],
    sizes: ADULT,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama corta blanca y azul marino con estampado de renos.',
  },
  {
    id: 'p-nav-3',
    slug: 'navidad-merry-christmas-blanco-rojo-santa-carita',
    name: 'Navidad — Merry Christmas Blanco + Rojo Santa Carita',
    category: 'navidad',
    images: [
      '/products/navidad-3-merry-christmas-blanco-rojo-santa-carita/photo-1.jpg?v=2',
      '/products/navidad-3-merry-christmas-blanco-rojo-santa-carita/photo-2.jpg?v=2',
      '/products/navidad-3-merry-christmas-blanco-rojo-santa-carita/photo-3.jpg?v=2',
    ],
    priceRetail: 47300,
    priceWholesale: 37300,
    wholesaleMinQty: 6,
    colors: ['blanco', 'rojo'],
    sizes: ADULT,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama navideña con la carita de Santa Claus en blanco y rojo.',
  },
  {
    id: 'p-nav-4',
    slug: 'navidad-ho-ho-ho-blanco-negro-cuadros',
    name: 'Navidad — Ho Ho Ho Blanco + Negro Cuadros',
    category: 'navidad',
    images: [
      '/products/navidad-4-ho-ho-ho-blanco-negro-cuadros/photo-1.jpg?v=2',
    ],
    priceRetail: 47300,
    priceWholesale: 37300,
    wholesaleMinQty: 6,
    colors: ['blanco', 'negro'],
    sizes: ADULT,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama Ho Ho Ho en blanco con cuadros negros.',
  },

  // ══════════ SHORT SATÍN ══════════
  {
    id: 'p-039',
    slug: 'satin-conjunto-estampados',
    name: 'Ref 039 - SHORT DE SATIN (SUBLIMADO) CON BLUSA DE TIRAS (SUBLIMADO)',
    category: 'short-satin',
    images: [
      '/products/ref-039-satin-conjunto-estampados/photo-1.jpg?v=2',
      '/products/ref-039-satin-conjunto-estampados/photo-2.jpg?v=2',
      '/products/ref-039-satin-conjunto-estampados/photo-3.jpg?v=2',
      '/products/ref-039-satin-conjunto-estampados/photo-4.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 33000,
    wholesaleMinQty: 6,
    colors: [
      'Durazno Snoopy',
      'Durazno Floral',
      'Blanco Cerezas',
      'Durazno Corazones',
      'Negro Minnie',
      'Azul Corazones',
      'Durazno Ositos',
    ],
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto de blusa de tiras y short en satín sublimado con varios estampados: Snoopy, floral, cerezas, corazones, Minnie y ositos.',
  },
  {
    id: 'p-111',
    slug: 'short-satin-unicolor',
    name: 'Ref 111 - SHORT DE SATIN UNICOLOR CON BLUSA DE TIRAS UNICOLOR',
    category: 'short-satin',
    images: [
      '/products/ref-111-short-satin-unicolor/photo-1.jpg?v=2',
      '/products/ref-111-short-satin-unicolor/photo-2.jpg?v=2',
      '/products/ref-111-short-satin-unicolor/photo-3.jpg?v=2',
      '/products/ref-111-short-satin-unicolor/photo-4.jpg?v=2',
      '/products/ref-111-short-satin-unicolor/photo-5.jpg?v=2',
      '/products/ref-111-short-satin-unicolor/photo-6.jpg?v=2',
    ],
    priceRetail: 30000,
    priceWholesale: 22200,
    wholesaleMinQty: 6,
    colors: ['Vino', 'Lila', 'Azul', 'Morado', 'Rosa', 'Rosa Palo'],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de cami de tiras y short en satín unicolor, con moñito delicado. Disponible en vino, lila, azul, morado, rosa y rosa palo.',
  },

  // ══════════ BATA (batas, camisones y slips) ══════════
  {
    id: 'p-201',
    slug: 'camison-maternidad-enterito-bebe-dinosaurios',
    name: 'Ref 201-1 - BATA MATERNA CON CONJUNTO DE BEBE',
    category: 'bata-algodon',
    images: [
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-1.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-2.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-3.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-4.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-5.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-6.jpg?v=2',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-7.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 35000,
    wholesaleMinQty: 6,
    colors: [
      'Beige Gatitos',
      'Menta Dinos',
      'Rosa Dinos',
      'Menta Safari',
      'Menta Arcoíris',
      'Menta Leopardo',
      'Crema California',
      'Verde Elefantes',
      'Rosa Dinosaurios',
      'Verde Safari',
    ],
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Combo bata de maternidad con apertura para lactancia + enterito de bebé a juego. Varios estampados tiernos. El regalo perfecto para baby shower.',
  },
  {
    id: 'p-029',
    slug: 'bata-senorial-botones-estampada',
    name: 'Ref 029 - BATA SENORIAL DE BOTONES ESTAMPADA EN ALGODON',
    category: 'bata-algodon',
    images: [
      '/products/ref-029-bata-senorial-botones-estampada/photo-1.png?v=2',
      '/products/ref-029-bata-senorial-botones-estampada/photo-2.png?v=2',
      '/products/ref-029-bata-senorial-botones-estampada/photo-3.png?v=2',
      '/products/ref-029-bata-senorial-botones-estampada/photo-4.png?v=2',
      '/products/ref-029-bata-senorial-botones-estampada/photo-5.png?v=2',
      '/products/ref-029-bata-senorial-botones-estampada/photo-6.png?v=2',
    ],
    priceRetail: 37000,
    priceWholesale: 30564,
    wholesaleMinQty: 6,
    colors: [
      'Aqua Flores',
      'Blanco Floral Rosa',
      'Gris Floral Lila',
      'Azul Corazones',
      'Beige Paisley',
      'Crema Floral Rosa',
    ],
    sizes: BATA_XXL,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Bata señorial de botones con cuello en V, manga corta, estampada en algodón. Largo a la rodilla, fresca y cómoda para estar en casa. Estampados: flores aqua, floral rosa, floral lila, corazones, paisley y floral crema.',
  },
  {
    id: 'p-013',
    slug: 'camison-satin-unicolor',
    name: 'Ref 013 - BATA EN SATIN UNICOLOR EN TIRAS',
    category: 'bata-satin',
    images: [
      '/products/ref-013-camison-satin-unicolor/photo-1.png?v=2',
      '/products/ref-013-camison-satin-unicolor/photo-2.png?v=2',
      '/products/ref-013-camison-satin-unicolor/photo-3.png?v=2',
      '/products/ref-013-camison-satin-unicolor/photo-4.png?v=2',
      '/products/ref-013-camison-satin-unicolor/photo-5.png?v=2',
    ],
    priceRetail: 28000,
    priceWholesale: 21000,
    wholesaleMinQty: 6,
    colors: ['Vino', 'Lila', 'Azul Rey', 'Malva', 'Rosa'],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Camisón corto en satín unicolor con tiritas ajustables y escote en V, suave y elegante. Disponible en vino, lila, azul rey, malva y rosa.',
  },
  {
    id: 'p-026',
    slug: 'vestido-slip-verde-menta-con-encaje',
    name: 'Ref 026 - BATA EN SATIN UNICOLOR EN TIRAS',
    category: 'bata-satin',
    images: [
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-1.jpg?v=2',
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-2.jpg?v=2',
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-3.jpg?v=2',
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-4.jpg?v=2',
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-5.jpg?v=2',
    ],
    priceRetail: 34000,
    priceWholesale: 24000,
    wholesaleMinQty: 6,
    colors: ['verde menta', 'negro', 'amarillo', 'rosa', 'lila'],
    sizes: ADULT,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Vestido slip con detalle de encaje en el escote, elegante y femenino. Disponible en verde menta, negro, amarillo, rosa y lila.',
  },
  {
    id: 'p-071',
    slug: 'camison-satin-flamencos-corazones-floral',
    name: 'Ref 071 - CAMISON SATIN TIRAS ESTAMPADO',
    category: 'bata-satin',
    images: [
      '/products/ref-071-camison-satin-flamencos-corazones-floral/photo-1.jpg?v=2',
      '/products/ref-071-camison-satin-flamencos-corazones-floral/photo-2.jpg?v=2',
      '/products/ref-071-camison-satin-flamencos-corazones-floral/photo-3.jpg?v=2',
      '/products/ref-071-camison-satin-flamencos-corazones-floral/photo-4.jpg?v=2',
    ],
    priceRetail: 34000,
    priceWholesale: 24000,
    wholesaleMinQty: 6,
    colors: ['Nude Flamencos', 'Lila Corazones', 'Azul Floral', 'Rosa Gatitos'],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Camisón corto en satín con tiritas ajustables y escote en V con encaje. Estampados: flamencos nude, corazones lila, floral azul o gatitos rosa.',
  },
  {
    id: 'p-107',
    slug: 'camison-tiras-paris-frases',
    name: 'Ref 107 - CAMISON TIRAS ESTAMPADO FRASES',
    category: 'bata-piel-durazno',
    images: [
      '/products/ref-107-camison-tiras-paris-frases/photo-1.jpg?v=2',
      '/products/ref-107-camison-tiras-paris-frases/photo-2.jpg?v=2',
      '/products/ref-107-camison-tiras-paris-frases/photo-3.jpg?v=2',
      '/products/ref-107-camison-tiras-paris-frases/photo-4.jpg?v=2',
    ],
    priceRetail: 30000,
    priceWholesale: 20000,
    wholesaleMinQty: 6,
    colors: [
      'Rosa Paris',
      'Aqua Don\'t Overthink',
      'Aqua Be the Change',
      'Lila Dreams Wings',
    ],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Camisón fresco en algodón tipo esqueleto (racerback) con frases estampadas. Diseños: Paris, Don\'t Overthink It, Be the Change y Dreams.',
  },

  // ══════════ HOMBRE ══════════
  {
    id: 'p-065',
    slug: 'bermuda-camisa-cuello-v-manga-franela',
    name: 'Ref 065 - BERMUDA CON CAMISA CUELLO EN V CON MANGA EN FRANELA',
    category: 'hombre',
    images: [
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-1.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-2.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-3.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-4.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-5.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-6.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-7.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-8.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-9.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-10.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-11.jpg?v=2',
      '/products/ref-065-bermuda-camisa-cuello-v-manga-franela/photo-12.jpg?v=2',
    ],
    priceRetail: 40000,
    priceWholesale: 33000,
    wholesaleMinQty: 6,
    colors: [
      'Azul Marino Puntos Rojo',
      'Gris Anclas Azul Marino',
      'Verde Oliva Puntos',
      'Azul Marino Puntos Gris',
      'Azul Marino Diamantes',
      'Negro Puntos',
      'Vino',
    ],
    sizes: ADULT,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de bermuda y camiseta cuello en V con bolsillo en el pecho, en franela suave. 7 combinaciones de colores y estampados.',
  },

  // ══════════ NIÑO ══════════
  {
    id: 'p-049',
    slug: 'nino-superheroes-captain-america-spiderman',
    name: 'Ref 049 - PANTALON DE NINO PIEL DE DURAZNO (SUBLIMADO) CAMISA UNICOLOR EN PIEL DE DURAZNO',
    category: 'nino-pijama',
    images: [
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-1.jpg?v=2',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-2.jpg?v=2',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-3.jpg?v=2',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-4.jpg?v=2',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-5.jpg?v=2',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-6.jpg?v=2',
    ],
    priceRetail: 34412,
    priceWholesale: 24412,
    wholesaleMinQty: 6,
    colors: [
      'Rojo Spider-Man',
      'Naranja Transformers',
      'Azul Capitán América',
      'Azul Dragon Ball',
      'Azul Sonic',
      'Verde Minecraft',
      'Azul Ultimate Spider-Man',
    ],
    sizes: KIDS_XS,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama para niño: camiseta + pantalón largo en piel de durazno con sus personajes favoritos. Spider-Man, Transformers, Capitán América, Dragon Ball, Sonic y Minecraft.',
  },
  {
    id: 'p-060',
    slug: 'nino-minecraft-manga-corta-verde',
    name: 'Ref 060 - SHORT DE NINO PIEL DE DURAZNO (SUBLIMADO) CAMISA UNICOLOR EN PIEL DE DURAZNO',
    category: 'nino-pijama',
    images: [
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-1.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-2.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-3.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-4.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-5.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-6.jpg?v=2',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-7.jpg?v=2',
    ],
    priceRetail: 29144,
    priceWholesale: 19144,
    wholesaleMinQty: 6,
    colors: [
      'Verde Minecraft',
      'Azul Roblox',
      'Multicolor Labubu',
      'Azul Spider-Man',
      'Azul Sonic',
      'Verde Labubu',
    ],
    sizes: KIDS_XS,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama niño: camiseta + short manga corta en piel de durazno. Varios personajes: Minecraft, Roblox, Labubu, Spider-Man y Sonic.',
  },
  {
    id: 'p-061',
    slug: 'nino-manga-larga-minecraft-verde-sonic-azul',
    name: 'Ref 061 - PANTALON DE NINO PIEL DE DURAZNO (SUBLIMADO) CAMISA MANGA LARGA EN PIEL DE DURAZNO',
    category: 'nino-pijama',
    images: [
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-1.jpg?v=2',
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-2.jpg?v=2',
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-3.jpg?v=2',
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-4.jpg?v=2',
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-5.jpg?v=2',
    ],
    priceRetail: 36848,
    priceWholesale: 26848,
    wholesaleMinQty: 6,
    colors: [
      'Celeste Super Mario',
      'Beige Spider-Man',
      'Naranja Transformers',
      'Azul Marino Capitán América',
      'Azul Dragon Ball',
    ],
    sizes: KIDS_XS,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama niño manga larga + pantalón en piel de durazno, para clima frío. Personajes: Super Mario, Spider-Man, Transformers, Capitán América y Dragon Ball.',
  },

  // ══════════ NIÑA ══════════
  {
    id: 'p-036',
    slug: 'nina-huntyk-crema-short-morado',
    name: 'Ref 036 - SHORT DE NINA GOLAS PIEL DE DURAZNO (SUBLIMADO) CON BLUSA MANGA UNICOLOR PIEL DE DURAZNO',
    category: 'nina-pijama',
    images: [
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-1.jpg?v=2',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-2.jpg?v=2',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-3.jpg?v=2',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-4.jpg?v=2',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-5.jpg?v=2',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-6.jpg?v=2',
    ],
    priceRetail: 30138,
    priceWholesale: 20138,
    wholesaleMinQty: 6,
    colors: [
      'Blanco Huntrix',
      'Fucsia Minnie',
      'Lila Gatito',
      'Menta Osito',
      'Durazno Stitch',
      'Amarillo Hello Kitty',
    ],
    sizes: KIDS,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama para niña: blusa manga corta + short en piel de durazno con personajes. Varios diseños: Huntrix, Minnie, gatito, osito, Stitch y Hello Kitty.',
  },
  {
    id: 'p-037',
    slug: 'nina-minnie-mouse-fucsia-multicolor',
    name: 'Ref 037 - PANTALON DE NINA PIEL DE DURAZNO (SUBLIMADO) CON BLUSA MANGA EN GOLAS UNICOLOR PIEL DE DURAZNO',
    category: 'nina-pijama',
    images: [
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-1.jpg?v=2',
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-2.jpg?v=2',
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-3.jpg?v=2',
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-4.jpg?v=2',
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-5.jpg?v=2',
    ],
    priceRetail: 33513,
    priceWholesale: 23513,
    wholesaleMinQty: 6,
    colors: [
      'Fucsia Minnie',
      'Menta Osito',
      'Lila Gatito',
      'Blanco Huntrix',
      'Rosa Stitch',
    ],
    sizes: KIDS,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama de niña: blusa manga + pantalón largo en piel de durazno con personajes. Varios diseños: Minnie, osito, gatito, Huntrix y Stitch.',
  },

  // ══════════ NUEVOS (jun 2026) — camisón 203 + baño infantil. Precios estimados, pendientes de confirmar ══════════
  {
    id: 'p-203',
    slug: 'camison-unicolor-encaje-tiras',
    name: 'Ref 203 - CAMISON UNICOLOR EN TIRAS CON ENCAJE',
    category: 'bata-piel-durazno',
    images: [
      '/products/ref-203-camison-unicolor-encaje-tiras/photo-1.png?v=2',
      '/products/ref-203-camison-unicolor-encaje-tiras/photo-2.png?v=2',
      '/products/ref-203-camison-unicolor-encaje-tiras/photo-3.png?v=2',
      '/products/ref-203-camison-unicolor-encaje-tiras/photo-4.png?v=2',
      '/products/ref-203-camison-unicolor-encaje-tiras/photo-5.png?v=2',
    ],
    priceRetail: 25000,
    priceWholesale: 20000,
    wholesaleMinQty: 6,
    colors: ['Lila', 'Menta', 'Amarillo', 'Rosa Palo', 'Gris'],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Camisón corto unicolor en tiritas ajustables con escote en V, detalle de encaje y moñito, bordes tipo lechuga. Disponible en lila, menta, amarillo, rosa palo y gris.',
  },
  {
    id: 'p-nino-bano',
    slug: 'nino-bano-conjunto-camiseta-short',
    name: 'Ref 204 - CONJUNTO DE BAÑO NIÑO CAMISETA MANGA LARGA Y SHORT',
    category: 'nino-bano',
    images: [
      '/products/ref-204-nino-bano-conjunto-camiseta-short/photo-1.jpg?v=2',
      '/products/ref-204-nino-bano-conjunto-camiseta-short/photo-2.jpg?v=2',
      '/products/ref-204-nino-bano-conjunto-camiseta-short/photo-3.jpg?v=2',
    ],
    priceRetail: 38500,
    priceWholesale: 28500,
    wholesaleMinQty: 6,
    colors: ['Summer Capybara', 'Aloha Stitch', 'Baby Shark'],
    sizes: KIDS,
    sizePrices: kidsBands(28500, 29400),
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de baño para niño con protección solar: camiseta manga larga + short. Estampados: Summer Capybara, Aloha Stitch y Baby Shark.',
  },
  {
    id: 'p-062',
    slug: 'nina-pijama-manga-larga',
    name: 'Ref 062 - PIJAMA MANGA LARGA NIÑA ESTAMPADA',
    category: 'nina-pijama',
    images: [
      '/products/ref-062-nina-pijama-manga-larga/photo-1.jpg?v=2',
      '/products/ref-062-nina-pijama-manga-larga/photo-2.jpg?v=2',
      '/products/ref-062-nina-pijama-manga-larga/photo-3.jpg?v=2',
      '/products/ref-062-nina-pijama-manga-larga/photo-4.jpg?v=2',
    ],
    priceRetail: 30649,
    priceWholesale: 20649,
    wholesaleMinQty: 6,
    colors: ['Fucsia Sweet Dreams', 'Menta Good Night', 'Rosa Huntrix', 'Amarillo Chicas Superpoderosas'],
    sizes: KIDS,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama para niña: camiseta manga larga + pantalón. Estampados: Sweet Dreams (Stitch Angel), Good Night (vaquita), Huntrix y Chicas Superpoderosas. (Precio estimado — pendiente confirmar.)',
  },
  {
    id: 'p-064',
    slug: 'nina-pijama-manga-corta',
    name: 'Ref 064 - PANTALON DE NIÑA PIEL DE DURAZNO (UNICOLOR) CON CAMISETA MANGA CORTA ESTAMPADA',
    category: 'nina-pijama',
    images: [
      '/products/ref-064-nina-pijama-manga-corta/photo-1.png?v=1',
      '/products/ref-064-nina-pijama-manga-corta/photo-2.png?v=1',
      '/products/ref-064-nina-pijama-manga-corta/photo-3.png?v=1',
      '/products/ref-064-nina-pijama-manga-corta/photo-4.png?v=1',
    ],
    priceRetail: 29595,
    priceWholesale: 19595,
    wholesaleMinQty: 6,
    colors: ['Fucsia Sweet Dreams', 'Menta Good Night', 'Rosa Huntrix', 'Amarillo Chicas Superpoderosas'],
    colorImages: {
      'Fucsia Sweet Dreams': '/products/ref-064-nina-pijama-manga-corta/photo-1.png?v=1',
      'Menta Good Night': '/products/ref-064-nina-pijama-manga-corta/photo-2.png?v=1',
      'Rosa Huntrix': '/products/ref-064-nina-pijama-manga-corta/photo-3.png?v=1',
      'Amarillo Chicas Superpoderosas': '/products/ref-064-nina-pijama-manga-corta/photo-4.png?v=1',
    },
    sizes: KIDS,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama de niña en algodón piel de durazno: camiseta manga corta estampada + pantalón largo unicolor. Estampados: Sweet Dreams (Stitch Angel), Good Night (vaquita), Huntrix y Chicas Superpoderosas.',
  },
  {
    id: 'p-201-2',
    slug: 'nina-bano-enterizo-manga-larga',
    name: 'Ref 201-2 - VESTIDO DE BAÑO ENTERIZO MANGA LARGA NIÑA',
    category: 'nina-bano',
    images: [
      '/products/ref-201-2-nina-bano-enterizo-manga-larga/photo-1.jpg?v=2',
      '/products/ref-201-2-nina-bano-enterizo-manga-larga/photo-2.jpg?v=2',
      '/products/ref-201-2-nina-bano-enterizo-manga-larga/photo-3.jpg?v=2',
      '/products/ref-201-2-nina-bano-enterizo-manga-larga/photo-4.jpg?v=2',
      '/products/ref-201-2-nina-bano-enterizo-manga-larga/photo-5.jpg?v=2',
    ],
    priceRetail: 38800,
    priceWholesale: 28800,
    wholesaleMinQty: 6,
    colors: ['Flores', 'Capibara', 'Stitch', 'Mar', 'Tiburón'],
    sizes: KIDS,
    sizePrices: kidsBands(28800, 30600),
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Vestido de baño enterizo manga larga para niña con protección solar. Estampados: flores, capibara, Stitch, fondo marino y tiburón.',
  },
  {
    id: 'p-207',
    slug: 'nina-bano-enterizo-sisa',
    name: 'Ref 207 - VESTIDO DE BAÑO ENTERIZO SISA NIÑA',
    category: 'nina-bano',
    images: [
      '/products/ref-207-nina-bano-enterizo-sisa/photo-1.jpg?v=2',
      '/products/ref-207-nina-bano-enterizo-sisa/photo-2.jpg?v=2',
      '/products/ref-207-nina-bano-enterizo-sisa/photo-3.jpg?v=2',
      '/products/ref-207-nina-bano-enterizo-sisa/photo-4.jpg?v=2',
      '/products/ref-207-nina-bano-enterizo-sisa/photo-5.jpg?v=2',
      '/products/ref-207-nina-bano-enterizo-sisa/photo-6.jpg?v=2',
    ],
    priceRetail: 32300,
    priceWholesale: 22300,
    wholesaleMinQty: 6,
    colors: ['Frutas', 'Capibara', 'Hello Kitty', 'Stitch', 'Flores', 'Playa'],
    sizes: KIDS,
    sizePrices: kidsBands(22300, 24100),
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Vestido de baño enterizo sisa (sin mangas) para niña. Estampados: frutas, capibara, Hello Kitty, Stitch, flores y playa.',
  },
  {
    id: 'p-208',
    slug: 'nina-bano-enterizo-bolero',
    name: 'Ref 208 - VESTIDO DE BAÑO ENTERIZO BOLERO NIÑA',
    category: 'nina-bano',
    images: [
      '/products/ref-208-nina-bano-enterizo-bolero/photo-1.jpg?v=2',
      '/products/ref-208-nina-bano-enterizo-bolero/photo-2.jpg?v=2',
      '/products/ref-208-nina-bano-enterizo-bolero/photo-3.jpg?v=2',
      '/products/ref-208-nina-bano-enterizo-bolero/photo-4.jpg?v=2',
      '/products/ref-208-nina-bano-enterizo-bolero/photo-5.jpg?v=2',
    ],
    priceRetail: 32300,
    priceWholesale: 22300,
    wholesaleMinQty: 6,
    colors: ['Stitch', 'Flores', 'Helados', 'Mar', 'Capibara'],
    sizes: KIDS,
    sizePrices: kidsBands(22300, 24100),
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Vestido de baño enterizo para niña con boleritos en los hombros. Estampados: Stitch, flores, helados, fondo marino y capibara.',
  },
  {
    id: 'p-209',
    slug: 'nina-bano-conjunto-camiseta-short',
    name: 'Ref 209 - CONJUNTO DE BAÑO NIÑA CAMISETA MANGA LARGA Y SHORT',
    category: 'nina-bano',
    images: [
      '/products/ref-209-nina-bano-conjunto-camiseta-short/photo-1.jpg?v=2',
      '/products/ref-209-nina-bano-conjunto-camiseta-short/photo-2.jpg?v=2',
      '/products/ref-209-nina-bano-conjunto-camiseta-short/photo-3.jpg?v=2',
    ],
    priceRetail: 38500,
    priceWholesale: 28500,
    wholesaleMinQty: 6,
    colors: ['Cute Capy', 'Little Mermaid', 'Stitch'],
    sizes: KIDS,
    sizePrices: kidsBands(28500, 29400),
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de baño para niña: camiseta manga larga + short. Estampados: Cute Capy, Little Mermaid y Stitch.',
  },

  // ══════════ NUEVOS (10 jun 2026) — precios estimados, pendientes de confirmar ══════════
  {
    id: 'p-068',
    slug: 'pijama-cuello-v-encaje-pantalon-floral',
    name: 'Ref 068 - PIJAMA CAMISETA CUELLO V CON ENCAJE Y PANTALON ESTAMPADO',
    category: 'pantalon-algodon',
    images: [
      '/products/ref-068-pijama-cuello-v-encaje-pantalon-floral/photo-1.png?v=2',
    ],
    priceRetail: 45000,
    priceWholesale: 37000,
    wholesaleMinQty: 6,
    colors: ['Lila Floral'],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama de camiseta manga corta con cuello en V, botones y detalle de encaje, con pantalón largo estampado floral. Confeccionada en algodón. (Precio estimado — pendiente confirmar.)',
  },
  {
    id: 'p-046',
    slug: 'camison-manga-corta-frases',
    name: 'Ref 046 - CAMISON MANGA CORTA ESTAMPADO FRASES',
    category: 'bata-piel-durazno',
    images: [
      '/products/ref-046-camison-manga-corta-frases/photo-1.png?v=2',
      '/products/ref-046-camison-manga-corta-frases/photo-2.png?v=2',
      '/products/ref-046-camison-manga-corta-frases/photo-3.png?v=2',
      '/products/ref-046-camison-manga-corta-frases/photo-4.png?v=2',
    ],
    priceRetail: 25000,
    priceWholesale: 20000,
    wholesaleMinQty: 6,
    colors: [
      'Rosa Paris',
      'Azul Don\'t Overthink',
      'Lila Dreams Wings',
      'Aqua Be the Change',
    ],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Camisón fresco manga corta en piel de durazno con frases estampadas. Diseños: Paris, Don\'t Overthink It, Dreams y Be the Change.',
  },
  {
    id: 'p-074',
    slug: 'camisa-botones-short-estampado',
    name: 'Ref 074 - CONJUNTO CAMISA DE BOTONES MANGA CORTA Y SHORT ESTAMPADO',
    category: 'short-algodon',
    images: [
      '/products/ref-074-camisa-botones-short-estampado/photo-1.png?v=3',
    ],
    priceRetail: 42000,
    priceWholesale: 32000,
    wholesaleMinQty: 6,
    colors: ['Rojo Corazones'],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de camisa de botones manga corta con vivos en contraste y short a juego, estampado de corazones. (Precio estimado — pendiente confirmar.)',
  },
  {
    id: 'p-076',
    slug: 'camisa-botones-pantalon-estampado',
    name: 'Ref 076 - CONJUNTO CAMISA DE BOTONES MANGA CORTA Y PANTALON ESTAMPADO',
    category: 'pantalon-algodon',
    images: [
      '/products/ref-076-camisa-botones-pantalon-estampado/photo-1.png?v=3',
    ],
    priceRetail: 47000,
    priceWholesale: 37000,
    wholesaleMinQty: 6,
    colors: ['Rojo Corazones'],
    sizes: ADULT,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de camisa de botones manga corta con vivos en contraste y pantalón largo a juego, estampado de corazones. (Precio estimado — pendiente confirmar.)',
  },
];

// ════════════════════════════════════════════════════════════════════
// PRECIOS OFICIALES POR TALLA (Tabla de Precios 2026).
// El precio depende de la referencia Y la talla: las prendas con dos
// bandas de talla cuestan distinto. Mayorista y detal son INDEPENDIENTES por
// talla (lista de fábrica 2026-06-18; ya no hay regla detal = mayor + $10.000).
// Mapeado por ID de producto (no por número de ref) para evitar las
// colisiones de referencia (201-1/201-2, 026, etc.).
// ════════════════════════════════════════════════════════════════════

/** Precio mayor/detal de una talla puntual (modelo 2026: independientes). */
const szp = (wholesale: number, retail: number): SizePrice => ({ wholesale, retail });

/** Adulto: S-M-L-XL a un precio (mayor/detal) y XXL a otro. */
const adultXXL2 = (
  wReg: number, rReg: number, wXXL: number, rXXL: number
): Record<string, SizePrice> => ({
  S: szp(wReg, rReg), M: szp(wReg, rReg), L: szp(wReg, rReg), XL: szp(wReg, rReg),
  XXL: szp(wXXL, rXXL),
});

/** Infantil: banda 2-4-6-8 vs 10-12-14-16, cada una con su mayor y detal. */
const kidsBands2 = (
  wLow: number, rLow: number, wHigh: number, rHigh: number
): Record<string, SizePrice> => ({
  '2': szp(wLow, rLow), '4': szp(wLow, rLow), '6': szp(wLow, rLow), '8': szp(wLow, rLow),
  '10': szp(wHigh, rHigh), '12': szp(wHigh, rHigh), '14': szp(wHigh, rHigh), '16': szp(wHigh, rHigh),
});

/** Infantil con talla XS además de las dos bandas. */
const kidsBandsXS2 = (
  wLow: number, rLow: number, wHigh: number, rHigh: number, wXS: number, rXS: number
): Record<string, SizePrice> => ({
  ...kidsBands2(wLow, rLow, wHigh, rHigh),
  XS: szp(wXS, rXS),
});

const OFFICIAL_PRICES: Record<string, Record<string, SizePrice>> = {
  // ── Adulto: S-M-L-XL vs XXL (mayor y detal por talla) ──
  'p-006': adultXXL2(31500, 40000, 33500, 42000),
  'p-009': adultXXL2(31500, 40000, 33500, 42000),
  'p-401': adultXXL2(31500, 40000, 33500, 42000),
  'p-023': adultXXL2(29046, 38000, 31046, 40000),
  'p-044': adultXXL2(29993, 38000, 31993, 40000),
  'p-002': adultXXL2(28077, 35000, 29577, 36500),
  'p-008': adultXXL2(28077, 35000, 29577, 36500),
  'p-020': adultXXL2(27400, 33000, 28900, 34500),
  'p-004': adultXXL2(24000, 27000, 26000, 29000),
  'p-007': adultXXL2(22000, 25000, 24000, 26000),
  'p-015': adultXXL2(24000, 27000, 26000, 28000),
  'p-035': adultXXL2(20000, 23000, 22000, 24000),
  // ── Infantil niña: bandas 2-4-6-8 vs 10-12-14-16 ──
  'p-036': kidsBands2(20000, 23000, 21000, 25000),
  'p-037': kidsBands2(23300, 27000, 24600, 30000),
  'p-062': kidsBands2(21000, 25000, 22500, 27000),
  'p-064': kidsBands2(20200, 22000, 22200, 25000),
  // ── Infantil niño: bandas 2-4-6-8 vs 10-12-14-16 + XS ──
  'p-049': kidsBandsXS2(22500, 25000, 23500, 27000, 25300, 30000),
  'p-060': kidsBandsXS2(20000, 23000, 21000, 25000, 23000, 27000),
  'p-061': kidsBandsXS2(23900, 25500, 25600, 27000, 26800, 30000),
};

/**
 * Aplica los precios oficiales por talla: define sizePrices (solo para las
 * tallas que la prenda realmente maneja) y deja el precio base en la banda
 * más barata ("desde", para tarjetas/listados sin talla seleccionada).
 * Las prendas que ya traen sizePrices propio (baño infantil) y no están en
 * la tabla quedan intactas.
 */
function applyOfficialPrices(list: Product[]): Product[] {
  return list.map((p) => {
    const table = OFFICIAL_PRICES[p.id];
    if (!table) return p;
    const sizePrices: Record<string, SizePrice> = {};
    for (const s of p.sizes) if (table[s]) sizePrices[s] = table[s];
    const vals = Object.values(sizePrices);
    if (!vals.length) return p;
    return {
      ...p,
      priceWholesale: Math.min(...vals.map((v) => v.wholesale)),
      priceRetail: Math.min(...vals.map((v) => v.retail)),
      sizePrices,
    };
  });
}

export const products: Product[] = applyOfficialPrices(rawProducts);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getRelatedProducts(productId: string, categorySlug: string, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== productId && p.category === categorySlug)
    .slice(0, limit);
}
