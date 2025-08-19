import styles from "./ContainerMedium.module.css";

const ContainerMedium = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export { ContainerMedium };
