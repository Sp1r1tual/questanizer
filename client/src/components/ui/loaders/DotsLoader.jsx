import styles from "./DotsLoader.module.css";

const DotsLoader = () => {
  return (
    <div className={styles.dotsContainer}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};

export { DotsLoader };
