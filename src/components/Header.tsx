'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="East Coast Designs" width={100} height={35} priority style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>Home</Link>
          <div className={styles.navItemWithDropdown}>
            <Link href="/products" className={styles.navItem}>
              Products <ChevronDown size={16} />
            </Link>
            <div className={styles.dropdownMenu}>
              <Link href="/products/badger-sportswear" className={styles.dropdownItem}>Badger Sportswear</Link>
              <Link href="/products/carolina-made" className={styles.dropdownItem}>Carolina Made</Link>
              <Link href="/products/champro-sports" className={styles.dropdownItem}>Champro Sports</Link>
              <Link href="/products/company-casuals" className={styles.dropdownItem}>Company Casuals</Link>
              <Link href="/products/discount-trophy" className={styles.dropdownItem}>Discount Trophy</Link>
              <Link href="/products/high5-sportswear" className={styles.dropdownItem}>High5 Sportswear</Link>
              <Link href="/products/pacific-headwear" className={styles.dropdownItem}>Pacific Headwear</Link>
              <Link href="/products/richardson-caps" className={styles.dropdownItem}>Richardson Caps</Link>
              <Link href="/products/teamwork-apparel" className={styles.dropdownItem}>Teamwork Apparel</Link>
              <Link href="/products/rothco" className={styles.dropdownItem}>Rothco</Link>
            </div>
          </div>
          <Link href="/about" className={styles.navItem}>About</Link>
          <Link href="/contact" className={styles.navItem}>Contact</Link>
        </nav>
      </div>

      <div className={styles.actions}>
        <form className={styles.searchForm}>
          <input type="text" placeholder="Search..." className={styles.searchInput} />
          <button type="button" className={styles.searchButton}>
            <Search size={18} />
          </button>
        </form>

        <div className={styles.iconGroup}>
          <div className={styles.cartWrapper}>
            <ShoppingCart size={24} color="black" />
            <span className={styles.cartBadge}>0</span>
          </div>
          <Link href="/account">
            <User size={24} color="black" />
          </Link>
        </div>

        <Link href="/design" className={styles.designButton}>
          Start Designing
        </Link>
        
        <button className={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuContent}>
            <button className={styles.closeMenuButton} onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <nav className={styles.mobileNav}>
              <Link href="/" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link href="/about" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <Link href="/design" className={styles.mobileDesignButton} onClick={() => setIsMobileMenuOpen(false)}>Start Designing</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
