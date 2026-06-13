import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import CampaignLanding from '@/components/landing/CampaignLanding';
import { CAMPAIGNS } from '@/components/landing/campaigns';

/**
 * Landing campaña BAÑO MANGA LARGA (Ref 201-2, protección solar). Precio por talla.
 * Ruta oculta y aislada para Ads. Link: /oferta/bano-manga-larga · Plantilla CampaignLanding.
 */
const KEY = 'bano-manga-larga' as const;
const cfg = CAMPAIGNS[KEY];

export const metadata: Metadata = {
  title: cfg.meta.title,
  description: cfg.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: cfg.meta.title, description: cfg.meta.description, images: [cfg.meta.ogImage], type: 'website' },
};

export default async function BanoMangaLargaPage() {
  const product = await getProductBySlug(cfg.productSlug);
  if (!product) notFound();
  return <CampaignLanding product={product} campaign={KEY} />;
}
