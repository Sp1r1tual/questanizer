import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div data-testid="loader" className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
};

export { Loader };
