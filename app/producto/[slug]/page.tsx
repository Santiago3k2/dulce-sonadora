import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { products, getProductBySlug, getRelatedProducts } from '@/lib/data/products';
import { getCategoryBySlug } from '@/lib/data/categories';
import ProductDetail from './ProductDetail';
import ProductGrid from '@/components/products/ProductGrid';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Producto — Dulce Soñadora' };
  return {
    title: `${product.name} — Dulce Soñadora`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product.id, product.category, 4);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-text-muted mb-6 flex-wrap">
        <Link href="/" className="hover:text-pink-deeper">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/tienda" className="hover:text-pink-deeper">Tienda</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/categoria/${category.slug}`}
              className="hover:text-pink-deeper"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-text-dark">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <div className="text-center mb-10">
            <h2 className="section-title">También te puede gustar</h2>
            <div className="divider-gradient" />
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
