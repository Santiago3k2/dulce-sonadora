'use client';

import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          Explora nuestras
        </p>
        <h2 className="section-title">Referencias</h2>
        <div className="divider-gradient" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] bg-gray-soft overflow-hidden rounded-sm shadow-pink-soft group-hover:shadow-pink transition-all duration-300">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-deeper/60 via-pink-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Ver →
              </span>
            </div>
            <h3 className="mt-3 text-center font-serif italic text-base md:text-lg text-text-dark group-hover:text-pink-deeper transition">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
