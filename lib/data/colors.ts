import type { Product } from './products';

/**
 * Único mapa de colores del catálogo (fuente de verdad).
 * Si agregas una referencia con un color nuevo, añádelo aquí una sola vez
 * y el círculo se verá correcto en toda la tienda.
 */
export const COLOR_HEX_MAP: Record<string, string> = {
  rosa: '#F9C5D1',
  durazno: '#F4A9A0',
  rojo: '#D43F4F',
  blanco: '#FFFFFF',
  negro: '#111111',
  azul: '#2F4B8B',
  'azul acero': '#7E97AD',
  'azul marino': '#1B2C4E',
  verde: '#5BA86C',
  'verde menta': '#9FD8B5',
  menta: '#A8E0C4',
  amarillo: '#F6D858',
  morado: '#8E5BA8',
  lila: '#C9A8D8',
  crema: '#F1E4D0',
  cereza: '#B5253A',
  vino: '#7A2233',
  beige: '#D6BFA1',
  fucsia: '#D9388E',
  sage: '#B5C5A8',
  gris: '#9C9C9C',
  petroleo: '#2E6E78',
  terracota: '#C66B3D',
  leopardo:
    'repeating-linear-gradient(45deg,#D9A86A 0 6px,#7A4E20 6px 8px,#D9A86A 8px 14px)',
  multicolor: 'linear-gradient(90deg,#F9C5D1,#F6D858,#9FD8B5,#8E5BA8)',
  teal: '#3F8896',
  malva: '#C49BB7',
  donut: '#F6D858',
};

/**
 * Color de fondo del círculo para un nombre de color o variante.
 * Acepta nombres descriptivos como "Amarillo Donas" o "Durazno Pandas":
 * busca el color real dentro del texto. "azul marino" / "verde menta" /
 * "azul acero" (claves de dos palabras) tienen prioridad sobre la 1ª palabra.
 */
export function colorSwatch(color: string): string {
  const norm = color.toLowerCase().split('/')[0].trim();
  if (COLOR_HEX_MAP[norm]) return COLOR_HEX_MAP[norm];
  for (const key of Object.keys(COLOR_HEX_MAP)) {
    if (key.includes(' ') && norm.startsWith(key)) return COLOR_HEX_MAP[key];
  }
  const firstWord = norm.split(' ')[0];
  return COLOR_HEX_MAP[firstWord] || '#E8829A';
}

/**
 * Foto que corresponde a un color.
 * 1) Si el producto define `colorImages`, se usa esa (control explícito).
 * 2) Si no, y hay la misma cantidad de colores que de fotos, se enlaza por orden
 *    (color i ↔ foto i). Así las referencias futuras funcionan solas con solo
 *    listar las fotos en el mismo orden que los colores.
 */
export function imageForColor(product: Product, color: string): string | undefined {
  if (product.colorImages?.[color]) return product.colorImages[color];
  if (product.colors.length === product.images.length) {
    const i = product.colors.indexOf(color);
    if (i >= 0) return product.images[i];
  }
  return undefined;
}
