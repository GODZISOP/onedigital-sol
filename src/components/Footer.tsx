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
          <div className={styles.contactItem} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> +1 910-865-1070
            </div>
            <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '1.5rem', marginTop: '0.2rem' }}>(Ask for Amber or Brian)</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={16} /> eastcoastdesignsnc@gmail.com
          </div>
          <div className={styles.contactItem}>
            <MapPin size={16} /> 781 Tobermory Rd, Fayetteville, NC 28306
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
