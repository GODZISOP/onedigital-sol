import Image from 'next/image';
import Link from 'next/link';
import { dummyProducts } from '@/data/products';
import styles from './FeaturedItems.module.css';

export default function FeaturedItems() {
  const items = dummyProducts.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>NEW ARRIVALS</div>
        <h2 className={styles.title}>FEATURED ITEMS</h2>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <Link href={`/product/${item.id}`} key={item.id} className={styles.item} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.imageWrapper}>
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className={styles.itemImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className={styles.itemTitle}>{item.name}</h3>
            <p className={styles.itemPrice}>
              ${item.price.toFixed(2)} <span style={{ fontSize: '0.65em', color: '#999', fontWeight: 'normal' }}>inc. VAT</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
