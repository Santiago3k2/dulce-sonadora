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
        <div className="mx-auto mt-4 w-16 h-px bg-pink-deeper" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] bg-gray-soft overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
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
