import styles from "./PreLoader.module.css";

const PreLoader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
};

export { PreLoader };
