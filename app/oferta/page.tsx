import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/queries';
import { formatCOP } from '@/lib/utils/format';
import { ExternalLink, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Todas las landing pages — Dulce Soñadora',
  description: 'Índice interno: visualiza la landing de cualquier pijama.',
  robots: { index: false, follow: false }, // no indexar en Google
};

/**
 * PÁGINA ÍNDICE INTERNA
 *
 * Esta página NO se debe usar para anuncios.
 * Sirve únicamente para que el equipo pueda ver y probar
 * todas las landing pages generadas (una por producto).
 *
 * Cada link abre la landing aislada, lista para TikTok Ads.
 */
export default async function OfertaIndexPage() {
  const products = await getAllProducts();
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-soft/60 shadow-pink-soft mb-4">
            <Sparkles size={14} className="text-pink-deeper" />
            <span className="text-xs uppercase tracking-[0.2em] text-pink-deeper font-semibold">
              Panel interno
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-text-dark underline-gradient">
            Landing pages para TikTok Ads
          </h1>
          <p className="text-text-muted mt-6 max-w-2xl mx-auto">
            Cada pijama tiene su propia landing aislada (sin header ni footer del sitio).
            Haz clic en cualquier tarjeta para abrir la landing en una pestaña nueva —
            esa es la URL que pegas en TikTok Ads.
          </p>
          <p className="text-xs text-text-muted mt-3">
            Total: <strong className="text-pink-deeper">{products.length} landings</strong> generadas automáticamente.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/oferta/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden border border-gray-line hover:border-pink-deeper hover:shadow-pink-soft transition-all"
            >
              <div className="relative aspect-[3/4] bg-gray-soft overflow-hidden">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-pink-deeper opacity-0 group-hover:opacity-100 transition">
                  <ExternalLink size={14} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-text-dark line-clamp-2 min-h-[2.5rem] group-hover:text-pink-deeper transition">
                  {p.name}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm font-bold text-pink-deeper">
                    {formatCOP(p.priceWholesale)}
                  </span>
                  <span className="text-[10px] text-text-muted line-through">
                    {formatCOP(p.priceRetail)}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-1 truncate font-mono">
                  /oferta/{p.slug}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-line max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-text-dark mb-4">
            ¿Cómo se usa para TikTok Ads?
          </h2>
          <ol className="space-y-3 text-sm text-text-muted">
            <li>
              <strong className="text-text-dark">1.</strong> Despliega el proyecto en Vercel
              (o el hosting que uses). Obtendrás una URL pública del tipo{' '}
              <code className="text-pink-deeper bg-pink-soft/20 px-1.5 py-0.5 rounded">
                tu-dominio.com
              </code>
              .
            </li>
            <li>
              <strong className="text-text-dark">2.</strong> Elige el producto que vas a
              promocionar y copia su URL completa (ej:{' '}
              <code className="text-pink-deeper bg-pink-soft/20 px-1.5 py-0.5 rounded">
                tu-dominio.com/oferta/conjunto-satin-rosa-cerezas
              </code>
              ).
            </li>
            <li>
              <strong className="text-text-dark">3.</strong> Pega esa URL como{' '}
              <em>"Landing Page URL"</em> al crear el anuncio en TikTok Ads Manager.
            </li>
            <li>
              <strong className="text-text-dark">4.</strong> El usuario que haga clic en
              tu anuncio verá <em>solo</em> la landing (sin header ni footer del sitio
              principal). Diseño 100% conversión.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
