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
