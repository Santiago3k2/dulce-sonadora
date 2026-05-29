'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getFeaturedProducts,
  getNewProducts,
} from '@/lib/data/products';
import ProductGrid from '@/components/products/ProductGrid';

type TabKey = 'featured' | 'new';

export default function FeaturedProducts() {
  const [tab, setTab] = useState<TabKey>('featured');
  const featured = getFeaturedProducts();
  const news = getNewProducts();
  const products = tab === 'featured' ? featured : news;

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          Nuestros favoritos
        </p>
        <h2 className="section-title">Productos Recomendados</h2>
        <div className="mx-auto mt-4 w-16 h-px bg-pink-deeper" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-10 border-b border-gray-line">
        <button
          onClick={() => setTab('featured')}
          className={`pb-3 text-sm uppercase tracking-wider transition border-b-2 -mb-px ${
            tab === 'featured'
              ? 'text-pink-deeper border-pink-deeper'
              : 'text-text-muted border-transparent hover:text-pink-deeper'
          }`}
        >
          Más vendidos
        </button>
        <button
          onClick={() => setTab('new')}
          className={`pb-3 text-sm uppercase tracking-wider transition border-b-2 -mb-px ${
            tab === 'new'
              ? 'text-pink-deeper border-pink-deeper'
              : 'text-text-muted border-transparent hover:text-pink-deeper'
          }`}
        >
          Nuevos
        </button>
      </div>

      <ProductGrid products={products.slice(0, 8)} />

      <div className="text-center mt-12">
        <Link href="/tienda" className="btn-outline">
          Ver todos los productos
        </Link>
      </div>
    </section>
  );
}
