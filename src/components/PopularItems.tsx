'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts, Product } from '@/lib/products';
import styles from './PopularItems.module.css';

export default function PopularItems() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allProducts = await fetchProducts();
      
      // User explicitly marked popular products, sorted with MOST RECENTLY MARKED at the very top!
      const userPopular = allProducts
        .filter(p => p.is_popular)
        .sort((a, b) => {
          const timeA = a.updated_at ? new Date(a.updated_at).getTime() : (typeof a.id === 'number' ? a.id : 0);
          const timeB = b.updated_at ? new Date(b.updated_at).getTime() : (typeof b.id === 'number' ? b.id : 0);
          return timeB - timeA;
        });

      if (userPopular.length > 0) {
        setPopularProducts(userPopular);
      } else {
        // Initial fallback before user selects any popular item
        setPopularProducts(allProducts.slice(3, 9));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>BEST SELLERS</div>
        <h2 className={styles.title}>POPULAR ITEMS</h2>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#666' }}>
            Loading popular items...
          </div>
        ) : popularProducts.length > 0 ? (
          popularProducts.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className={styles.item} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className={styles.itemImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={item.image.startsWith('http') || item.image.startsWith('data:')}
                />
              </div>
              <h3 className={styles.itemTitle}>{item.name}</h3>
              <p className={styles.itemPrice}>
                ${item.price.toFixed(2)} <span className={styles.vat}>inc. VAT</span>
              </p>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#666' }}>
            No popular items selected yet. Mark products as Popular in Admin Panel!
          </div>
        )}
      </div>

      <Link href="/products" className={styles.viewMore}>
        View More Products
      </Link>
    </section>
  );
}
