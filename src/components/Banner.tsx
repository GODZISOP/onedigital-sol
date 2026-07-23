import Link from 'next/link';
import styles from './Banner.module.css';

export default function Banner() {
  return (
    <section className={styles.banner}>
      <h2 className={styles.title}>20% OFF - ON YOUR FIRST ORDER</h2>
      <Link href="/design" className={styles.button}>
        Start Designing
      </Link>
    </section>
  );
}
