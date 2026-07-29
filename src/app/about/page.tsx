import React from 'react';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.subtitle}>
          Dedicated to quality, community values, and premium custom graphics since 1996.
        </p>
      </section>

      <section className={styles.content}>
        <p>
          Founded in 1996 by James and Vicki Baker, our company began as a small, family-run business built on dedication, quality, and community values. Over the years, we have grown steadily while maintaining the same friendly, customer-focused approach that has defined us from the start.
        </p>
        <p>
          In 2025, ownership transitioned to Lisa McDonald and her family, who continue to honor the company's legacy while driving innovation, growth, and expansion into new markets. Under their leadership, our commitment to exceptional service, creativity, and community partnerships remains stronger than ever.
        </p>
        <p>
          Located at 781 Tobermory Road in Fayetteville, North Carolina, we specialize in custom graphics and team sports apparel, proudly serving local and regional athletic teams, schools, businesses, and organizations.
        </p>
      </section>
    </main>
  );
}
