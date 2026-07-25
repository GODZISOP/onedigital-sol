import Image from 'next/image';
import Link from 'next/link';
import { dummyProducts } from '@/data/products';
import styles from './PopularItems.module.css';

export default function PopularItems() {
  const items = dummyProducts.slice(2, 5);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>BEST SELLERS</div>
        <h2 className={styles.title}>POPULAR ITEMS</h2>
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
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className={styles.itemTitle}>{item.name}</h3>
            <p className={styles.itemPrice}>
              ${item.price.toFixed(2)} <span className={styles.vat}>inc. VAT</span>
            </p>
          </Link>
        ))}
      </div>

      <Link href="/products" className={styles.viewMore}>
        View More Products
      </Link>
    </section>
  );
}
