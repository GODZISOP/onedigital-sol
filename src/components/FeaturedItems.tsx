import Image from 'next/image';
import styles from './FeaturedItems.module.css';

export default function FeaturedItems() {
  const items = [
    { id: 1, title: 'HOODED SWEATSHIRT', price: '$29.00', image: '/featureimage1.png' },
    { id: 2, title: 'GILDAN COTTON T-SHIRT', price: '$29.00', image: '/featureimage2.png' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>NEW ARRIVALS</div>
        <h2 className={styles.title}>FEATURED ITEMS</h2>
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
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemPrice}>{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
