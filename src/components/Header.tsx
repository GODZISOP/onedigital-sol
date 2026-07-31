'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() !== '') {
      router.push(`/products?search=${encodeURIComponent(val.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo_red.png" alt="East Coast Designs" width={180} height={60} priority style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>Home</Link>
          <div className={styles.navItemWithDropdown}>
            <Link href="/products" className={styles.navItem}>
              Products <ChevronDown size={16} />
            </Link>
            <div className={styles.dropdownMenu}>
              <Link href="https://www.momentecbrands.com/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Badger Sportswear</Link>
              <Link href="https://www.carolinamade.com/cgi-bin/live/wam_tmpl/marketing.p?site=CMD&layout=Base_b2b&page=homepage" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Carolina Made</Link>
              <Link href="https://shop.champrosports.com/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Champro Sports</Link>
              <Link href="https://www.companycasuals.com/eastcoastdesigns/start.jsp" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Company Casuals</Link>
              <Link href="https://www.momentecbrands.com/pacific-headwear" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Pacific Headwear</Link>
              <Link href="http://lostredirect.dnsmadeeasy.com/lostredirect.html" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Richardson Caps</Link>
              <Link href="https://dealer.rothco.com/EastCoastDesigns/2018" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Rothco</Link>
              <Link href="https://zappedheadwear.com/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>Zapped Hats</Link>
            </div>
          </div>
          <Link href="/about" className={styles.navItem}>About</Link>
          <Link href="/contact" className={styles.navItem}>Contact</Link>
        </nav>
      </div>

      <div className={styles.actions}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={18} />
          </button>
        </form>

        <div className={styles.iconGroup}>
          <Link href="/checkout" className={styles.cartWrapper}>
            <ShoppingCart size={24} color="black" />
            <span className={styles.cartBadge}>{cartCount}</span>
          </Link>
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
