'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import CartDrawer from '@/components/ui/CartDrawer';
import SplashScreen from '@/components/ui/SplashScreen';
import PromoModal from '@/components/ui/PromoModal';

/**
 * Renderiza la "chrome" del sitio (header, footer, nav, drawer, etc.)
 * EXCEPTO cuando la ruta empieza con /oferta — esas rutas son landing pages
 * para anuncios de TikTok y deben verse aisladas, sin distracciones.
 */
export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname() ?? '';
  const isStandaloneLanding = path.startsWith('/oferta');

  if (isStandaloneLanding) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SplashScreen />
      <Header />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <PromoModal />
    </>
  );
}
