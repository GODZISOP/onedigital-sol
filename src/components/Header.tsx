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
              <Link href="https://www.carolinamade.com/cgi-bin/live/wam_tmpl/marketing.p?site=CMD&layout=Base_b2b&page=homepage" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Carolina Made</Link>
              <Link href="https://shop.champrosports.com/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Champro Sports</Link>
              <Link href="https://www.companycasuals.com/eastcoastdesigns/start.jsp" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Company Casuals</Link>
              <Link href="https://www.marcoawardsgroup.com/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Discount Trophy</Link>
              <Link href="https://www.high5sportswear.com/webapp/wcs/stores/servlet/StoreCatalogDisplayView?storeId=39551&catalogId=11051" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>High5 Sportswear</Link>
              <Link href="https://www.momentecbrands.com/pacific-headwear" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Pacific Headwear</Link>
              <Link href="http://lostredirect.dnsmadeeasy.com/lostredirect.html" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Richardson Caps</Link>
              <Link href="https://www.fsgdal.com/lander" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Teamwork Apparel</Link>
              <Link href="https://dealer.rothco.com/EastCoastDesigns/2018" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Rothco</Link>
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
