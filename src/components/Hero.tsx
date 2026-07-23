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
          <Link href="/get-started" className={styles.primaryButton}>
            Get Started
          </Link>
          <span className={styles.orText}>or</span>
          <Link href="/quote" className={styles.secondaryLink}>
            Get a Quick Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
