'use client';

import { MapPin, Phone, Calendar, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        
        <div className={styles.column}>
          <h3 className={styles.colTitle}>LINKS</h3>
          <Link href="/account" className={styles.link}>My Account</Link>
          <Link href="/design" className={styles.link}>Start Designing</Link>
          <Link href="/cart" className={styles.link}>Cart</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>PRODUCTS</h3>
          <Link href="/products" className={styles.link}>All Products</Link>
          <Link href="/t-shirts" className={styles.link}>T-Shirts</Link>
          <Link href="/hoodies" className={styles.link}>Hoodies</Link>
          <Link href="/sweaters" className={styles.link}>Sweaters</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>INFORMATION</h3>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/faq" className={styles.link}>FAQ's</Link>
          <Link href="/shipping" className={styles.link}>Shipping & Return</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>CONTACT</h3>
          <div className={styles.contactItem}>
            <Phone size={16} /> (910) 865-1070
          </div>
          <div className={styles.contactItem}>
            <MapPin size={16} /> 781 Tobermory Rd. Fayetteville,NC 28306
          </div>
          <div className={styles.contactItem}>
            <Calendar size={16} /> Mon - Thurs 9AM - 5 PM
          </div>
          
          <div className={styles.social}>
            <Link href="#" className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </Link>
          </div>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>©2026 East Coast Designs. All Rights Reserved.</p>
        <button className={styles.backToTop} onClick={scrollToTop} aria-label="Back to top">
          <ChevronUp size={24} color="white" />
        </button>
      </div>
    </footer>
  );
}
