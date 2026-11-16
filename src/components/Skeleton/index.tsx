import styles from "./Skeleton.module.css";

const ITEM_COUNT = 6;

export function Skeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {Array.from({ length: ITEM_COUNT }).map((_, index) => (
          <div key={index} className={styles.cardSkeleton}>
            <div className={styles.headerPlaceholder} />
            <div className={styles.textPlaceholder} />
            <div className={styles.textPlaceholderShort} />
            <div className={styles.buttonPlaceholder} />
          </div>
        ))}
      </div>
    </div>
  );
}