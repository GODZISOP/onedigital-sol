import { Shirt, Truck, Medal } from 'lucide-react';
import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.grid}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Shirt size={28} strokeWidth={2.5} />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.featureTitle}>OVER 10 MILLION</h3>
            <p className={styles.featureDesc}>Shirts Printed Since 2014</p>
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Truck size={28} strokeWidth={2.5} />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.featureTitle}>FREE SHIPPING</h3>
            <p className={styles.featureDesc}>Over Order $1000</p>
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Medal size={28} strokeWidth={2.5} />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.featureTitle}>QUALITY GUARANTEE</h3>
            <p className={styles.featureDesc}>Top Quality Material</p>
          </div>
        </div>
      </div>
    </section>
  );
}
