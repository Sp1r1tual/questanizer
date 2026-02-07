import styles from "./Loader.module.css";

const Loader = ({ contained }) => {
  return (
    <div className={`${styles.overlay} ${contained ? styles.contained : ""}`}>
      <div className={styles.spinner} />
    </div>
  );
};

export { Loader };
