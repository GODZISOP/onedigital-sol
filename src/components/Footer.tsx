'use client';

import { MapPin, Phone, Mail, Calendar, ChevronUp } from 'lucide-react';
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
          <Link href="/design" className={styles.link}>Start Designing</Link>
          <Link href="/products" className={styles.link}>Product Catalog</Link>
          <Link href="/checkout" className={styles.link}>Checkout</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>PRODUCTS</h3>
          <Link href="/products" className={styles.link}>All Products</Link>
          <Link href="/products" className={styles.link}>Custom T-Shirts</Link>
          <Link href="/products" className={styles.link}>Hoodies & Sweaters</Link>
          <Link href="/products" className={styles.link}>Hats & Caps</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>INFORMATION</h3>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/contact" className={styles.link}>Contact Us</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.colTitle}>CONTACT</h3>
          <div className={styles.contactItem}>
            <a href="tel:+19108651070" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
              <Phone size={16} /> +1 910-865-1070
            </a>
          </div>
          <div className={styles.contactItem}>
            <a href="mailto:eastcoastdesignsnc@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
              <Mail size={16} /> eastcoastdesignsnc@gmail.com
            </a>
          </div>
          <div className={styles.contactItem}>
            <a href="https://www.google.com/maps/search/?api=1&query=781+Tobermory+Rd,+Fayetteville,+NC+28306" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
              <MapPin size={16} /> 781 Tobermory Rd, Fayetteville, NC 28306
            </a>
          </div>
          <div className={styles.contactItem}>
            <Calendar size={16} /> Mon - Thurs 9AM - 5 PM
          </div>
          
          <div className={styles.social}>
            <a href="https://www.facebook.com/p/East-coast-designs-and-embroidery-61578722877065/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.linkedin.com/company/east-coast-designs" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
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
