import Image from 'next/image';
import styles from './Cheer.module.css';

export default function Cheer() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>PUT A LITTLE CHEER IN YOUR LIFE!</h2>
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <Image src="/cheer1.png" alt="Cheer 1" fill className={styles.image} />
        </div>
        <div className={styles.imageWrapper}>
          <Image src="/cheer2.png" alt="Cheer 2" fill className={styles.image} />
        </div>
      </div>
    </section>
  );
}
