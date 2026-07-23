import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import styles from './Testimonial.module.css';

export default function Testimonial() {
  return (
    <section className={styles.section}>
      <div className={styles.watermark}>TESTIMONIALS</div>
      
      <div className={styles.content}>
        <h2 className={styles.title}>CLIENTS FEEDBACK</h2>
        
        <div className={styles.carousel}>
          <button className={styles.arrow}><ChevronLeft size={24} /></button>
          
          <div className={styles.testimonialBody}>
            <div className={styles.avatar}>
              <Image src="/testimonial-avatar.png" alt="Client" fill style={{ objectFit: 'cover' }} />
            </div>
            
            <p className={styles.quote}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            
            <div className={styles.author}>John Doe</div>
            <div className={styles.role}>CEO</div>
          </div>
          
          <button className={styles.arrow}><ChevronRight size={24} /></button>
        </div>
        
        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dotActive}`}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </section>
  );
}
