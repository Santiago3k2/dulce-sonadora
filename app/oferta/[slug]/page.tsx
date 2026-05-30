import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, products } from '@/lib/data/products';
import PajamaLanding from '@/components/landing/PajamaLanding';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
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

export default function OfertaPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <PajamaLanding product={product} />;
}
