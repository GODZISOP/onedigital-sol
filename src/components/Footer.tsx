import { MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
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
            <Clock size={16} /> Mon - Thurs 9AM - 5 PM
          </div>
          
          <div className={styles.social}>
            <Link href="#" className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
