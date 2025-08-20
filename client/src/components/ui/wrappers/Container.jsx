import styles from "./Container.module.css";

const Container = ({ children, size = "medium" }) => {
  return <div className={`${styles.container} ${styles[size]}`}>{children}</div>;
};

export { Container };
