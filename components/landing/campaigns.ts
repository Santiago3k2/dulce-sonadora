import type { LucideIcon } from 'lucide-react';
import { Gift, Heart, Sun, Crown, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

/**
 * Configuración de cada campaña/landing. Una sola plantilla (CampaignLanding)
 * las renderiza todas; aquí va lo que cambia: producto, tema (colores) y textos.
 * El precio por talla se detecta solo si el producto tiene `sizePrices`.
 *
 * Para crear una nueva landing:
 *   1) Sube las fotos a /public/landing/<slug>/...
 *   2) Agrega una entrada a CAMPAIGNS con su productSlug, tema, textos e imágenes.
 *   3) Crea app/oferta/<slug>/page.tsx (copiando una existente, cambia la key).
 */

export interface Review {
  name: string;
  city: string;
  text: string;
}
export interface TrustItem {
  icon: LucideIcon;
  text: string;
}
export type Urgency =
  | { kind: 'countdown'; date: string; label: string }
  | { kind: 'text'; text: string };

/** Clases Tailwind (literales para que el JIT las detecte) por tema. */
export interface LandingTheme {
  rootBg: string;
  bgGradient: string;
  glow1: string;
  glow2: string;
  dotsRGBA: string;
  eyebrowText: string;
  accentSoft: string; // color de acentos pequeños (íconos, estrellas, nombres)
  headlineAccent: string; // clase del título acentuado (grande)
  priceClass: string;
  badge: string;
  saving: string;
  dotActive: string;
  thumbRing: string;
  card: string;
  cta: string; // color/bg/text del botón (la forma la pone la plantilla)
  field: string; // color de texto de inputs/selects
  totalBox: string;
  totalValue: string;
  urgencyBox: string;
  sticky: string; // gradiente de la barra fija
  stickyBtn: string;
  confirmGradient: string;
  confirmCircle: string;
  confirmCheck: string;
}

export interface CampaignConfig {
  productSlug: string;
  anchor: number; // precio ancla (gancho) tachado
  images: string[]; // en el MISMO orden que product.colors
  designLabel: string; // 'Color' | 'Diseño'
  meta: { title: string; description: string; ogImage: string };
  eyebrow: { icon: LucideIcon; text: string };
  title: { top: string; accent: string };
  subtitle: string;
  ctaLabel: string;
  ctaIcon: LucideIcon;
  ctaFillIcon?: boolean; // rellenar el ícono (corazón)
  savingText: string; // usa {saving}
  benefitsHeading: { text: string; accent: string };
  benefits: string[];
  reviewsStrong: string;
  reviewsRest: string;
  reviews: Review[];
  urgency?: Urgency;
  trust: TrustItem[];
  formTitle: { text: string; accent: string };
  formIntro: string;
  notesPrefix: string; // prefijo de las notas del pedido
  waConfirm: string; // mensaje de WhatsApp; usa {n} {color} {size}
  theme: LandingTheme;
}

// ───────────────────────── TEMAS ─────────────────────────
const THEME_NAVY_GOLD: LandingTheme = {
  rootBg: 'bg-[#0B1E3C]',
  bgGradient: 'bg-gradient-to-b from-[#0A1A33] via-[#102A52] to-[#070F22]',
  glow1: 'absolute -top-28 left-1/2 -translate-x-1/2 w-[460px] h-[460px] rounded-full bg-amber-400/15 blur-[90px]',
  glow2: 'absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-[90px]',
  dotsRGBA: 'rgba(231,193,104,0.10)',
  eyebrowText: 'gold-text',
  accentSoft: 'text-amber-300',
  headlineAccent: 'gold-shine',
  priceClass: 'gold-shine',
  badge: 'btn-lux',
  saving: 'bg-emerald-400/15 border border-emerald-300/30 text-emerald-200',
  dotActive: 'bg-amber-300',
  thumbRing: 'ring-amber-400',
  card: 'bg-white/5 border border-white/10',
  cta: 'btn-lux',
  field: 'text-[#0F2647]',
  totalBox: 'bg-amber-300/10 border border-amber-300/30',
  totalValue: 'gold-text',
  urgencyBox: 'bg-white/5 border border-amber-300/20',
  sticky: 'from-[#070F22] via-[#070F22]/90',
  stickyBtn: 'btn-lux animate-gold-pulse',
  confirmGradient: 'bg-gradient-to-b from-[#0A1A33] via-[#102A52] to-[#070F22]',
  confirmCircle: 'btn-lux',
  confirmCheck: 'text-[#0B1E3C]',
};

const THEME_ROSE: LandingTheme = {
  rootBg: 'bg-[#8C5A82]',
  bgGradient: 'bg-gradient-to-b from-[#B76E8E] via-[#8C5A82] to-[#574568]',
  glow1: 'absolute -top-24 left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-white/15 blur-[90px]',
  glow2: 'absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-amber-200/15 blur-[90px]',
  dotsRGBA: 'rgba(255,255,255,0.16)',
  eyebrowText: 'text-white',
  accentSoft: 'text-amber-100',
  headlineAccent: 'gold-text',
  priceClass: 'text-white drop-shadow',
  badge: 'bg-white text-pink-deeper',
  saving: 'bg-white/20 border border-white/30 text-white',
  dotActive: 'bg-white',
  thumbRing: 'ring-white',
  card: 'bg-white/12 border border-white/20',
  cta: 'bg-white text-pink-deeper',
  field: 'text-pink-deeper',
  totalBox: 'bg-white/20 border border-white/30',
  totalValue: 'text-white',
  urgencyBox: 'bg-white/15 border border-white/25',
  sticky: 'from-[#3E3152] via-[#3E3152]/90',
  stickyBtn: 'bg-white text-pink-deeper animate-soft-pulse',
  confirmGradient: 'bg-gradient-to-b from-[#B76E8E] via-[#8C5A82] to-[#574568]',
  confirmCircle: 'bg-white',
  confirmCheck: 'text-pink-deeper',
};

const THEME_OCEAN: LandingTheme = {
  rootBg: 'bg-[#1E7FB0]',
  bgGradient: 'bg-gradient-to-b from-[#27B9CC] via-[#1E84B4] to-[#103864]',
  glow1: 'absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-amber-300/25 blur-[90px]',
  glow2: 'absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-cyan-300/15 blur-[90px]',
  dotsRGBA: 'rgba(255,255,255,0.14)',
  eyebrowText: 'text-amber-200',
  accentSoft: 'text-amber-200',
  headlineAccent: 'bg-gradient-to-r from-[#FFE15A] via-[#FFB23F] to-[#FF7A59] bg-clip-text text-transparent',
  priceClass: 'text-white drop-shadow',
  badge: 'bg-[#FFD23F] text-[#0E3A63]',
  saving: 'bg-[#FF7A59] text-white',
  dotActive: 'bg-amber-300',
  thumbRing: 'ring-amber-300',
  card: 'bg-white/12 border border-white/20',
  cta: 'bg-gradient-to-r from-[#FF8A5B] to-[#FF6B3D] text-white shadow-lg shadow-[#FF6B3D]/40',
  field: 'text-[#103864]',
  totalBox: 'bg-white/15 border border-white/25',
  totalValue: 'text-white',
  urgencyBox: 'bg-[#FF7A59]/20 border border-[#FFB23F]/40',
  sticky: 'from-[#0B2B4D] via-[#0B2B4D]/90',
  stickyBtn: 'bg-gradient-to-r from-[#FF8A5B] to-[#FF6B3D] text-white',
  confirmGradient: 'bg-gradient-to-b from-[#23B5C9] via-[#1E7FB0] to-[#143F73]',
  confirmCircle: 'bg-white',
  confirmCheck: 'text-[#1E7FB0]',
};

// ───────────────────────── CAMPAÑAS ─────────────────────────
export const CAMPAIGNS: Record<string, CampaignConfig> = {
  'dia-del-padre': {
    productSlug: 'bermuda-camisa-cuello-v-manga-franela',
    anchor: 59900,
    images: [1, 2, 3, 4, 5, 6, 7].map((n) => `/landing/dia-del-padre/hombre-${n}.png`),
    designLabel: 'Color',
    meta: {
      title: '🎁 Día del Padre — Pijama para Papá | Dulce Soñadora',
      description:
        'El regalo perfecto para papá: pijama premium suave y fresca. Envío GRATIS y pago contra entrega a toda Colombia. ¡Promoción Día del Padre!',
      ogImage: '/landing/dia-del-padre/hombre-1.png',
    },
    eyebrow: { icon: Crown, text: 'Edición Día del Padre' },
    title: { top: 'El regalo perfecto', accent: 'para Papá' },
    subtitle: 'Pijama premium, suave y elegante. Comodidad que se siente, estilo que se nota.',
    ctaLabel: 'QUIERO REGALÁRSELA',
    ctaIcon: Gift,
    savingText: 'Ahorras {saving} hoy',
    benefitsHeading: { text: 'Hecha para', accent: 'consentir a papá' },
    benefits: [
      'Tela suave tipo algodón premium',
      'Fresca y transpirable',
      'Corte moderno que no aprieta',
      'Bolsillo y ribete en contraste',
      'Resiste lavadas sin perder color',
      'Empaque listo para regalar',
    ],
    reviewsStrong: '+5.000',
    reviewsRest: 'papás felices en toda Colombia',
    reviews: [
      { name: 'Laura G.', city: 'Bogotá', text: 'El regalo perfecto para mi papá, le encantó. La tela es suavísima.' },
      { name: 'Andrés M.', city: 'Medellín', text: 'Calidad excelente y llegó rapidísimo, pagué al recibir. 10/10.' },
      { name: 'Diana R.', city: 'Cali', text: 'Compré para mi esposo y mi suegro. Se ven elegantísimas.' },
    ],
    urgency: { kind: 'countdown', date: '2026-06-21T23:59:59-05:00', label: '⏳ La promoción termina el Día del Padre' },
    trust: [
      { icon: Truck, text: 'Envío GRATIS' },
      { icon: ShieldCheck, text: 'Pago al recibir' },
      { icon: Gift, text: 'Listo para regalar' },
    ],
    formTitle: { text: 'Hazlo sentir', accent: 'especial' },
    formIntro: 'Llena tus datos y te la enviamos con pago contra entrega. Envío gratis a toda Colombia.',
    notesPrefix: '🎁 Pedido landing Día del Padre — Ref 065',
    waConfirm:
      '¡Hola! Acabo de hacer el pedido #{n} del Día del Padre (Ref 065, color {color}, talla {size}). Quiero confirmarlo 🎁',
    theme: THEME_NAVY_GOLD,
  },

  'pijama-nina': {
    productSlug: 'nina-pijama-manga-corta',
    anchor: 42900,
    images: [1, 2, 3, 4].map((n) => `/landing/pijama-nina/nina-${n}.png`),
    designLabel: 'Diseño',
    meta: {
      title: '💖 Pijama para Niña — Sweet Dreams | Dulce Soñadora',
      description:
        'La pijama soñada para tu niña: camiseta manga corta + pantalón, algodón suave. Stitch, vaquita, Huntrix y más. Envío gratis y pago contra entrega.',
      ogImage: '/landing/pijama-nina/nina-1.png',
    },
    eyebrow: { icon: Sparkles, text: 'Nueva colección niña' },
    title: { top: 'La pijama soñada', accent: 'para tu niña' },
    subtitle: 'Camiseta manga corta + pantalón en algodón suave. Con sus personajes favoritos. 💖',
    ctaLabel: 'LA QUIERO PARA ELLA',
    ctaIcon: Heart,
    ctaFillIcon: true,
    savingText: '¡Ahorras {saving} hoy!',
    benefitsHeading: { text: 'Comodidad que', accent: 'ellas aman' },
    benefits: [
      'Algodón suave que no irrita su piel',
      'Fresca y transpirable para dormir cómoda',
      'Estampados que les encantan',
      'Camiseta manga corta + pantalón largo',
      'Tallas de la 2 a la 16',
      'Colores que no destiñen con el lavado',
    ],
    reviewsStrong: '+5.000',
    reviewsRest: 'mamás felices en toda Colombia',
    reviews: [
      { name: 'Carolina P.', city: 'Bogotá', text: 'A mi hija le fascinó la de Stitch. La tela es suavecita y fresca.' },
      { name: 'Marcela T.', city: 'Bucaramanga', text: 'Compré dos, llegaron rapidísimo y pagué al recibir. Quedé feliz.' },
      { name: 'Yuli A.', city: 'Cali', text: 'La calidad es bellísima y los estampados ni se imaginan lo lindos.' },
    ],
    urgency: { kind: 'text', text: '🔥 Súper pedidas esta semana · Últimas unidades por talla' },
    trust: [
      { icon: Truck, text: 'Envío GRATIS' },
      { icon: ShieldCheck, text: 'Pago al recibir' },
      { icon: RefreshCw, text: 'Cambios fáciles' },
    ],
    formTitle: { text: 'Hazla', accent: 'feliz 💖' },
    formIntro: 'Llena tus datos y se la llevamos con pago contra entrega. ¡Envío gratis a toda Colombia!',
    notesPrefix: '💖 Pedido landing Pijama Niña — Ref 064',
    waConfirm:
      '¡Hola! Acabo de hacer el pedido #{n} de la pijama de niña (Ref 064, diseño {color}, talla {size}). Quiero confirmarlo 💖',
    theme: THEME_ROSE,
  },

  'bano-verano': {
    productSlug: 'nina-bano-enterizo-bolero',
    anchor: 46900,
    images: [1, 2, 3, 4, 5].map((n) => `/landing/bano-verano/bano-${n}.png`),
    designLabel: 'Diseño',
    meta: {
      title: '☀️ Vestidos de Baño Niña — Vacaciones de Verano | Dulce Soñadora',
      description:
        'Vestidos de baño para niña con protección UV y secado rápido. ¡Precios imperdibles de temporada! Envío gratis y pago contra entrega a toda Colombia.',
      ogImage: '/landing/bano-verano/bano-4.png',
    },
    eyebrow: { icon: Sun, text: 'Vacaciones de verano' },
    title: { top: 'Vestidos de baño', accent: 'para el verano' },
    subtitle:
      'Protección UV, secado rápido y diseños que les encantan. ¡Listas para la piscina, el mar y el sol! 🏖️',
    ctaLabel: '¡LA QUIERO PARA EL VERANO!',
    ctaIcon: Sun,
    savingText: '¡Ahorras {saving}! · Precio imperdible',
    benefitsHeading: { text: 'Hechos para', accent: 'disfrutar el sol' },
    benefits: [
      'Protección UV: cuida su piel del sol',
      'Secado rápido para seguir jugando',
      'Resistente al cloro y la sal',
      'Tela suave y elástica que no aprieta',
      'Boleritos en los hombros, ¡divinos!',
      'Tallas de la 2 a la 16',
    ],
    reviewsStrong: '+5.000',
    reviewsRest: 'niñas felices disfrutando el agua',
    reviews: [
      { name: 'Paola C.', city: 'Santa Marta', text: 'Perfecto para la piscina, seca rapidísimo y a mi hija le encantó el de Stitch.' },
      { name: 'Natalia R.', city: 'Cartagena', text: 'La tela es muy buena y no le marcó la piel con el sol. Repito sin duda.' },
      { name: 'Sara M.', city: 'Pereira', text: 'Llegó rápido y pagué al recibir. Los estampados son hermosos.' },
    ],
    urgency: { kind: 'text', text: '🔥 Temporada de vacaciones · Precios imperdibles · ¡Últimas tallas!' },
    trust: [
      { icon: Truck, text: 'Envío GRATIS' },
      { icon: ShieldCheck, text: 'Pago al recibir' },
      { icon: Sun, text: 'Protección UV' },
    ],
    formTitle: { text: '¡A disfrutar el', accent: 'verano! ☀️' },
    formIntro: 'Llena tus datos y se lo llevamos con pago contra entrega. ¡Envío gratis a toda Colombia!',
    notesPrefix: '🏖️ Pedido landing Vacaciones Verano — Ref 208',
    waConfirm:
      '¡Hola! Acabo de hacer el pedido #{n} del vestido de baño (Ref 208, diseño {color}, talla {size}). Quiero confirmarlo ☀️',
    theme: THEME_OCEAN,
  },

  'bano-manga-larga': {
    productSlug: 'nina-bano-enterizo-manga-larga',
    anchor: 56900,
    images: [1, 2, 3, 4, 5].map((n) => `/landing/bano-manga-larga/bano-${n}.png`),
    designLabel: 'Diseño',
    meta: {
      title: '☀️ Vestido de Baño Manga Larga Niña — Protección Solar | Dulce Soñadora',
      description:
        'Vestido de baño enterizo manga larga con protección UV: cubre más la piel de tu niña. Secado rápido y diseños divinos. ¡Precios imperdibles! Envío gratis y pago contra entrega.',
      ogImage: '/landing/bano-manga-larga/bano-4.png',
    },
    eyebrow: { icon: Sun, text: 'Protección solar UV' },
    title: { top: 'Vestido de baño', accent: 'manga larga' },
    subtitle:
      'Cubre más, protege más: manga larga con filtro UV. Secado rápido y diseños divinos para el sol, la piscina y el mar. 🏖️',
    ctaLabel: '¡LO QUIERO PARA EL SOL!',
    ctaIcon: Sun,
    savingText: '¡Ahorras {saving}! · Precio imperdible',
    benefitsHeading: { text: 'Protección que', accent: 'cuida su piel' },
    benefits: [
      'Manga larga con protección UV',
      'Cubre hombros y brazos del sol',
      'Secado rápido para seguir jugando',
      'Resistente al cloro y la sal',
      'Tela suave y elástica que no aprieta',
      'Tallas de la 2 a la 16',
    ],
    reviewsStrong: '+5.000',
    reviewsRest: 'niñas protegidas del sol',
    reviews: [
      { name: 'Marcela V.', city: 'Barranquilla', text: 'La manga larga es ideal para la playa, no se quemó nada. Y seca rapidísimo.' },
      { name: 'Tatiana L.', city: 'Villavicencio', text: 'Hermoso y de muy buena tela. A mi hija le encantó el de capibara.' },
      { name: 'Andrea S.', city: 'Ibagué', text: 'Llegó rápido y pagué al recibir. Perfecto para las vacaciones.' },
    ],
    urgency: { kind: 'text', text: '🔥 Temporada de playa y piscina · Precios imperdibles · ¡Últimas tallas!' },
    trust: [
      { icon: Truck, text: 'Envío GRATIS' },
      { icon: ShieldCheck, text: 'Pago al recibir' },
      { icon: Sun, text: 'Protección UV' },
    ],
    formTitle: { text: '¡Listas para el', accent: 'sol! ☀️' },
    formIntro: 'Llena tus datos y se lo llevamos con pago contra entrega. ¡Envío gratis a toda Colombia!',
    notesPrefix: '🏖️ Pedido landing Baño Manga Larga — Ref 201-2',
    waConfirm:
      '¡Hola! Acabo de hacer el pedido #{n} del vestido de baño manga larga (Ref 201-2, diseño {color}, talla {size}). Quiero confirmarlo ☀️',
    theme: THEME_OCEAN,
  },
};

export type CampaignKey = keyof typeof CAMPAIGNS;
