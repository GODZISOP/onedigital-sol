'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Testimonial.module.css';
import Image from 'next/image';

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "Jane Smith",
      role: "Designer",
      quote: "This service completely transformed how we handle our apparel design! Highly recommended for anyone looking for premium quality.",
      image: "/testimonial-avatar.png"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Creative Director",
      quote: "I've never worked with a team this responsive and talented. The final products were perfectly on brand.",
      image: "/testimonial2.png"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Founder",
      quote: "Absolutely blown away by the attention to detail. Fast delivery and stellar communication throughout the whole process.",
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
        
        <div className={styles.content}>
          <button className={styles.navButton} aria-label="Previous" onClick={prevTestimonial}>
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.testimonialBody}>
            <div className={styles.avatar}>
              <Image src={current.image} alt={current.name} fill style={{ objectFit: 'cover' }} />
            </div>
            
            <p className={styles.quote}>
              {current.quote}
            </p>
            
            <div className={styles.authorBox}>
              <h4 className={styles.author}>{current.name}</h4>
              <p className={styles.role}>{current.role}</p>
            </div>
            
            <div className={styles.dots}>
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setTestimonial(index)}
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
            </div>
          </div>
          
          <button className={styles.navButton} aria-label="Next" onClick={nextTestimonial}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
