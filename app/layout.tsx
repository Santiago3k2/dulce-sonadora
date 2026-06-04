import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import ConditionalShell from '@/components/layout/ConditionalShell';
import { getCategoryGroups } from '@/lib/data/queries';

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
  title: 'Dulce Soñadora — El encanto de soñar',
  description:
    'Pijamas en satín y algodón, lencería y baby doll. Diseños románticos, calidad superior, envíos a toda Colombia.',
  keywords: ['pijamas', 'lencería', 'satín', 'algodón', 'baby doll', 'Colombia', 'Dulce Soñadora'],
  openGraph: {
    title: 'Dulce Soñadora — El encanto de soñar',
    description: 'Pijamas y lencería con diseños encantadores. Envíos a toda Colombia.',
    type: 'website',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dulce Soñadora',
    description: 'El encanto de soñar — Pijamas y lencería',
    images: ['/logo.png'],
  },
};

// La tienda lee datos en vivo de Supabase (refleja cambios del panel sin redeploy).
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = await getCategoryGroups();
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-sans bg-white text-text-dark antialiased">
        <ConditionalShell groups={groups}>{children}</ConditionalShell>
      </body>
    </html>
  );
}
