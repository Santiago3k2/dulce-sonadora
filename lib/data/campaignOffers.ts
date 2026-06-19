/**
 * Precio promocional FIJO de una landing /oferta, independiente del catálogo.
 * Lo usan la landing (lo que se muestra) y `createOrder` (lo que se cobra), para
 * que coincidan. Útil cuando el catálogo cambia de precio pero una campaña ACTIVA
 * debe conservar el precio con el que salió en los Ads.
 *
 * Sin imports de React: lo comparten cliente (CampaignLanding) y servidor
 * (app/checkout/actions.ts). Se scopea por campaña + slug del producto, así el
 * precio especial SOLO aplica en esa landing, no en la tienda normal.
 */
export interface CampaignOffer {
  /** slug del producto al que aplica (guardia para que no se cuele a otro). */
  productSlug: string;
  retail: number;
  wholesale: number;
}

export const CAMPAIGN_OFFERS: Record<string, CampaignOffer> = {
  // Día del Padre (Ref 065 bermuda): la promo conserva su precio ($43.040 detal /
  // $33.040 mayor) aunque el catálogo bajó a $40.000/$33.000 con la lista nueva
  // (jun 2026). Decisión de Santiago: el override es solo para esta landing.
  'dia-del-padre': {
    productSlug: 'bermuda-camisa-cuello-v-manga-franela',
    retail: 43040,
    wholesale: 33040,
  },
};
