import Image from 'next/image';
import styles from './Cheer.module.css';

const cheerImages = [
  { src: '/cheer3.png', alt: 'Cheer Image 1' },
  { src: '/cheer4.png', alt: 'Cheer Image 2' },
  { src: '/cheer5.png', alt: 'Cheer Image 3' },
  { src: '/cheer6.png', alt: 'Cheer Image 4' },
];

export default function Cheer() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>PUT A LITTLE CHEER IN YOUR LIFE!</h2>
      <div className={styles.grid}>
        {cheerImages.map((img, idx) => (
          <div key={idx} className={styles.imageWrapper}>
            <Image 
              src={img.src} 
              alt={img.alt} 
              fill 
              className={styles.image} 
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}
