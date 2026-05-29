import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { categories, getCategoryBySlug } from '@/lib/data/categories';
import { getProductsByCategory } from '@/lib/data/products';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: 'Categoría — Dulce Soñadora' };
  return {
    title: `${category.name} — Dulce Soñadora`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return notFound();
  const products = getProductsByCategory(params.slug);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-pink-deeper">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/tienda" className="hover:text-pink-deeper">Tienda</Link>
        <ChevronRight size={12} />
        <span className="text-text-dark">{category.name}</span>
      </nav>

      {/* Hero */}
      <header className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          {category.groupLabel}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-text-dark">
          {category.name}
        </h1>
        <div className="divider-gradient" />
        {category.description && (
          <p className="mt-4 text-text-muted max-w-2xl mx-auto text-sm">
            {category.description}
          </p>
        )}
        <p className="mt-3 text-xs text-text-muted">
          {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
        </p>
      </header>

      <ProductGrid
        products={products}
        emptyMessage="Pronto añadiremos productos a esta categoría. ¡Vuelve pronto!"
      />
    </div>
  );
}
