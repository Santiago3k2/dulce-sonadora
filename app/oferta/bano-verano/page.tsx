import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import BanoVeranoLanding from '@/components/landing/BanoVeranoLanding';

/**
 * Landing de campaña VACACIONES DE VERANO — Vestidos de baño niña (Ref 208).
 * Ruta oculta y aislada para Ads. Link: /oferta/bano-verano
 * Maneja precio por talla (2-4-6-8 vs 10-12-14-16) y registra el pedido en
 * el mismo sistema (/admin/pedidos + correo).
 */

const PRODUCT_SLUG = 'nina-bano-enterizo-bolero';

export const metadata: Metadata = {
  title: '☀️ Vestidos de Baño Niña — Vacaciones de Verano | Dulce Soñadora',
  description:
    'Vestidos de baño para niña con protección UV y secado rápido. ¡Precios imperdibles de temporada! Envío gratis y pago contra entrega a toda Colombia.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '☀️ Vestidos de baño niña — Precios imperdibles de verano',
    description: 'Protección UV, secado rápido y diseños divinos. Envío gratis a toda Colombia.',
    images: ['/landing/bano-verano/bano-4.png'],
    type: 'website',
  },
};

export default async function BanoVeranoPage() {
  const product = await getProductBySlug(PRODUCT_SLUG);
  if (!product) notFound();
  return <BanoVeranoLanding product={product} />;
}
