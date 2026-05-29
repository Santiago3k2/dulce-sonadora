import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import CartDrawer from '@/components/ui/CartDrawer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Dulce Soñadora — Pijamas y Lencería',
  description:
    'Pijamas en satín y algodón, lencería y baby doll. Diseños románticos, calidad superior, envíos a toda Colombia.',
  keywords: ['pijamas', 'lencería', 'satín', 'algodón', 'baby doll', 'Colombia'],
  openGraph: {
    title: 'Dulce Soñadora',
    description: 'Pijamas y lencería con diseños encantadores',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-sans bg-white text-text-dark antialiased">
        <Header />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
      </body>
    </html>
  );
}
