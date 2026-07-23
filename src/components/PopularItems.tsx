import Image from 'next/image';
import Link from 'next/link';
import styles from './PopularItems.module.css';

export default function PopularItems() {
  const items = [
    { id: 1, title: 'NO EXCUSE', price: '29.00$', image: '/popularimage1.png' },
    { id: 2, title: 'STRIPE TANK TOP', price: '29.00$', image: '/popularimage2.png' },
    { id: 3, title: 'NORMAL IS BORING', price: '29.00$', image: '/popularimage3.png' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>BEST SELLERS</div>
        <h2 className={styles.title}>POPULAR ITEMS</h2>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.imageWrapper}>
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className={styles.itemImage}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemPrice}>
              {item.price} <span className={styles.vat}>inc. VAT</span>
            </p>
          </div>
        ))}
      </div>

      <Link href="/products" className={styles.viewMore}>
        View More Products
      </Link>
    </section>
  );
}
