import styles from "./PageContainer.module.css";

const PageContainer = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export { PageContainer };
