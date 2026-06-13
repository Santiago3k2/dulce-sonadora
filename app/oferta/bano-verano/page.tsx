import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import CampaignLanding from '@/components/landing/CampaignLanding';
import { CAMPAIGNS } from '@/components/landing/campaigns';

/**
 * Landing campaña VACACIONES DE VERANO (Ref 208, baño niña). Precio por talla.
 * Ruta oculta y aislada para Ads. Link: /oferta/bano-verano · Plantilla CampaignLanding.
 */
const KEY = 'bano-verano' as const;
const cfg = CAMPAIGNS[KEY];

export const metadata: Metadata = {
  title: cfg.meta.title,
  description: cfg.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: cfg.meta.title, description: cfg.meta.description, images: [cfg.meta.ogImage], type: 'website' },
};

export default async function BanoVeranoPage() {
  const product = await getProductBySlug(cfg.productSlug);
  if (!product) notFound();
  return <CampaignLanding product={product} campaign={KEY} />;
}
