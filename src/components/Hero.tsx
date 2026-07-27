import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
      >
        <source src="/hero_video.mp4" type="video/mp4" />
      </video>

      <div className={styles.content}>
        <h1 className={styles.title}>
          CUSTOM T-SHIRTS<br />FOR LESS
        </h1>
        <p className={styles.subtitle}>
          Design your own custom t-shirts and save.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/design" className={styles.primaryButton}>
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
