import styles from "./ContainerLarge.module.css";

const ContainerLarge = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export { ContainerLarge };
