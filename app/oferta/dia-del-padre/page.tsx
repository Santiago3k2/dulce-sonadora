import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/queries';
import CampaignLanding from '@/components/landing/CampaignLanding';
import { CAMPAIGNS } from '@/components/landing/campaigns';

/**
 * Landing campaña DÍA DEL PADRE (Ref 065). Ruta oculta y aislada para Ads.
 * Link: /oferta/dia-del-padre · Usa la plantilla CampaignLanding.
 */
const KEY = 'dia-del-padre' as const;
const cfg = CAMPAIGNS[KEY];

export const metadata: Metadata = {
  title: cfg.meta.title,
  description: cfg.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: cfg.meta.title, description: cfg.meta.description, images: [cfg.meta.ogImage], type: 'website' },
};

export default async function DiaDelPadrePage() {
  const product = await getProductBySlug(cfg.productSlug);
  if (!product) notFound();
  return <CampaignLanding product={product} campaign={KEY} />;
}
