'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Testimonial.module.css';
import Image from 'next/image';

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "CEO",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: "/testimonial-avatar.png"
    },
    {
      id: 2,
      name: "John Doe",
      role: "CEO",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: "/testimonial2.png"
    },
    {
      id: 3,
      name: "John Doe",
      role: "CEO",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: "/testimonial3.png"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const setTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const current = testimonials[currentIndex];

  return (
    <section className={styles.section}>
      <div className={styles.watermark}>TESTIMONIALS</div>
      
      <div className={styles.container}>
        <h2 className={styles.title}>CLIENTS FEEDBACK</h2>
        
        <div className={styles.carousel}>
          <button className={styles.arrow} aria-label="Previous" onClick={prevTestimonial}>
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {testimonials.map((t) => (
                <div key={t.id} className={styles.testimonialSlide}>
                  <div className={styles.avatar}>
                    <Image src={t.image} alt={t.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  
                  <p className={styles.quote}>
                    {t.quote}
                  </p>
                  
                  <div className={styles.author}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              ))}
            </div>
            
            <div className={styles.dots}>
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => setTestimonial(index)}
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
            </div>
          </div>
          
          <button className={styles.arrow} aria-label="Next" onClick={nextTestimonial}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
