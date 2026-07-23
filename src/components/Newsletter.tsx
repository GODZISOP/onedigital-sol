'use client';

import { Send, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.galleryStrip}>
        <div className={styles.galleryImage}>
          <Image src="/gallery1_new.jpg" alt="Gallery 1" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.galleryImage}>
          <Image src="/gallery2_new.jpg" alt="Gallery 2" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.galleryImage}>
          <Image src="/gallery3_new.jpg" alt="Gallery 3" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.galleryImage}>
          <Image src="/gallery4_new.jpg" alt="Gallery 4" fill style={{ objectFit: 'cover' }} />
        </div>
      </div>
      <section className={styles.newsletterSection}>
        <div className={styles.content}>
          <h2 className={styles.title}>JOIN OUR MAILING LIST GET EXCLUSIVE OFFERS AND UPDATES</h2>
          <form className={styles.form}>
            <input type="email" placeholder="Email" className={styles.input} />
            <button type="button" className={styles.button}>
              <Send size={20} color="black" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
