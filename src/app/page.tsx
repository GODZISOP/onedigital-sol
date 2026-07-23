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
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ScrollReveal>
          <Hero />
        </ScrollReveal>
        <ScrollReveal>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <FeaturedItems />
        </ScrollReveal>
        <ScrollReveal>
          <Banner />
        </ScrollReveal>
        <ScrollReveal>
          <PopularItems />
        </ScrollReveal>
        <ScrollReveal>
          <Cheer />
        </ScrollReveal>
        <ScrollReveal>
          <Testimonial />
        </ScrollReveal>
        <ScrollReveal>
          <Newsletter />
        </ScrollReveal>
        <Footer />
      </main>
    </>
  );
}
