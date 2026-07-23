import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import FeaturedItems from '@/components/FeaturedItems';
import Banner from '@/components/Banner';
import PopularItems from '@/components/PopularItems';
import Cheer from '@/components/Cheer';
import Testimonial from '@/components/Testimonial';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <FeaturedItems />
        <Banner />
        <PopularItems />
        <Cheer />
        <Testimonial />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
}
