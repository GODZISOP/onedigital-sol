'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts, Product } from '@/lib/products';
import styles from './FeaturedItems.module.css';

export default function FeaturedItems() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allProducts = await fetchProducts();
      
      // User explicitly marked featured products, sorted with MOST RECENTLY MARKED at the very top!
      const userFeatured = allProducts
        .filter(p => p.is_featured)
        .sort((a, b) => {
          const timeA = a.updated_at ? new Date(a.updated_at).getTime() : (typeof a.id === 'number' ? a.id : 0);
          const timeB = b.updated_at ? new Date(b.updated_at).getTime() : (typeof b.id === 'number' ? b.id : 0);
          return timeB - timeA;
        });

      if (userFeatured.length > 0) {
        setFeaturedProducts(userFeatured);
      } else {
        // Initial fallback before user selects any featured item
        setFeaturedProducts(allProducts.slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.subtitle}>NEW ARRIVALS</div>
        <h2 className={styles.title}>FEATURED ITEMS</h2>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div style={{ textDecoration: 'none', textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#666' }}>
            Loading featured items...
          </div>
        ) : featuredProducts.length > 0 ? (
          featuredProducts.map((item) => (
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
                ${item.price.toFixed(2)} <span style={{ fontSize: '0.65em', color: '#999', fontWeight: 'normal' }}>inc. VAT</span>
              </p>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#666' }}>
            No featured items selected yet. Mark products as Featured in Admin Panel!
          </div>
        )}
      </div>
    </section>
  );
}
