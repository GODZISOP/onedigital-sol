import React from 'react';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.subtitle}>
          Welcome to East Coast Designs. We are dedicated to providing the highest quality custom athletic wear and apparel.
        </p>
      </section>

      <section className={styles.content}>
        <p>
          [Placeholder for About Content]
        </p>
        <p>
          (Client will provide the content from the old webpage to replace this placeholder.)
        </p>
      </section>
    </main>
  );
}
