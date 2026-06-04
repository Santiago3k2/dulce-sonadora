import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/data/queries';
import PajamaLanding from '@/components/landing/PajamaLanding';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Oferta — Dulce Soñadora' };
  return {
    title: `${product.name} — Oferta Dulce Soñadora`,
    description: product.description,
    openGraph: {
      title: `${product.name} — desde $${product.priceWholesale.toLocaleString('es-CO')}`,
      description: product.description,
      images: product.images.slice(0, 1),
      type: 'website',
    },
  };
}

export default async function OfertaPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const all = await getAllProducts();
  const related = all.filter((p) => p.id !== product.id && p.images[0]).slice(0, 6);
  return <PajamaLanding product={product} related={related} />;
}
