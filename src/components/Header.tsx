import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="East Coast Designs" width={130} height={45} priority style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>Home</Link>
          <Link href="/products" className={styles.navItem}>
            Products <ChevronDown size={16} />
          </Link>
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
      </div>
    </header>
  );
}
