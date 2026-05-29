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
  sizes: string[];
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  description: string;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
const KIDS_SIZES = ['4', '6', '8', '10', '12'];

export const products: Product[] = [
  // ── PIJAMAS SATÍN ESPECIALES ──
  {
    id: 'p-058',
    slug: 'conjunto-satin-rosa-cerezas',
    name: 'Conjunto Satín Rosa Cerezas',
    category: 'short-satin-especial',
    images: [
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-1.jpg',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-2.jpg',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-3.jpg',
      '/products/ref-058-conjunto-satin-rosa-cerezas/photo-4.jpg',
    ],
    priceRetail: 96000,
    priceWholesale: 48000,
    wholesaleMinQty: 6,
    colors: ['rosa', 'cereza'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Conjunto de short y blusa en satín rosa con estampado de cerezas. Suave al tacto, perfecto para las noches románticas.',
  },
  {
    id: 'p-sinref-satin-negro',
    slug: 'satin-negro-mickey-minnie-corazones',
    name: 'Satín Negro Mickey Minnie Corazones',
    category: 'short-satin-clasico',
    images: [
      '/products/sin-ref-satin-negro-mickey-minnie-corazones/photo-1.jpg',
    ],
    priceRetail: 90000,
    priceWholesale: 45000,
    wholesaleMinQty: 6,
    colors: ['negro'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Pijama corta en satín negro con estampado Mickey & Minnie y corazones. Elegancia clásica.',
  },

  // ── LENCERÍA - BABY DOLL ──
  {
    id: 'p-014',
    slug: 'romper-menta-solido-ruffle',
    name: 'Romper Menta Sólido Ruffle',
    category: 'baby-doll',
    images: [
      '/products/ref-014-romper-menta-solido-ruffle/photo-1.jpg',
      '/products/ref-014-romper-menta-solido-ruffle/photo-2.jpg',
    ],
    priceRetail: 84000,
    priceWholesale: 42000,
    wholesaleMinQty: 6,
    colors: ['menta'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Romper en color menta con detalle de ruffle. Diseño femenino y delicado, ideal como baby doll.',
  },

  // ── LENCERÍA SEXI ──
  {
    id: 'p-026',
    slug: 'vestido-slip-verde-menta-con-encaje',
    name: 'Vestido Slip Verde Menta con Encaje',
    category: 'lenceria-sexi',
    images: [
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-1.jpg',
      '/products/ref-026-vestido-slip-verde-menta-con-encaje/photo-2.jpg',
    ],
    priceRetail: 110000,
    priceWholesale: 55000,
    wholesaleMinQty: 6,
    colors: ['verde menta'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Vestido slip en verde menta con detalles de encaje. Elegante, sensual y muy femenino.',
  },

  // ── PIJAMAS NAVIDAD (ALGODÓN) ──
  {
    id: 'p-nav-1',
    slug: 'navidad-merry-christmas-rojo-verde-papa-noel',
    name: 'Navidad — Merry Christmas Rojo + Verde Papá Noel',
    category: 'short-algodon',
    images: [
      '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-1.jpg',
      '/products/navidad-1-merry-christmas-rojo-verde-papa-noel/photo-2.jpg',
    ],
    priceRetail: 72000,
    priceWholesale: 36000,
    wholesaleMinQty: 6,
    colors: ['rojo', 'verde'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Pijama corta navideña en algodón con estampado Merry Christmas y Papá Noel. Ideal para la familia.',
  },
  {
    id: 'p-nav-2',
    slug: 'navidad-merry-xmas-blanco-azul-marino-renos',
    name: 'Navidad — Merry Xmas Blanco + Azul Marino Renos',
    category: 'short-algodon',
    images: [
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-1.jpg',
      '/products/navidad-2-merry-xmas-blanco-azul-marino-renos/photo-2.jpg',
    ],
    priceRetail: 72000,
    priceWholesale: 36000,
    wholesaleMinQty: 6,
    colors: ['blanco', 'azul marino'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Pijama corta blanca y azul marino con estampado de renos. Súper cómoda en algodón.',
  },
  {
    id: 'p-nav-3',
    slug: 'navidad-merry-christmas-blanco-rojo-santa-carita',
    name: 'Navidad — Merry Christmas Blanco + Rojo Santa Carita',
    category: 'short-algodon',
    images: [
      '/products/navidad-3-merry-christmas-blanco-rojo-santa-carita/photo-1.jpg',
      '/products/navidad-3-merry-christmas-blanco-rojo-santa-carita/photo-2.jpg',
    ],
    priceRetail: 72000,
    priceWholesale: 36000,
    wholesaleMinQty: 6,
    colors: ['blanco', 'rojo'],
    sizes: DEFAULT_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama navideña con la carita de Santa Claus en blanco y rojo. Tela suave en algodón.',
  },
  {
    id: 'p-nav-4',
    slug: 'navidad-ho-ho-ho-blanco-negro-cuadros',
    name: 'Navidad — Ho Ho Ho Blanco + Negro Cuadros',
    category: 'short-algodon',
    images: [
      '/products/navidad-4-ho-ho-ho-blanco-negro-cuadros/photo-1.jpg',
    ],
    priceRetail: 72000,
    priceWholesale: 36000,
    wholesaleMinQty: 6,
    colors: ['blanco', 'negro'],
    sizes: DEFAULT_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama Ho Ho Ho en blanco con cuadros negros. Diseño moderno y divertido para la temporada.',
  },

  // ── REFS NORMALES (ALGODÓN) ──
  {
    id: 'p-004',
    slug: 'camiseta-corazon-leopardo-hello-rosa',
    name: 'Ref 004 — Camiseta Corazón Leopardo + Hello Rosa',
    category: 'short-algodon',
    images: [
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-1.jpg',
      '/products/ref-004-camiseta-corazon-leopardo-y-hello-rosa/photo-2.jpg',
    ],
    priceRetail: 68000,
    priceWholesale: 34000,
    wholesaleMinQty: 6,
    colors: ['leopardo', 'rosa'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Camiseta con estampado de corazón leopardo o "Hello" rosa. Algodón fresco y suave.',
  },
  {
    id: 'p-006',
    slug: 'tank-be-happy-sage-capri-floral-gris',
    name: 'Ref 006 — Tank Be Happy Sage + Capri Floral Gris',
    category: 'capri',
    images: [
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-1.jpg',
      '/products/ref-006-tank-be-happy-sage-capri-floral-gris/photo-2.jpg',
    ],
    priceRetail: 78000,
    priceWholesale: 39000,
    wholesaleMinQty: 6,
    colors: ['sage', 'gris'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Tank con frase "Be Happy" combinado con capri en estampado floral gris.',
  },
  {
    id: 'p-008',
    slug: 'tank-plus-be-happy-verde-sweetness-donut-cuadros-azul',
    name: 'Ref 008 — Tank Plus Be Happy / Sweetness / Cuadros',
    category: 'short-algodon',
    images: [
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-1.jpg',
      '/products/ref-008-tank-plus-be-happy-verde-sweetness-donut-cuadros-azul/photo-2.jpg',
    ],
    priceRetail: 70000,
    priceWholesale: 35000,
    wholesaleMinQty: 6,
    colors: ['verde', 'azul'],
    sizes: ['L', 'XL', 'XXL'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Tank plus en varios estampados: Be Happy verde, Sweetness donut, cuadros azul.',
  },
  {
    id: 'p-009',
    slug: 'camiseta-love-rosa-negro-corazones-blanco-leopardo',
    name: 'Ref 009 — Camiseta Love Rosa-Negro / Blanco-Leopardo',
    category: 'short-algodon',
    images: [
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-1.jpg',
      '/products/ref-009-camiseta-love-rosa-negro-corazones-blanco-leopardo/photo-2.jpg',
    ],
    priceRetail: 68000,
    priceWholesale: 34000,
    wholesaleMinQty: 6,
    colors: ['rosa', 'blanco', 'leopardo'],
    sizes: DEFAULT_SIZES,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Camiseta Love con estampado de corazones o leopardo. Estilos múltiples para escoger.',
  },
  {
    id: 'p-015',
    slug: 'tank-plus-smile-blanco-short-malva-sweetness-amarillo',
    name: 'Ref 015 — Tank Plus Smile / Sweetness',
    category: 'short-algodon',
    images: [
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-1.jpg',
      '/products/ref-015-tank-plus-smile-blanco-short-malva-sweetness-amarillo-short-donut/photo-2.jpg',
    ],
    priceRetail: 72000,
    priceWholesale: 36000,
    wholesaleMinQty: 6,
    colors: ['blanco/malva', 'amarillo/donut'],
    sizes: ['L', 'XL', 'XXL'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Tank plus en estampados Smile blanco o Sweetness amarillo, con shorts coordinados.',
  },
  {
    id: 'p-020',
    slug: 'tank-amarillo-ruffle-capri-donut-azul',
    name: 'Ref 020 — Tank Amarillo Ruffle + Capri Donut Azul',
    category: 'capri',
    images: [
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-1.jpg',
      '/products/ref-020-tank-amarillo-ruffle-capri-donut-azul/photo-2.jpg',
    ],
    priceRetail: 78000,
    priceWholesale: 39000,
    wholesaleMinQty: 6,
    colors: ['amarillo', 'azul'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Tank amarillo con detalle ruffle y capri en estampado donut azul. Vibrante y cómodo.',
  },
  {
    id: 'p-023',
    slug: 'cami-rosa-pantalon-panda-morado',
    name: 'Ref 023 — Cami Rosa + Pantalón Panda Morado',
    category: 'pantalon-largo',
    images: [
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-1.jpg',
      '/products/ref-023-cami-rosa-pantalon-panda-morado/photo-2.jpg',
    ],
    priceRetail: 82000,
    priceWholesale: 41000,
    wholesaleMinQty: 6,
    colors: ['rosa/morado'],
    sizes: DEFAULT_SIZES,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Camisola rosa combinada con pantalón largo morado de pandas. Tierna y abrigada.',
  },
  {
    id: 'p-035',
    slug: 'cami-rosa-short-frutilla-azul',
    name: 'Ref 035 — Cami Rosa + Short Frutilla Azul',
    category: 'short-algodon',
    images: [
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-1.jpg',
      '/products/ref-035-cami-rosa-short-frutilla-azul/photo-2.jpg',
    ],
    priceRetail: 68000,
    priceWholesale: 34000,
    wholesaleMinQty: 6,
    colors: ['rosa', 'azul'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Cami rosa con short estampado de frutillas en fondo azul. Combinación primaveral.',
  },
  {
    id: 'p-036',
    slug: 'nina-huntyk-crema-short-morado',
    name: 'Ref 036 — Niña Huntyk Crema + Short Morado',
    category: 'short-algodon',
    images: [
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-1.jpg',
      '/products/ref-036-nina-huntyk-crema-short-morado/photo-2.jpg',
    ],
    priceRetail: 56000,
    priceWholesale: 28000,
    wholesaleMinQty: 6,
    colors: ['crema/morado'],
    sizes: KIDS_SIZES,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijama para niña con cami crema estampada Huntyk y short morado.',
  },
  {
    id: 'p-037',
    slug: 'nina-minnie-mouse-fucsia-multicolor',
    name: 'Ref 037 — Niña Minnie Mouse Fucsia + Multicolor',
    category: 'short-algodon',
    images: [
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-1.jpg',
      '/products/ref-037-nina-minnie-mouse-fucsia-multicolor/photo-2.jpg',
    ],
    priceRetail: 56000,
    priceWholesale: 28000,
    wholesaleMinQty: 6,
    colors: ['fucsia', 'multicolor'],
    sizes: KIDS_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama de niña con la imagen de Minnie Mouse en fucsia y short multicolor.',
  },
  {
    id: 'p-042',
    slug: 'conjunto-good-night-stars-amarillo-verde',
    name: 'Ref 042 — Conjunto Good Night y Stars (Amarillo y Verde)',
    category: 'pantalon-largo',
    images: [
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-1.jpg',
      '/products/ref-042-conjunto-good-night-y-stars-amarillo-y-verde/photo-2.jpg',
    ],
    priceRetail: 84000,
    priceWholesale: 42000,
    wholesaleMinQty: 6,
    colors: ['amarillo', 'verde'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto Good Night y Stars con pantalón largo, dos opciones: amarillo o verde.',
  },
  {
    id: 'p-044',
    slug: 'camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas',
    name: 'Ref 044 — Damas: Lila Candy / Crema Floral / Menta Margaritas',
    category: 'pantalon-largo',
    images: [
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-1.jpg',
      '/products/ref-044-camiseta-pantalon-damas-lila-candy-crema-floral-menta-margaritas/photo-2.jpg',
    ],
    priceRetail: 86000,
    priceWholesale: 43000,
    wholesaleMinQty: 6,
    colors: ['lila', 'crema', 'menta'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Camiseta y pantalón para damas en 3 opciones: Lila Candy, Crema Floral, Menta Margaritas.',
  },
  {
    id: 'p-049',
    slug: 'nino-superheroes-captain-america-spiderman',
    name: 'Ref 049 — Niño Superhéroes (Captain America y Spiderman)',
    category: 'short-algodon',
    images: [
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-1.jpg',
      '/products/ref-049-nino-superheroes-captain-america-y-spiderman/photo-2.jpg',
    ],
    priceRetail: 56000,
    priceWholesale: 28000,
    wholesaleMinQty: 6,
    colors: ['azul', 'rojo'],
    sizes: KIDS_SIZES,
    isFeatured: false,
    isNew: false,
    inStock: true,
    description:
      'Pijamas para niño con superhéroes: Captain America o Spiderman. Algodón resistente.',
  },
  {
    id: 'p-060',
    slug: 'nino-minecraft-manga-corta-verde',
    name: 'Ref 060 — Niño Minecraft Manga Corta Verde',
    category: 'short-algodon',
    images: [
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-1.jpg',
      '/products/ref-060-nino-minecraft-manga-corta-verde/photo-2.jpg',
    ],
    priceRetail: 54000,
    priceWholesale: 27000,
    wholesaleMinQty: 6,
    colors: ['verde'],
    sizes: KIDS_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama niño manga corta verde con estampado Minecraft. Fresco y divertido.',
  },
  {
    id: 'p-061',
    slug: 'nino-manga-larga-minecraft-verde-sonic-azul',
    name: 'Ref 061 — Niño Manga Larga Minecraft / Sonic',
    category: 'pantalon-largo',
    images: [
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-1.jpg',
      '/products/ref-061-nino-manga-larga-minecraft-verde-y-sonic-azul/photo-2.jpg',
    ],
    priceRetail: 62000,
    priceWholesale: 31000,
    wholesaleMinQty: 6,
    colors: ['verde', 'azul'],
    sizes: KIDS_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: true,
    description:
      'Pijama niño manga larga con estampado Minecraft verde o Sonic azul. Para clima frío.',
  },
  {
    id: 'p-201',
    slug: 'camison-maternidad-enterito-bebe-dinosaurios',
    name: 'Ref 201 — Camisón Maternidad + Enterito Bebé Dinosaurios',
    category: 'levantadoras',
    images: [
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-1.jpg',
      '/products/ref-201-camison-maternidad-enterito-bebe-dinosaurios/photo-2.jpg',
    ],
    priceRetail: 105000,
    priceWholesale: 52500,
    wholesaleMinQty: 6,
    colors: ['verde', 'crema'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: true,
    inStock: true,
    description:
      'Combo de camisón de maternidad con apertura para lactancia + enterito de bebé con dinosaurios. Regalo perfecto.',
  },
  {
    id: 'p-401',
    slug: 'camiseta-pantalon-felpa-osito-beige-avocato-verde',
    name: 'Ref 401 — Camiseta + Pantalón Felpa Osito Beige / Avocato Verde',
    category: 'batas-piel-durazno',
    images: [
      '/products/ref-401-camiseta-pantalon-felpa-osito-beige-y-avocato-verde/photo-1.jpg',
      '/products/ref-401-camiseta-pantalon-felpa-osito-beige-y-avocato-verde/photo-2.jpg',
    ],
    priceRetail: 96000,
    priceWholesale: 48000,
    wholesaleMinQty: 6,
    colors: ['beige', 'verde'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Conjunto en felpa suave (estilo piel durazno) con personaje osito beige o avocato verde. Súper abrigador.',
  },
  {
    id: 'p-402',
    slug: 'cami-blanco-lotso-bear-short-rosa',
    name: 'Ref 402 — Cami Blanco Lotso Bear + Short Rosa',
    category: 'short-algodon',
    images: [
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-1.jpg',
      '/products/ref-402-cami-blanco-lotso-bear-short-rosa/photo-2.jpg',
    ],
    priceRetail: 70000,
    priceWholesale: 35000,
    wholesaleMinQty: 6,
    colors: ['blanco', 'rosa'],
    sizes: DEFAULT_SIZES,
    isFeatured: false,
    isNew: true,
    inStock: false,
    description:
      'Cami blanca con Lotso Bear y short rosa. Tierna y fresca para tus noches.',
  },
  {
    id: 'p-sinref-menta',
    slug: 'menta-top-pantalon-cuadros-teal',
    name: 'Sin Ref — Menta Top + Pantalón Cuadros Teal',
    category: 'pantalon-largo',
    images: [
      '/products/sin-ref-menta-top-pantalon-cuadros-teal/photo-1.jpg',
      '/products/sin-ref-menta-top-pantalon-cuadros-teal/photo-2.jpg',
    ],
    priceRetail: 84000,
    priceWholesale: 42000,
    wholesaleMinQty: 6,
    colors: ['menta', 'teal'],
    sizes: DEFAULT_SIZES,
    isFeatured: true,
    isNew: false,
    inStock: true,
    description:
      'Top menta con pantalón largo a cuadros en color teal. Estilo elegante para descansar.',
  },
];

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
