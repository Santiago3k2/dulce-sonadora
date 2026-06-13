import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import NinaPijamaLanding from '@/components/landing/NinaPijamaLanding';

/**
 * Landing de campaña PIJAMA NIÑA (Ref 064) para TikTok / Facebook / Instagram Ads.
 * Ruta oculta y aislada (sin header/footer). Link para anuncios: /oferta/pijama-nina
 * El formulario registra el pedido en el mismo sistema (/admin/pedidos + correo).
 */

const PRODUCT_SLUG = 'nina-pijama-manga-corta';

export const metadata: Metadata = {
  title: '💖 Pijama para Niña — Sweet Dreams | Dulce Soñadora',
  description:
    'La pijama soñada para tu niña: camiseta manga corta + pantalón, algodón suave. Stitch, vaquita, Huntrix y más. Envío gratis y pago contra entrega.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '💖 La pijama favorita de las niñas — Dulce Soñadora',
    description: 'Algodón suave, estampados que les encantan. Envío gratis a toda Colombia.',
    images: ['/products/ref-064-nina-pijama-manga-corta/photo-1.png'],
    type: 'website',
  },
};

export default async function PijamaNinaPage() {
  const product = await getProductBySlug(PRODUCT_SLUG);
  if (!product) notFound();
  return <NinaPijamaLanding product={product} />;
}
