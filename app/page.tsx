import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryGrid />
      <BenefitsSection />
      <FeaturedProducts />
    </>
  );
}
