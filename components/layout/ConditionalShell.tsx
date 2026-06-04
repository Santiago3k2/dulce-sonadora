'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import CartDrawer from '@/components/ui/CartDrawer';
import SplashScreen from '@/components/ui/SplashScreen';
import PromoModal from '@/components/ui/PromoModal';
import type { CategoryGroup } from '@/lib/data/categories';

/**
 * Renderiza la "chrome" del sitio (header, footer, nav, drawer, etc.)
 * EXCEPTO cuando la ruta empieza con /oferta — esas rutas son landing pages
 * para anuncios de TikTok y deben verse aisladas, sin distracciones.
 */
export default function ConditionalShell({
  children,
  groups,
}: {
  children: React.ReactNode;
  groups: CategoryGroup[];
}) {
  const path = usePathname() ?? '';
  // /oferta = landings aisladas para Ads. /admin = panel con su propio layout.
  const isStandalone = path.startsWith('/oferta') || path.startsWith('/admin');

  if (isStandalone) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SplashScreen />
      <Header groups={groups} />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer groups={groups} />
      <MobileBottomNav />
      <CartDrawer />
      <PromoModal />
    </>
  );
}
