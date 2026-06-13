import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import FathersDayLanding from '@/components/landing/FathersDayLanding';

/**
 * Landing de campaña DÍA DEL PADRE (TikTok / Facebook / Instagram Ads).
 * Ruta oculta: no está enlazada en ningún menú y se renderiza aislada
 * (sin header/footer) gracias a ConditionalShell (/oferta/*).
 * El link para los anuncios es:  /oferta/dia-del-padre
 *
 * Vende el conjunto de hombre Ref 065 (bermuda + camisa). El formulario
 * registra el pedido en el mismo sistema (/admin/pedidos + correo).
 */

const PRODUCT_SLUG = 'bermuda-camisa-cuello-v-manga-franela';

export const metadata: Metadata = {
  title: '🎁 Día del Padre — Pijama para Papá | Dulce Soñadora',
  description:
    'El regalo perfecto para papá: pijama premium suave y fresca. Envío GRATIS y pago contra entrega a toda Colombia. ¡Promoción Día del Padre!',
  robots: { index: false, follow: false }, // oculta de Google
  openGraph: {
    title: '🎁 El regalo perfecto para papá — Dulce Soñadora',
    description:
      'Pijama premium para papá. Envío gratis a toda Colombia. Promoción Día del Padre.',
    images: ['/landing/dia-del-padre/hombre-1.png'],
    type: 'website',
  },
};

export default async function DiaDelPadrePage() {
  const product = await getProductBySlug(PRODUCT_SLUG);
  if (!product) notFound();
  return <FathersDayLanding product={product} />;
}
