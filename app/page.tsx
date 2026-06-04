import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import { getCategories, getFeaturedProducts, getNewProducts } from '@/lib/data/queries';

export default async function HomePage() {
  const [categories, featured, news] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewProducts(),
  ]);
  return (
    <>
      <HeroSlider />
      <CategoryGrid categories={categories} />
      <BenefitsSection />
      <FeaturedProducts featured={featured} news={news} />
    </>
  );
}
